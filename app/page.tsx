"use client";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Users,
  FileText,
  User,
  Briefcase,
  Star,
  CheckCircle,
  TrendingUp,
  MessageSquare,
  Sparkles,
  Zap,
  Rocket,
  Target,
} from "lucide-react";
import Link from "next/link";
import { StartFreeButton } from "@/components/StartFreeButton";
import { useLoginModal } from "@/hooks/useLoginModal";
import { useEffect, useState } from "react";

export default function HomePage() {
  const { onOpen: onOpenLogin } = useLoginModal();
  const { scrollYProgress } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, duration: number, delay: number}>>([]);
  const [floatingElements, setFloatingElements] = useState<Array<{id: number, x: number, y: number, duration: number, delay: number, size: number}>>([]);
  const [communityParticles, setCommunityParticles] = useState<Array<{id: number, x: number, y: number, duration: number, delay: number}>>([]);
  
  const yTransform = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const scaleTransform = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  useEffect(() => {
    setIsClient(true);
    // クライアントサイドでのみパーティクルデータを生成
    const particleData = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 10 + 5,
      delay: Math.random() * 5,
    }));
    setParticles(particleData);

    // 浮遊要素データを生成
    const floatingData = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 4 + Math.random() * 4,
      delay: Math.random() * 2,
      size: 3 + Math.random() * 2,
    }));
    setFloatingElements(floatingData);

    // コミュニティセクション用パーティクル
    const communityData = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
    setCommunityParticles(communityData);
  }, []);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (typeof window !== 'undefined') {
        x.set(e.clientX / window.innerWidth - 0.5);
        y.set(e.clientY / window.innerHeight - 0.5);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', updateMousePosition);
      return () => window.removeEventListener('mousemove', updateMousePosition);
    }
  }, [x, y]);

  const backgroundVariants = {
    animate: {
      background: [
        "linear-gradient(45deg, #0f172a 0%, #1e293b 25%, #0f172a 50%, #334155 75%, #0f172a 100%)",
        "linear-gradient(45deg, #1e293b 0%, #0f172a 25%, #334155 50%, #0f172a 75%, #1e293b 100%)",
        "linear-gradient(45deg, #334155 0%, #1e293b 25%, #0f172a 50%, #1e293b 75%, #334155 100%)",
      ],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "linear" as const
      }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <motion.div 
        className="fixed inset-0 z-0"
        variants={backgroundVariants}
        animate="animate"
      />
      
      {/* Floating Particles */}
      {isClient && particles.length > 0 && (
        <div className="fixed inset-0 z-10">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30"
              animate={{
                x: [0, typeof window !== 'undefined' ? window.innerWidth * 0.8 : 800],
                y: [0, typeof window !== 'undefined' ? window.innerHeight * 0.8 : 600],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
              }}
              style={{
                left: particle.x + '%',
                top: particle.y + '%',
              }}
            />
          ))}
        </div>
      )}

      {/* Mouse Follower */}
      {isClient && (
        <motion.div
          className="fixed w-6 h-6 border-2 border-cyan-400 rounded-full pointer-events-none z-50 mix-blend-difference"
          style={{
            x: mousePosition.x - 12,
            y: mousePosition.y - 12,
          }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      )}
      
      <main className="relative z-20"
>
        {/* Header */}
        <motion.header 
          className="border-b border-cyan-500/20 bg-black/20 backdrop-blur-xl sticky top-0 z-50 shadow-2xl"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            transform: useTransform(scrollYProgress, [0, 0.1], ["translateY(0px)", "translateY(-50px)"]),
          }}
        >
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.1, rotateY: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{ 
                transformStyle: "preserve-3d",
                perspective: "1000px"
              }}
            >
              <motion.div 
                className="w-10 h-10 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-2xl"
                whileHover={{ 
                  rotateX: 360,
                  rotateY: 360,
                  scale: 1.2,
                  boxShadow: "0 20px 40px rgba(6, 182, 212, 0.5)" 
                }}
                transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(6, 182, 212, 0.3)",
                    "0 0 40px rgba(6, 182, 212, 0.6)",
                  ],
                }}
                style={{
                  animationDuration: "3s",
                  animationIterationCount: "infinite",
                  animationDirection: "alternate",
                }}
              >
                <Briefcase className="w-6 h-6 text-white" />
              </motion.div>
              <motion.span 
                className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                CareerHub
              </motion.span>
            </motion.div>
            
            <nav className="hidden md:flex items-center space-x-8">
              {['機能', 'コミュニティ', '料金'].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: -20, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 200 }}
                  whileHover={{ 
                    y: -5, 
                    scale: 1.1,
                    rotateY: 10,
                    textShadow: "0 0 20px rgba(6, 182, 212, 0.8)"
                  }}
                  className="perspective-1000"
                >
                  <Link 
                    href={`#${item.toLowerCase()}`} 
                    className="text-gray-300 hover:text-cyan-400 transition-all duration-300 relative group text-lg font-medium"
                  >
                    {item}
                    <motion.div
                      className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-500 rounded-full"
                      whileHover={{ 
                        width: "100%",
                        boxShadow: "0 0 10px rgba(6, 182, 212, 0.8)"
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-cyan-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                      whileHover={{ scale: 1.1 }}
                    />
                  </Link>
                </motion.div>
              ))}
            </nav>
            
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 50, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <StartFreeButton />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, rotateY: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-3 border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400 hover:text-cyan-300 transition-all duration-300 backdrop-blur-sm bg-black/20"
                  onClick={onOpenLogin}
                >
                  ログイン
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <section className="py-32 px-4 relative overflow-hidden">
          {/* 3D Background Elements */}
          <div className="absolute inset-0">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-64 h-64 border border-cyan-500/20 rounded-full"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${10 + i * 20}%`,
                }}
                animate={{
                  rotateZ: [0, 360],
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 10 + i * 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 2,
                }}
              />
            ))}
          </div>
          
          <div className="container mx-auto text-center max-w-6xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              style={{
                transformStyle: "preserve-3d",
                perspective: "1000px"
              }}
            >
              <motion.div
                whileHover={{ rotateY: 10, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Badge className="mb-8 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/30 text-lg px-6 py-2 backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 mr-2" />
                  就活・転職活動を一元管理
                </Badge>
              </motion.div>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-8xl font-bold mb-8 leading-tight relative"
              initial={{ opacity: 0, y: 100, rotateX: -45 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              style={{
                transformStyle: "preserve-3d",
                perspective: "1000px"
              }}
            >
              <motion.span 
                className="block text-white"
                whileHover={{ 
                  scale: 1.05,
                  textShadow: "0 0 30px rgba(6, 182, 212, 0.8)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                あなたの
              </motion.span>
              <motion.span 
                className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent relative"
                whileHover={{ 
                  scale: 1.1,
                  rotateY: 15,
                }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%"],
                }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
              >
                <motion.span
                  animate={{
                    textShadow: [
                      "0 0 20px rgba(6, 182, 212, 0.5)",
                      "0 0 40px rgba(6, 182, 212, 0.8)",
                    ],
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  キャリア
                </motion.span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-600 opacity-20 blur-2xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.span>
              <motion.span 
                className="block text-white"
                whileHover={{ 
                  scale: 1.05,
                  textShadow: "0 0 30px rgba(6, 182, 212, 0.8)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                を次のレベルへ
              </motion.span>
              
              {/* Floating Icons */}
              <motion.div
                className="absolute -top-10 -left-10"
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 360],
                }}
                transition={{ duration: 6, repeat: Infinity }}
              >
                <Rocket className="w-12 h-12 text-cyan-400" />
              </motion.div>
              <motion.div
                className="absolute -top-5 -right-5"
                animate={{
                  y: [0, -25, 0],
                  rotate: [360, 0],
                }}
                transition={{ duration: 8, repeat: Infinity, delay: 2 }}
              >
                <Target className="w-10 h-10 text-purple-400" />
              </motion.div>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
            >
              自己分析からポートフォリオ作成、ES管理まで。
              <br />
              <motion.span
                className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-semibold"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%"],
                }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
              >
                就活・転職に必要なすべてを一つのプラットフォームで。
              </motion.span>
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1.0 }}
            >
              <motion.div
                whileHover={{ 
                  scale: 1.1, 
                  rotateY: 10,
                  boxShadow: "0 20px 40px rgba(6, 182, 212, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                className="perspective-1000"
              >
                <StartFreeButton />
              </motion.div>
              
              <motion.div
                whileHover={{ 
                  scale: 1.1, 
                  rotateY: -10,
                  boxShadow: "0 20px 40px rgba(147, 51, 234, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-10 py-4 border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400 hover:text-cyan-300 transition-all duration-300 backdrop-blur-sm bg-black/20"
                  onClick={onOpenLogin}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  ログイン
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ 
                  scale: 1.1, 
                  rotateY: 10,
                  boxShadow: "0 20px 40px rgba(168, 85, 247, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-10 py-4 border-purple-400/50 text-purple-400 hover:bg-purple-400/10 hover:border-purple-400 hover:text-purple-300 transition-all duration-300 backdrop-blur-sm bg-black/20"
                  asChild
                >
                  <Link href="/demo">
                    デモを見る
                    <motion.div
                      whileHover={{ x: 8, scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </motion.div>
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="mt-16 flex items-center justify-center space-x-12 text-lg text-gray-400"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 1.4 }}
            >
              {[
                { text: '完全無料', icon: <CheckCircle className="w-6 h-6 text-green-400" /> },
                { text: '登録3分', icon: <Zap className="w-6 h-6 text-yellow-400" /> },
                { text: 'データ安全', icon: <Sparkles className="w-6 h-6 text-blue-400" /> }
              ].map((item, index) => (
                <motion.div
                  key={item.text}
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, scale: 0, rotateY: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ 
                    delay: 1.6 + index * 0.2, 
                    type: "spring", 
                    stiffness: 200 
                  }}
                  whileHover={{ 
                    scale: 1.15, 
                    y: -5,
                    rotateY: 15,
                    textShadow: "0 0 20px rgba(6, 182, 212, 0.8)"
                  }}
                  style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.3 }}
                    transition={{ duration: 0.6 }}
                  >
                    {item.icon}
                  </motion.div>
                  <span className="font-medium">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 px-4 relative overflow-hidden">
          {/* Animated Background Grid */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 grid-rows-8 h-full">
              {[...Array(64)].map((_, i) => (
                <motion.div
                  key={i}
                  className="border border-cyan-500/20"
                  animate={{
                    opacity: [0.1, 0.3, 0.1],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    delay: (i % 8) * 0.1 + Math.floor(i / 8) * 0.2,
                    repeat: Infinity,
                  }}
                />
              ))}
            </div>
          </div>
          
          <div className="container mx-auto max-w-7xl relative z-10">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 80, rotateX: -30 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
            >
              <motion.h2 
                className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent"
                whileHover={{ 
                  scale: 1.05,
                  textShadow: "0 0 40px rgba(6, 182, 212, 0.8)"
                }}
              >
                すべての機能が一つに
              </motion.h2>
              <motion.p 
                className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
                whileHover={{ scale: 1.02 }}
              >
                就活・転職活動に必要なツールを統合した
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                  オールインワンプラットフォーム
                </span>
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <User className="w-8 h-8 text-white" />,
                  title: "自己分析",
                  description: "MBTI風性格診断、価値観診断、強み・弱み分析で自分を深く理解",
                  gradient: "from-purple-500 to-pink-500",
                  features: ["多角的診断ツール", "結果の可視化"],
                  delay: 0,
                },
                {
                  icon: <Briefcase className="w-8 h-8 text-white" />,
                  title: "ポートフォリオ",
                  description: "プロジェクト管理からサイト生成まで。魅力的なポートフォリオを簡単作成",
                  gradient: "from-blue-500 to-cyan-500",
                  features: ["テンプレート豊富", "独自URL発行"],
                  delay: 0.2,
                },
                {
                  icon: <FileText className="w-8 h-8 text-white" />,
                  title: "ES管理",
                  description: "企業別ES整理、締切管理、添削機能で効率的な応募活動をサポート",
                  gradient: "from-green-500 to-emerald-500",
                  features: ["自動保存機能", "ピアレビュー"],
                  delay: 0.4,
                },
                {
                  icon: <Users className="w-8 h-8 text-white" />,
                  title: "コミュニティ",
                  description: "同じ目標を持つ仲間と繋がり、経験やノウハウを共有",
                  gradient: "from-orange-500 to-red-500",
                  features: ["業界別交流", "メンター制度"],
                  delay: 0.6,
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 100, rotateY: -45, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.8, 
                    delay: feature.delay,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    y: -15, 
                    rotateY: 10,
                    rotateX: 5,
                    scale: 1.05,
                    boxShadow: "0 30px 60px rgba(0, 0, 0, 0.3)"
                  }}
                  className="group"
                  style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
                >
                  <Card className="border-0 shadow-2xl h-full bg-black/40 backdrop-blur-xl border border-cyan-500/20 overflow-hidden relative">
                    {/* Glow Effect */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5`}
                      whileHover={{ opacity: 0.15 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    {/* Animated Border */}
                    <motion.div
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: `linear-gradient(45deg, transparent, rgba(6, 182, 212, 0.2), transparent)`,
                      }}
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    
                    <CardHeader className="relative z-10">
                      <div className="flex items-start space-x-4">
                        <motion.div 
                          className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shadow-2xl`}
                          whileHover={{ 
                            scale: 1.2, 
                            rotateY: 180,
                            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
                          }}
                          transition={{ duration: 0.6 }}
                        >
                          {feature.icon}
                        </motion.div>
                        <div className="flex-1">
                          <motion.div
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <CardTitle className="text-xl text-white mb-2 group-hover:text-cyan-300 transition-colors">
                              {feature.title}
                            </CardTitle>
                            <CardDescription className="text-gray-300 text-base leading-relaxed">
                              {feature.description}
                            </CardDescription>
                          </motion.div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="relative z-10">
                      <ul className="space-y-3">
                        {feature.features.map((item, featureIndex) => (
                          <motion.li
                            key={item}
                            className="flex items-center space-x-3"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: feature.delay + 0.2 + featureIndex * 0.1 }}
                            whileHover={{ x: 5, scale: 1.02 }}
                          >
                            <motion.div
                              whileHover={{ rotate: 360, scale: 1.2 }}
                              transition={{ duration: 0.5 }}
                            >
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            </motion.div>
                            <span className="text-gray-300 font-medium">{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                      
                      {/* Hover Effect Icons */}
                      <motion.div
                        className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100"
                        initial={{ scale: 0, rotate: -180 }}
                        whileHover={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <ArrowRight className="w-6 h-6 text-cyan-400" />
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 px-4 relative overflow-hidden">
          {/* Dynamic Background */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)",
                "linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)",
                "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)",
              ],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          
          {/* Floating Geometric Shapes */}
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${10 + (i % 4) * 20}%`,
                  top: `${20 + Math.floor(i / 4) * 60}%`,
                }}
                animate={{
                  rotateZ: [0, 360],
                  rotateY: [0, 180],
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 8 + i * 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.5,
                }}
              >
                <div className={`w-12 h-12 border-2 ${
                  i % 3 === 0 ? 'border-cyan-400/30 bg-cyan-400/5' :
                  i % 3 === 1 ? 'border-purple-400/30 bg-purple-400/5' :
                  'border-blue-400/30 bg-blue-400/5'
                } ${i % 2 === 0 ? 'rounded-full' : 'rounded-lg rotate-45'}`} />
              </motion.div>
            ))}
          </div>
          
          <div className="container mx-auto max-w-5xl relative z-10">
            <motion.div
              className="grid md:grid-cols-3 gap-12 text-center"
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              {[
                { 
                  number: "10,000+", 
                  label: "アクティブユーザー",
                  icon: <Users className="w-8 h-8" />,
                  gradient: "from-cyan-400 to-blue-500",
                  delay: 0
                },
                { 
                  number: "50,000+", 
                  label: "作成されたポートフォリオ",
                  icon: <Briefcase className="w-8 h-8" />,
                  gradient: "from-purple-400 to-pink-500",
                  delay: 0.2
                },
                { 
                  number: "95%", 
                  label: "ユーザー満足度",
                  icon: <Star className="w-8 h-8" />,
                  gradient: "from-yellow-400 to-orange-500",
                  delay: 0.4
                }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
                  whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: stat.delay, 
                    type: "spring", 
                    stiffness: 200,
                    duration: 0.8
                  }}
                  whileHover={{ 
                    scale: 1.1, 
                    y: -20,
                    rotateY: 15,
                    rotateX: 10,
                  }}
                  className="relative group"
                  style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
                >
                  {/* Card Background */}
                  <motion.div
                    className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500/20 shadow-2xl relative overflow-hidden"
                    whileHover={{
                      boxShadow: "0 30px 60px rgba(0, 0, 0, 0.3), 0 0 40px rgba(6, 182, 212, 0.2)",
                    }}
                  >
                    {/* Glow Effect */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`}
                      whileHover={{ opacity: 0.15 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    {/* Icon */}
                    <motion.div
                      className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center shadow-xl`}
                      whileHover={{ 
                        scale: 1.2, 
                        rotateY: 180,
                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="text-white">
                        {stat.icon}
                      </div>
                    </motion.div>
                    
                    {/* Number */}
                    <motion.div 
                      className={`text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent relative`}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: stat.delay + 0.3, duration: 0.5 }}
                      whileHover={{
                        scale: 1.1,
                        textShadow: "0 0 30px rgba(6, 182, 212, 0.8)",
                      }}
                    >
                      {stat.number}
                      
                      {/* Number Glow */}
                      <motion.div
                        className="absolute inset-0 text-5xl md:text-6xl font-bold opacity-20 blur-sm"
                        animate={{
                          opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {stat.number}
                      </motion.div>
                    </motion.div>
                    
                    {/* Label */}
                    <motion.div 
                      className="text-gray-300 text-lg font-medium"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: stat.delay + 0.5 }}
                      whileHover={{ 
                        color: "#ffffff",
                        scale: 1.05
                      }}
                    >
                      {stat.label}
                    </motion.div>
                    
                    {/* Animated Border */}
                    <motion.div
                      className="absolute inset-0 rounded-3xl"
                      style={{
                        background: `conic-gradient(from 0deg, transparent, rgba(6, 182, 212, 0.3), transparent)`,
                      }}
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </motion.div>
                  
                  {/* Floating Particles around card */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                        style={{
                          left: `${20 + (i % 3) * 30}%`,
                          top: `${20 + Math.floor(i / 3) * 60}%`,
                        }}
                        animate={{
                          y: [-10, -30, -10],
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Community Section */}
        <section id="community" className="py-32 px-4 relative overflow-hidden">
          {/* Animated Background Waves */}
          <div className="absolute inset-0">
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <motion.path
                d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z"
                fill="rgba(6, 182, 212, 0.05)"
                animate={{
                  d: [
                    "M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z",
                    "M0,50 Q25,70 50,50 T100,50 L100,100 L0,100 Z",
                    "M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z",
                  ],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.path
                d="M0,60 Q25,40 50,60 T100,60 L100,100 L0,100 Z"
                fill="rgba(147, 51, 234, 0.05)"
                animate={{
                  d: [
                    "M0,60 Q25,40 50,60 T100,60 L100,100 L0,100 Z",
                    "M0,60 Q25,80 50,60 T100,60 L100,100 L0,100 Z",
                    "M0,60 Q25,40 50,60 T100,60 L100,100 L0,100 Z",
                  ],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              />
            </svg>
          </div>
          
          <div className="container mx-auto max-w-7xl relative z-10">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 80, rotateX: -30 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
            >
              <motion.h2 
                className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent"
                whileHover={{ 
                  scale: 1.05,
                  textShadow: "0 0 40px rgba(147, 51, 234, 0.8)"
                }}
              >
                活発なコミュニティ
              </motion.h2>
              <motion.p 
                className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
                whileHover={{ scale: 1.02 }}
              >
                同じ目標を持つ仲間と繋がり、
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold">
                  共に成長しましょう
                </span>
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  icon: <MessageSquare className="w-8 h-8 text-white" />,
                  title: "経験談シェア",
                  description: "実際の就活体験を共有",
                  content: "面接体験、内定獲得のコツ、失敗談まで。リアルな経験談が豊富に投稿されています。",
                  gradient: "from-purple-500 to-pink-500",
                  delay: 0,
                },
                {
                  icon: <TrendingUp className="w-8 h-8 text-white" />,
                  title: "スキルアップ",
                  description: "お互いの成長をサポート",
                  content: "ポートフォリオのフィードバック、ES添削、面接練習など、相互支援が活発です。",
                  gradient: "from-blue-500 to-cyan-500",
                  delay: 0.3,
                },
                {
                  icon: <Star className="w-8 h-8 text-white" />,
                  title: "業界情報",
                  description: "最新のトレンドを把握",
                  content: "各業界の最新動向、求められるスキル、企業文化など、貴重な情報が集まります。",
                  gradient: "from-green-500 to-emerald-500",
                  delay: 0.6,
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 100, rotateY: -45, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: item.delay, 
                    duration: 0.8,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    y: -20, 
                    rotateY: 15,
                    rotateX: 10,
                    scale: 1.05,
                  }}
                  className="group"
                  style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
                >
                  <Card className="border-0 shadow-2xl h-full bg-black/40 backdrop-blur-xl border border-purple-500/20 overflow-hidden relative">
                    {/* Glow Effect */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-5`}
                      whileHover={{ opacity: 0.15 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    {/* Particle System */}
                    {isClient && communityParticles.length > 0 && (
                      <div className="absolute inset-0 opacity-30">
                        {communityParticles.map((particle) => (
                          <motion.div
                            key={particle.id}
                            className="absolute w-1 h-1 bg-white rounded-full"
                            style={{
                              left: `${particle.x}%`,
                              top: `${particle.y}%`,
                            }}
                            animate={{
                              y: [0, -50, 0],
                              opacity: [0, 1, 0],
                              scale: [0, 1, 0],
                            }}
                            transition={{
                              duration: particle.duration,
                              repeat: Infinity,
                              delay: particle.delay,
                            }}
                          />
                        ))}
                      </div>
                    )}
                    
                    <CardHeader className="relative z-10">
                      <div className="flex items-start space-x-4">
                        <motion.div 
                          className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden`}
                          whileHover={{ 
                            scale: 1.2, 
                            rotateY: 180,
                            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
                          }}
                          transition={{ duration: 0.6 }}
                        >
                          {item.icon}
                          
                          {/* Icon Glow */}
                          <motion.div
                            className="absolute inset-0 bg-white/20 rounded-2xl"
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.2, 0.4, 0.2],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        </motion.div>
                        
                        <div className="flex-1">
                          <motion.div
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <CardTitle className="text-xl text-white mb-2 group-hover:text-purple-300 transition-colors">
                              {item.title}
                            </CardTitle>
                            <CardDescription className="text-gray-300 text-base">
                              {item.description}
                            </CardDescription>
                          </motion.div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="relative z-10">
                      <motion.p 
                        className="text-gray-300 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: item.delay + 0.2 }}
                        whileHover={{ color: "#ffffff" }}
                      >
                        {item.content}
                      </motion.p>
                      
                      {/* Hover Effect */}
                      <motion.div
                        className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100"
                        initial={{ scale: 0, rotate: -180 }}
                        whileHover={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <ArrowRight className="w-6 h-6 text-purple-400" />
                      </motion.div>
                    </CardContent>
                    
                    {/* Animated Border */}
                    <motion.div
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: `linear-gradient(45deg, transparent, rgba(147, 51, 234, 0.2), transparent)`,
                      }}
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-4 relative overflow-hidden">
          {/* Dynamic Background */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 20% 80%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.15) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), radial-gradient(circle at 20% 20%, rgba(147, 51, 234, 0.15) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 80%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.15) 0%, transparent 50%)",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Floating Elements */}
          {isClient && floatingElements.length > 0 && (
            <div className="absolute inset-0">
              {floatingElements.map((element) => (
                <motion.div
                  key={element.id}
                  className="absolute"
                  style={{
                    left: `${element.x}%`,
                    top: `${element.y}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    x: [0, 20, 0],
                    rotate: [0, 360],
                    opacity: [0.1, 0.3, 0.1],
                  }}
                  transition={{
                    duration: element.duration,
                    repeat: Infinity,
                    delay: element.delay,
                  }}
                >
                  <div 
                    className={`bg-cyan-400/30 rounded-full`}
                    style={{
                      width: `${element.size * 2}px`,
                      height: `${element.size * 2}px`,
                    }}
                  />
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="container mx-auto max-w-5xl text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="relative"
              style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
            >
              {/* Background Glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-3xl blur-3xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              
              <motion.h2 
                className="text-4xl md:text-7xl font-bold mb-8 relative"
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.span
                  className="block bg-gradient-to-r from-white via-cyan-400 to-purple-400 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%"],
                  }}
                  transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
                >
                  今すぐ始めて、
                </motion.span>
                <motion.span
                  className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
                >
                  理想のキャリアを実現しよう
                </motion.span>
                
                {/* Floating Icons */}
                <motion.div
                  className="absolute -top-8 -left-8"
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 8, repeat: Infinity }}
                >
                  <Rocket className="w-16 h-16 text-cyan-400 opacity-60" />
                </motion.div>
                
                <motion.div
                  className="absolute -top-4 -right-4"
                  animate={{
                    y: [0, -25, 0],
                    rotate: [360, 0],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{ duration: 6, repeat: Infinity, delay: 2 }}
                >
                  <Sparkles className="w-12 h-12 text-purple-400 opacity-60" />
                </motion.div>
              </motion.h2>
              
              <motion.p 
                className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 }}
                whileHover={{ scale: 1.02, color: "#ffffff" }}
              >
                無料登録で全機能をお試しいただけます。あなたの
                <motion.span
                  className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-semibold"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%"],
                  }}
                  transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
                >
                  就活・転職活動を次のレベルへ。
                </motion.span>
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <motion.div
                  whileHover={{ 
                    scale: 1.15, 
                    rotateY: 10,
                    boxShadow: "0 25px 50px rgba(6, 182, 212, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                  style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
                >
                  <StartFreeButton />
                  
                  {/* Button Glow */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg opacity-20 blur-lg"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                
                <motion.div
                  whileHover={{ 
                    scale: 1.15, 
                    rotateY: -10,
                    boxShadow: "0 25px 50px rgba(147, 51, 234, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-xl px-12 py-4 border-purple-400/50 text-purple-400 hover:bg-purple-400/10 hover:border-purple-400 hover:text-purple-300 transition-all duration-300 backdrop-blur-sm bg-black/20"
                  >
                    <Target className="w-6 h-6 mr-3" />
                    詳細を見る
                  </Button>
                  
                  {/* Button Glow */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg opacity-20 blur-lg"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <motion.footer 
          className="bg-black/60 backdrop-blur-xl border-t border-cyan-500/20 text-white py-16 px-4 relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          {/* Animated Background Grid */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-12 grid-rows-8 h-full">
              {[...Array(96)].map((_, i) => (
                <motion.div
                  key={i}
                  className="border border-cyan-500/10"
                  animate={{
                    opacity: [0.05, 0.15, 0.05],
                  }}
                  transition={{
                    duration: 3,
                    delay: (i % 12) * 0.05 + Math.floor(i / 12) * 0.1,
                    repeat: Infinity,
                  }}
                />
              ))}
            </div>
          </div>
          
          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="grid md:grid-cols-4 gap-12">
              <motion.div
                initial={{ opacity: 0, y: 40, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.02, rotateY: 5 }}
                style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl"
                    whileHover={{ 
                      scale: 1.2,
                      rotateY: 180,
                      boxShadow: "0 20px 40px rgba(6, 182, 212, 0.5)"
                    }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(6, 182, 212, 0.3)",
                        "0 0 40px rgba(6, 182, 212, 0.6)",
                      ],
                    }}
                  >
                    <Briefcase className="w-7 h-7 text-white" />
                  </motion.div>
                  <motion.span 
                    className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
                    whileHover={{ scale: 1.05 }}
                  >
                    CareerHub
                  </motion.span>
                </div>
                <motion.p 
                  className="text-gray-400 leading-relaxed"
                  whileHover={{ color: "#ffffff" }}
                  transition={{ duration: 0.3 }}
                >
                  就活・転職活動を成功に導く
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                    統合プラットフォーム
                  </span>
                </motion.p>
                
                {/* Social Icons */}
                <div className="flex space-x-4 mt-6">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-cyan-500/30 cursor-pointer"
                      whileHover={{
                        scale: 1.2,
                        rotateY: 15,
                        backgroundColor: "rgba(6, 182, 212, 0.2)",
                        boxShadow: "0 10px 20px rgba(6, 182, 212, 0.3)"
                      }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <div className="w-5 h-5 bg-cyan-400 rounded-sm" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              {[
                {
                  title: "機能",
                  links: ["自己分析", "ポートフォリオ", "ES管理", "コミュニティ"],
                  delay: 0.2
                },
                {
                  title: "サポート", 
                  links: ["ヘルプセンター", "お問い合わせ", "利用規約", "プライバシーポリシー"],
                  delay: 0.3
                },
                {
                  title: "会社情報",
                  links: ["会社概要", "採用情報", "ブログ", "ニュース"],
                  delay: 0.4
                }
              ].map((section, sectionIndex) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 40, rotateX: -30 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: section.delay, type: "spring", stiffness: 100 }}
                  whileHover={{ rotateX: 5 }}
                  style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
                >
                  <motion.h3 
                    className="font-bold text-xl mb-6 text-white relative"
                    whileHover={{ 
                      scale: 1.05,
                      textShadow: "0 0 20px rgba(6, 182, 212, 0.8)"
                    }}
                  >
                    {section.title}
                    <motion.div
                      className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400"
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.h3>
                  <ul className="space-y-4 text-gray-400">
                    {section.links.map((link, linkIndex) => (
                      <motion.li
                        key={link}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: section.delay + 0.1 + linkIndex * 0.05 }}
                        whileHover={{ 
                          x: 8, 
                          color: "#ffffff",
                          scale: 1.05,
                          textShadow: "0 0 10px rgba(6, 182, 212, 0.6)"
                        }}
                        className="cursor-pointer relative group"
                      >
                        <Link href="#" className="transition-all duration-300 relative">
                          {link}
                          <motion.div
                            className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"
                            whileHover={{ width: "100%" }}
                          />
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
            
            {/* Separator */}
            <motion.div 
              className="border-t border-gray-800 mt-12 pt-8 text-center relative"
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {/* Animated Line */}
              <motion.div
                className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              <motion.p 
                className="text-gray-400 text-lg"
                whileHover={{ 
                  color: "#ffffff",
                  scale: 1.02,
                  textShadow: "0 0 15px rgba(6, 182, 212, 0.6)"
                }}
                transition={{ duration: 0.3 }}
              >
                &copy; 2024 CareerHub. All rights reserved.
                <motion.span
                  className="block mt-2 text-sm bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%"],
                  }}
                  transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
                >
                  Made with ❤️ for your career success
                </motion.span>
              </motion.p>
            </motion.div>
          </div>
        </motion.footer>
      </main>
    </div>
  );
}
