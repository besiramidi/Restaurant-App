import { prisma } from "@/lib/db";

export async function GET() {
  const categories = await prisma.menuCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      items: {
        orderBy: { id: "asc" },
      },
    },
  });
  return Response.json(categories);
}
