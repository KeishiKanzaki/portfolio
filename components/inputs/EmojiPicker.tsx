"use client";

import { useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface EmojiPickerProps {
  onChange: (value: string) => void;
  value: string;
}

export const EmojiPicker = ({ onChange, value }: EmojiPickerProps) => {
  const [open, setOpen] = useState(false);

  return null;
};
