import { z } from "zod";
import { prisma } from "@/lib/db";

const reservationSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().nullable(),
  partySize: z.number().int().min(1).max(20),
  date: z.string().datetime({ offset: true }).or(z.string().datetime()),
  notes: z.string().trim().max(500).optional().nullable(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const upcoming = searchParams.get("upcoming");

  const reservations = await prisma.reservation.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(upcoming === "1" ? { date: { gte: new Date() } } : {}),
    },
    orderBy: { date: "asc" },
    include: { table: true },
  });
  return Response.json(reservations);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = reservationSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const date = new Date(data.date);
  if (Number.isNaN(date.getTime())) {
    return Response.json({ error: "Invalid date" }, { status: 400 });
  }
  if (date.getTime() < Date.now()) {
    return Response.json(
      { error: "Date must be in the future" },
      { status: 400 },
    );
  }

  // find a free table that fits the party (optional auto-assign)
  const tables = await prisma.table.findMany({
    where: { capacity: { gte: data.partySize } },
    orderBy: { capacity: "asc" },
  });
  let tableId: number | null = null;
  const window = 2 * 60 * 60 * 1000; // 2h block
  for (const t of tables) {
    const conflict = await prisma.reservation.findFirst({
      where: {
        tableId: t.id,
        status: { in: ["pending", "confirmed"] },
        date: {
          gte: new Date(date.getTime() - window),
          lte: new Date(date.getTime() + window),
        },
      },
    });
    if (!conflict) {
      tableId = t.id;
      break;
    }
  }

  const reservation = await prisma.reservation.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      partySize: data.partySize,
      date,
      notes: data.notes ?? null,
      status: tableId ? "confirmed" : "pending",
      tableId,
    },
    include: { table: true },
  });

  return Response.json(reservation, { status: 201 });
}
