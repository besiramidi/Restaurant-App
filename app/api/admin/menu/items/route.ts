import { z } from "zod";
import { prisma } from "@/lib/db";

const itemSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).optional().nullable(),
  price: z.number().nonnegative(),
  imageUrl: z.string().url().max(500).optional().nullable(),
  available: z.boolean().optional().default(true),
  categoryId: z.number().int().positive(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = itemSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const item = await prisma.menuItem.create({ data: parsed.data });
  return Response.json(item, { status: 201 });
}
