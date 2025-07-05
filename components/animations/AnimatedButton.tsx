"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface AnimatedButtonProps {
  children: ReactNode;
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg";
  className?: string;
  onClick?: () => void;
  href?: string;
  asChild?: boolean;
  type?: "primary" | "secondary" | "accent";
}

export default function AnimatedButton({ 
  children, 
  variant = "default",
  size = "default", 
  className = "",
  onClick,
  href,
  asChild,
  type = "primary"
}: AnimatedButtonProps) {
  const buttonVariants = {
    primary: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white",
    secondary: "bg-gradient-to-r from-green-400 to-green-500 hover:from-green-600 hover:to-green-500 text-white",
    accent: "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
  };

  const ButtonComponent = (
    <motion.div
      whileHover={{ 
        scale: 1.05,
        rotateX: 5,
        rotateY: 5,
      }}
      whileTap={{ 
        scale: 0.98,
        rotateX: -5,
        rotateY: -5,
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
      className="perspective-1000"
    >
      <Button
        variant={variant}
        size={size}
        className={`
          ${buttonVariants[type]} 
          ${className} 
          relative overflow-hidden 
          shadow-lg hover:shadow-xl 
          transition-all duration-300
          border-0
          group
        `}
        onClick={onClick}
        asChild={asChild}
      >
        <motion.div className="relative z-10 flex items-center justify-center">
          {children}
          
          {/* Shimmer Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
          
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
      </Button>
    </motion.div>
  );

  return ButtonComponent;
}
