"use client";

import { useEffect, useRef } from "react";
import { useLoginModal } from "@/hooks/useLoginModal";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const { onOpen, isOpen } = useLoginModal();
  const router = useRouter();
  const loginSuccessRef = useRef(false);

  useEffect(() => {
    // ページがロードされたらモーダルを開く
    onOpen();
  }, [onOpen]);

  useEffect(() => {
    // モーダルが閉じられた時の処理
    if (!isOpen) {
      // ログイン成功の場合は少し待ってからチェック
      setTimeout(() => {
        // ログイン成功でない場合のみホームページにリダイレクト
        if (!loginSuccessRef.current) {
          router.push("/");
        }
      }, 100);
    }
  }, [isOpen, router]);

  // ログイン成功を検知するためのグローバルイベントリスナー
  useEffect(() => {
    const handleLoginSuccess = () => {
      loginSuccessRef.current = true;
    };

    // カスタムイベントを監視
    window.addEventListener('loginSuccess', handleLoginSuccess);

    return () => {
      window.removeEventListener('loginSuccess', handleLoginSuccess);
    };
  }, []);

  return null;
};

export default LoginPage;