import { prisma } from "@/app/_lib/prisma";
import { auth } from "@/app/_lib/auth";

export async function getUserSermons() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.sermon.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: {
        select: { messages: true },
      },
    },
  });
}

export async function getSermon(id: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const sermon = await prisma.sermon.findUnique({
    where: { id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!sermon || sermon.userId !== session.user.id) return null;

  return sermon;
}
