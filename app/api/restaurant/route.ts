import { prisma } from "@/lib/db";

export async function GET() {
  const restaurant = await prisma.restaurant.findFirst();
  return Response.json(restaurant);
}
