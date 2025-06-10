"use client";

import React, { useEffect, useState } from "react";

import { RegisterModal } from "@/components/modals/RegisterModal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <RegisterModal />
    </>
  );
};