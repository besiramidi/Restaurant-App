import { z } from "zod";
import { prisma } from "@/lib/db";

const orderItemSchema = z.object({
  menuItemId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(50),
});

const orderSchema = z.object({
  customerName: z.string().trim().min(1).max(120),
  customerEmail: z.string().trim().email().max(200),
  customerPhone: z.string().trim().max(40).optional().nullable(),
  type: z.enum(["pickup", "delivery"]),
  address: z.string().trim().max(400).optional().nullable(),
  notes: z.string().trim().max(500).optional().nullable(),
  items: z.array(orderItemSchema).min(1).max(50),
});

export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { menuItem: true } } },
  });
  return Response.json(orders);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const data = parsed.data;

  if (data.type === "delivery" && !data.address) {
    return Response.json(
      { error: "Delivery address is required" },
      { status: 400 },
    );
  }

  // look up menu items from DB (trust server prices, not client)
  const menuItemIds = data.items.map((i) => i.menuItemId);
  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: menuItemIds }, available: true },
  });
  if (menuItems.length !== new Set(menuItemIds).size) {
    return Response.json(
      { error: "One or more items unavailable" },
      { status: 400 },
    );
  }

  const priceById = new Map(menuItems.map((m) => [m.id, m.price]));
  let total = 0;
  const itemsCreate = data.items.map((i) => {
    const price = priceById.get(i.menuItemId)!;
    total += price * i.quantity;
    return {
      menuItemId: i.menuItemId,
      quantity: i.quantity,
      price,
    };
  });
  total = Math.round(total * 100) / 100;

  const order = await prisma.order.create({
    data: {
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone ?? null,
      type: data.type,
      address: data.address ?? null,
      notes: data.notes ?? null,
      total,
      items: { create: itemsCreate },
    },
    include: { items: { include: { menuItem: true } } },
  });

  return Response.json(order, { status: 201 });
}
