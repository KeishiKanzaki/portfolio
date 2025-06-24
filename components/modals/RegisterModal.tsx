"use client";

import React, { useState, useTransition } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EmojiPicker } from "@/components/inputs/EmojiPicker";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/auth/FormError";
import { useToast } from "@/components/providers/ToastContext";

import { useRegisterModal } from "@/hooks/useRegisterModal";
import { RegisterSchema } from "@/schemas";
import { supabase } from "@/lib/supabase";

export const RegisterModal = () => {
  const { isOpen, onClose } = useRegisterModal();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    startTransition(async () => {
      console.log("ユーザー登録試行:", values.email);
      
      // 通常のサインアップを使用
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: { name: values.name }
        },
      });
      
      if (error) {
        console.error("Supabase Auth エラー:", error);
        const errorMessage = error.message === "User already registered"
          ? "このメールアドレスは既に登録されています"
          : `登録エラー: ${error.message}`;
        setError(errorMessage);
        showToast("登録に失敗しました: " + errorMessage, "error");
        return;
      }

      const user = data?.user;
      if (user) {
        console.log("Auth登録成功:", user.id);
        
        // usersテーブルにユーザー情報を保存
        const { error: dbError } = await supabase.from("users").upsert([
          {
            id: user.id,
            name: values.name,
            email: values.email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(), // ←追加
          },
        ]);
        
        if (dbError) {
          console.error("DB登録エラー:", JSON.stringify(dbError));
          console.error("DB登録エラー詳細:", dbError?.message, dbError?.code, dbError);
          setError("ユーザー情報の保存に失敗しました");
          showToast("ユーザー情報の保存に失敗しました", "error");
          return;
        }
        
        console.log("usersテーブルに登録成功");
        showToast("登録が完了しました！自動ログインします", "success");
        handleClose();
        
        // セッションがある場合はそのまま進む
        if (data.session) {
          console.log("セッションが既に作成されています");
          router.push('/dashboard');
          return;
        }
        
        // セッションがない場合は強制ログイン
        console.log("強制ログインを実行");
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        
        if (signInError) {
          console.error("自動ログインエラー:", signInError);
          // メール確認エラーでも成功扱いにする
          if (signInError.message.includes("Email not confirmed") || signInError.message.includes("not confirmed")) {
            console.log("メール未確認だが登録は完了");
            showToast("登録完了！ダッシュボードに移動します", "success");
          } else {
            showToast("登録は完了しました。ログインページから手動でログインしてください。", "info");
          }
          router.push('/dashboard');
        } else {
          console.log("自動ログイン成功:", signInData?.user?.id);
          router.push('/dashboard');
        }
      }
    });
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="text-zinc-900 pb-8">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            アカウント作成
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            名前、メールアドレス、パスワードで簡単登録
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>名前</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="田中太郎"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
           
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メールアドレス</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="user@example.com"
                      type="email"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>パスワード</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="6文字以上"
                      type="password"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-4 w-full">
              <FormError message={error} />
              <Button
                type="submit"
                className="w-full space-x-2"
                disabled={isPending}
              >
                {isPending && <Loader2 className="animate-spin" />}
                <span>アカウント作成</span>
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};