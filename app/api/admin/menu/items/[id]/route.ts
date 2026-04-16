import type { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const patchSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(500).nullable().optional(),
  price: z.number().nonnegative().optional(),
  imageUrl: z.string().url().max(500).nullable().optional(),
  available: z.boolean().optional(),
  categoryId: z.number().int().positive().optional(),
});

export async function PATCH(
  req: NextRequest,
  ctx: RouteContext<"/api/admin/menu/items/[id]">,
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
  const item = await prisma.menuItem.update({
    where: { id: Number(id) },
    data: parsed.data,
  });
  return Response.json(item);
}

export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/admin/menu/items/[id]">,
) {
  const { id } = await ctx.params;
  await prisma.menuItem.delete({ where: { id: Number(id) } });
  return new Response(null, { status: 204 });
}
