// actions/registerUser.ts
"use server";

import * as z from "zod";
import bcrypt from "bcrypt";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/store/user";
import { supabase } from "@/lib/supabase";

export const registerUser = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedField = RegisterSchema.safeParse(values);

  if (!validatedField.success) {
    return { error: "不正な値です" };
  }

  const { email, password, username } = validatedField.data;

  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return { error: "すでに登録されています" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { error: insertError } = await supabase.from("users").insert([
      {
        username,
        email,
        password: hashedPassword,
      },
    ]);

    if (insertError) {
      console.error("[SUPABASE_REGISTER]", insertError);
      return { error: "サーバーエラー" };
    }

    return { success: "ユーザー作成に成功しました" };
  } catch (error) {
    console.error("[REGISTER_USER]", error);
    return { error: "サーバーエラー" };
  }
};