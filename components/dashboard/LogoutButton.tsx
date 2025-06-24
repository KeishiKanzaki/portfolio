"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/dashboard/actions";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogout = () => {
    startTransition(async () => {
      try {
        const result = await signOut();
        if (result.success) {
          router.push('/');
          router.refresh();
        } else {
          console.error("ログアウトエラー:", result.error);
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
