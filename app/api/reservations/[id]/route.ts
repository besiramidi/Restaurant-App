import type { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const patchSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]).optional(),
  tableId: z.number().int().nullable().optional(),
});

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/reservations/[id]">,
) {
  const { id } = await ctx.params;
  const reservation = await prisma.reservation.findUnique({
    where: { id: Number(id) },
    include: { table: true },
  });
  if (!reservation) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json(reservation);
}

export async function PATCH(
  req: NextRequest,
  ctx: RouteContext<"/api/reservations/[id]">,
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
  const reservation = await prisma.reservation.update({
    where: { id: Number(id) },
    data: parsed.data,
    include: { table: true },
  });
  return Response.json(reservation);
}

export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/reservations/[id]">,
) {
  const { id } = await ctx.params;
  await prisma.reservation.delete({ where: { id: Number(id) } });
  return new Response(null, { status: 204 });
}
