"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRegisterModal } from "@/hooks/useRegisterModal";

export function StartFreeButton({ size = "lg", className = "" }: { size?: "lg" | "sm" | "default"; className?: string }) {
  const { onOpen } = useRegisterModal();
  return (
    <Button
      size={size}
      className={`bg-white text-black hover:bg-gray-100 font-medium text-base sm:text-lg px-8 sm:px-12 py-3 sm:py-4 rounded-full transition-all duration-300 ${className}`}
      onClick={onOpen}
      type="button"
    >
      無料で始める
      <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
    </Button>
  );
}
