"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/app/_lib/prisma";
import { registerSchema, loginSchema } from "@/app/_lib/schemas";
import { signIn, signOut } from "@/app/_lib/auth";

export async function registerUser(formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const issues = JSON.parse(parsed.error.message) as Array<{ message: string }>;
    return {
      error: issues.map((e) => e.message).join("；"),
    };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "该邮箱已被注册" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: { name, email, hashedPassword },
  });

  return { success: true };
}

export async function loginUser(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const issues = JSON.parse(parsed.error.message) as Array<{ message: string }>;
    return {
      error: issues.map((e) => e.message).join("；"),
    };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    return { error: "邮箱或密码不正确" };
  }
}

export async function logoutUser() {
  await signOut({ redirect: false });
}
