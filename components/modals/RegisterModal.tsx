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
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: { name: values.name },
          emailRedirectTo: undefined, // メール確認を無効化
        },
      });

      if (error) {
        setError(error.message);
        showToast("登録に失敗しました: " + error.message, "error");
        return;
      }

      // 認証ユーザー作成後、usersテーブルにも登録
      const user = data.user;
      if (user) {
        // 既存ユーザーチェック
        const { data: existingUser } = await supabase
          .from('users')
          .select()
          .eq('id', user.id)
          .single();

        // 既存ユーザーがいない場合のみinsert
        if (!existingUser) {
          const { error: dbError } = await supabase.from("users").insert([
            {
              id: user.id,
              name: values.name,
              email: values.email,
              created_at: new Date().toISOString(),
            },
          ]);
          if (dbError) {
            const errorMessage = dbError.message.includes("duplicate key value") 
              ? "このユーザーはすでに登録されています"
              : "DB登録に失敗しました: " + dbError.message;
            
            setError(errorMessage);
            showToast(errorMessage, "error");
            return;
          }
        }

        showToast("登録が完了しました！", "success");
        handleClose();
        router.push('/dashboard');
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
            ユーザー登録
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            ユーザー登録しよう！
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Alice"
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
                  <FormLabel>Email</FormLabel>
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="******"
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
                <span>登録</span>
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};