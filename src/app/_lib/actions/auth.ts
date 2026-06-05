"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/app/_lib/prisma";
import { registerSchema, loginSchema } from "@/app/_lib/schemas";
import { signIn, signOut } from "@/app/_lib/auth";

const ALLOWED_DOMAIN = "@liao.xiaogushi.us";

function checkEmailDomain(email: string) {
  if (!email.endsWith(ALLOWED_DOMAIN)) {
    return { error: `仅限 ${ALLOWED_DOMAIN} 邮箱注册` };
  }
  return null;
}

export async function registerUser(formData: FormData): Promise<{ error?: string; success?: boolean }> {
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

  const domainCheck = checkEmailDomain(email);
  if (domainCheck) return domainCheck;

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

export async function loginUser(formData: FormData): Promise<{ error?: string; success?: boolean }> {
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

  const domainCheck = checkEmailDomain(parsed.data.email);
  if (domainCheck) return domainCheck;

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
