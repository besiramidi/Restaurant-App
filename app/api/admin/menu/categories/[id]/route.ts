import type { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const patchSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  sortOrder: z.number().int().optional(),
});

export async function PATCH(
  req: NextRequest,
  ctx: RouteContext<"/api/admin/menu/categories/[id]">,
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
  const category = await prisma.menuCategory.update({
    where: { id: Number(id) },
    data: parsed.data,
  });
  return Response.json(category);
}

export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/admin/menu/categories/[id]">,
) {
  const { id } = await ctx.params;
  await prisma.menuCategory.delete({ where: { id: Number(id) } });
  return new Response(null, { status: 204 });
}
