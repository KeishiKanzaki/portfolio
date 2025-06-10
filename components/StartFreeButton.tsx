"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRegisterModal } from "@/hooks/useRegisterModal";

export function StartFreeButton({ size = "lg", className = "" }: { size?: "lg" | "sm" | "default"; className?: string }) {
  const { onOpen } = useRegisterModal();
  return (
    <Button
      size={size}
      className={`bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg px-8 py-3 ${className}`}
      onClick={onOpen}
      type="button"
    >
      無料で始める
      <ArrowRight className="ml-2 w-5 h-5" />
    </Button>
  );
}
