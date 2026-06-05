"use server";

import { auth } from "@/app/_lib/auth";
import { prisma } from "@/app/_lib/prisma";
import {
  createSermonSchema,
  updateSermonSchema,
} from "@/app/_lib/schemas";
import { revalidatePath } from "next/cache";

function parseZodError(error: unknown): string {
  if (error instanceof Error) {
    try {
      const issues = JSON.parse(error.message) as Array<{ message: string }>;
      return issues.map((e) => e.message).join("；");
    } catch {
      return error.message;
    }
  }
  return "验证失败";
}

export async function createSermon(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "请先登录" };
  }

  const parsed = createSermonSchema.safeParse({
    title: formData.get("title"),
    passage: formData.get("passage"),
    description: formData.get("description") || undefined,
  });

  if (!parsed.success) {
    return { error: parseZodError(parsed.error) };
  }

  const sermon = await prisma.sermon.create({
    data: {
      ...parsed.data,
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard");
  return { success: true, id: sermon.id };
}

export async function updateSermon(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };

  const sermon = await prisma.sermon.findUnique({ where: { id } });
  if (!sermon || sermon.userId !== session.user.id) {
    return { error: "讲道不存在或无权操作" };
  }

  const parsed = updateSermonSchema.safeParse({
    title: formData.get("title") || undefined,
    passage: formData.get("passage") || undefined,
    description: formData.get("description") || undefined,
    status: formData.get("status") || undefined,
  });

  if (!parsed.success) {
    return { error: parseZodError(parsed.error) };
  }

  await prisma.sermon.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath("/dashboard");
  revalidatePath(`/sermons/${id}`);
  return { success: true };
}

export async function deleteSermon(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };

  const sermon = await prisma.sermon.findUnique({ where: { id } });
  if (!sermon || sermon.userId !== session.user.id) {
    return { error: "讲道不存在或无权操作" };
  }

  await prisma.sermon.delete({ where: { id } });

  revalidatePath("/dashboard");
  return { success: true };
}
