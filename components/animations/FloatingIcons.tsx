"use client";
import { motion } from "framer-motion";
import { 
  Code, 
  Palette, 
  Database, 
  Smartphone, 
  Globe, 
  Zap,
  Heart,
  Star,
  Rocket,
  Target
} from "lucide-react";

const icons = [
  Code, Palette, Database, Smartphone, Globe, 
  Zap, Heart, Star, Rocket, Target
];

export default function FloatingIcons() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
      {icons.map((Icon, index) => (
        <motion.div
          key={index}
          className="absolute text-blue-300/20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            rotate: [0, 360],
            scale: [0.5, 1, 0.5],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: Math.random() * 15 + 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 10,
          }}
        >
          <Icon size={24 + Math.random() * 24} />
        </motion.div>
      ))}
    </div>
  );
}
