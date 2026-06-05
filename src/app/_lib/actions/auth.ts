"use server";

import { loginSchema } from "@/app/_lib/schemas";
import { signIn, signOut } from "@/app/_lib/auth";

export async function registerUser(_formData: FormData): Promise<{ error?: string; success?: boolean }> {
  return { error: "注册已关闭，请通过团队聊天 (liao.xiaogushi.us) 注册新账号" };
}

export async function loginUser(formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
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
      username: parsed.data.username,
      password: parsed.data.password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    return { error: "用户名或密码不正确" };
  }
}

export async function logoutUser() {
  await signOut({ redirect: false });
}
