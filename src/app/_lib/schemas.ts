import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "请输入姓名").max(100),
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(8, "密码至少8位").max(100),
});

export const loginSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(1, "请输入密码"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
