"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { useRegisterModal } from "@/hooks/useRegisterModal";

export const LoginForm = () => {
  const { onOpen }  = useRegisterModal();
  return (
    <Button 
      onClick={onOpen} 
      className="w-full"
      >
      新規登録
    </Button>
  );
}; 