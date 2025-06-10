"use client";

import { useState } from "react";

type Toast = {
  id: number;
  message: string;
};

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // トーストを追加する関数（例）
  const addToast = (message: string) => {
    setToasts((prev) => [
      ...prev,
      { id: Date.now(), message }
    ]);
    setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 3000);
  };

  // 外部からaddToastを呼び出す方法は用途に応じて拡張してください

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-black text-white px-4 py-2 rounded shadow"
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
