"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { ReactNode } from "react";

interface AnimatedCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  features: string[];
  index: number;
  gradient: string;
}

export default function AnimatedCard({ 
  icon, 
  title, 
  description, 
  features, 
  index, 
  gradient 
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -10, 
        rotateX: 5,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      className="perspective-1000"
    >
      <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm relative overflow-hidden group">
        {/* Background Glow */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
        
        <CardHeader className="text-center pb-4 relative z-10">
          <motion.div 
            className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-lg flex items-center justify-center mx-auto mb-4 relative`}
            whileHover={{ 
              scale: 1.1, 
              rotate: 5,
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              whileHover={{ scale: 1.2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {icon}
            </motion.div>
            
            {/* Icon Glow Effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-lg blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <CardTitle className="text-lg">{title}</CardTitle>
          </motion.div>
        </CardHeader>
        
        <CardContent className="text-center relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.4 }}
          >
            <CardDescription className="text-gray-600 mb-4">
              {description}
            </CardDescription>
          </motion.div>
          
          <div className="space-y-2 text-sm text-gray-500">
            {features.map((feature, featureIndex) => (
              <motion.div
                key={featureIndex}
                className="flex items-center justify-center space-x-2"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: index * 0.1 + 0.5 + featureIndex * 0.1 
                }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </motion.div>
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
