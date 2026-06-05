import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "请输入姓名").max(100),
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(8, "密码至少8位").max(100),
});

export const loginSchema = z.object({
  username: z.string().min(1, "请输入用户名"),
  password: z.string().min(1, "请输入密码"),
});

export const createSermonSchema = z.object({
  title: z.string().min(1, "请输入讲道标题").max(200),
  passage: z.string().min(1, "请输入经文").max(200),
  description: z.string().max(500).optional(),
});

export const updateSermonSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  passage: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional(),
  status: z.enum(["DRAFT", "IN_PROGRESS", "COMPLETED"]).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateSermonInput = z.infer<typeof createSermonSchema>;
export type UpdateSermonInput = z.infer<typeof updateSermonSchema>;
