"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogout = () => {
    startTransition(async () => {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error("ログアウトエラー:", error);
        } else {
          router.push('/');
          router.refresh();
        }
      } catch (error) {
        console.error("ログアウトエラー:", error);
      }
    });
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleLogout}
      disabled={isPending}
      className="text-red-600 hover:text-red-700 disabled:opacity-50"
    >
      {isPending ? 'ログアウト中...' : 'ログアウト'}
    </Button>
  );
}
