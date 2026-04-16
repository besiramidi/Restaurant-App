import type { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const patchSchema = z.object({
  status: z.enum([
    "pending",
    "preparing",
    "ready",
    "completed",
    "cancelled",
  ]),
});

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/orders/[id]">,
) {
  const { id } = await ctx.params;
  const order = await prisma.order.findUnique({
    where: { id: Number(id) },
    include: { items: { include: { menuItem: true } } },
  });
  if (!order) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(order);
}

export async function PATCH(
  req: NextRequest,
  ctx: RouteContext<"/api/orders/[id]">,
) {
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const order = await prisma.order.update({
    where: { id: Number(id) },
    data: parsed.data,
    include: { items: { include: { menuItem: true } } },
  });
  return Response.json(order);
}

export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/orders/[id]">,
) {
  const { id } = await ctx.params;
  await prisma.order.delete({ where: { id: Number(id) } });
  return new Response(null, { status: 204 });
}
