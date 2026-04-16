import { z } from "zod";
import { prisma } from "@/lib/db";

const categorySchema = z.object({
  name: z.string().trim().min(1).max(80),
  sortOrder: z.number().int().optional().default(0),
});

export async function GET() {
  const categories = await prisma.menuCategory.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return Response.json(categories);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const category = await prisma.menuCategory.create({ data: parsed.data });
  return Response.json(category, { status: 201 });
}
