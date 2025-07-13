//クライアントコンポーネントを使用。
"use client";

import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
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
  Calendar,
  BarChart3,
  Brain,
  Orbit,
  Layers,
  Grid,
  MousePointer,
  Waves
} from "lucide-react";
import { useLoginModal } from "@/hooks/useLoginModal";
import { useRegisterModal } from "@/hooks/useRegisterModal";
import { useEffect, useState, useRef } from "react";

// アニメーション用のカスタムコンポーネント
const FloatingParticle = ({ particle }: { particle: any }) => {
  return (
    <motion.div
      className="absolute w-2 h-2 bg-gray-300 rounded-full"
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
      }}
      animate={{
        y: [0, -20, 0],
        opacity: [0.3, 0.8, 0.3],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: particle.duration,
        delay: particle.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

type AnimationBackgroundProps = {
  children: React.ReactNode; //PropsのchildrenはReactのノード型
};

//スクロールに応じて背景をアニメーション
const AnimatedBackground = ({ children }: AnimationBackgroundProps) => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -400]);
  
  return (
    <div className="relative overflow-hidden">
      <motion.div 
        className="absolute inset-0 opacity-20"
        style={{ y: y1 }}
      >
        <div className="w-full h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />
      </motion.div>
      <motion.div 
        className="absolute inset-0 opacity-10"
        style={{ y: y2 }}
      >
        <div className="w-full h-full bg-gradient-to-tl from-yellow-50 via-green-50 to-cyan-50" />
      </motion.div>
      {children}
    </div>
  );
};

//
type SectionRevealProps = {
  children: React.ReactNode;
  delay?: number;
};

//コンテンツが画面内に入ったときに、フワッと表示されるアニメーション
const SectionReveal = ({ children, delay = 0 }: SectionRevealProps) => {
  const ref = useRef(null); //motion.div 要素自身を参照するための入れ物 (ref) を作成
  const isInView = useInView(ref, { once: true, margin: "-100px" }); //refが紐づけられた要素が画面内に入ったかどうかを判定

  return (
    <motion.div
      ref={ref} //DOM参照を渡す
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

//メインページコンポーネント
export default function HomePage() {
  const { onOpen: onOpenLogin } = useLoginModal(); //ログインモーダルの開閉制御
  const { onOpen: onOpenRegister } = useRegisterModal(); //登録モーダルの開閉制御
  const { scrollYProgress } = useScroll(); //スクロール進行度を0-1の値で取得（ページの一番上が0、一番下が1）。
  const [isClient, setIsClient] = useState(false); //コンポーネントがクライアント（ブラウザ）で描画されたかどうかを判定

  // アニメーション用パーティクル配列の状態管理
  const [particles, setParticles] = useState<Array<{
    id: number,
     x: number,
     y: number,
     duration: number,
     delay: number
   }>>([]);

  // 浮遊する要素の状態管理
  const [floatingElements, setFloatingElements] = useState<Array<{
    id: number,
    x: number,
    y: number,
    duration: number,
    delay: number,
    size: number
  }>>([]);

  // コミュニティセクション用のパーティクル状態管理
  const [communityParticles, setCommunityParticles] = useState<Array<{
    id: number,
    x: number,
    y: number,
    duration: number,
    delay: number
  }>>([]);

  const [careerParticles, setCareerParticles] = useState<Array<{
    id: number,
    x: number,
    y: number,
    duration: number,
    delay: number
  }>>([]);

  const yTransform = useTransform(scrollYProgress, [0, 1], [0, -100]); //スクロールで要素を上に移動（パララックス効果）
  const scaleTransform = useTransform(scrollYProgress, [0, 1], [1, 0.8]); //スクロールで要素を縮小

  // パーティクルの型定義
  type Particle = {
    id: number;
    x: number;
    y: number;
    duration: number;
    delay: number;
  };
  
  //初回マウント時にデータを生成
  useEffect(() => {
    setIsClient(true); // クライアントサイドでのみ実行
    const particleData: Particle[] = Array.from({ length: 20 }, (_, i) => ({ // 20個のパーティクルを生成
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 10 + 5,
      delay: Math.random() * 5,
    }));
    setParticles(particleData); //生成したパーティクルのデータを particles 状態にセット

    type FloatingElement = {
      id: number;
      x: number;
      y: number;
      duration: number;
      delay: number;
      size: number;
    };

    // 浮遊要素データを生成
    const floatingData: FloatingElement[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 4 + Math.random() * 4,
      delay: Math.random() * 2,
      size: 3 + Math.random() * 2,
    }));
    setFloatingElements(floatingData);

    // コミュニティセクション用パーティクル
    const communityData: Particle[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
    setCommunityParticles(communityData);

    // キャリアセクション用パーティクル
    const careerData: Particle[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
    setCareerParticles(careerData);
  }, []);

  const backgroundVariants = {
    animate: {
      background: [
        "linear-gradient(135deg, #000000 0%, #1a1a1a 25%, #000000 50%, #2a2a2a 75%, #000000 100%)",
        "linear-gradient(135deg, #1a1a1a 0%, #000000 25%, #2a2a2a 50%, #000000 75%, #1a1a1a 100%)",
        "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 25%, #000000 50%, #1a1a1a 75%, #2a2a2a 100%)",
      ],
      transition: {
        duration: 12,
        repeat: Infinity,
        ease: "easeInOut" as const // TypeScriptでの型アサーションによる定数型指定
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-white">
      <main>
        {/* Header */}
        <motion.header 
          className="border-b border-gray-100 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <motion.div 
                className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-900 rounded-lg flex items-center justify-center"
                whileHover={{ 
                  scale: 1.05,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </motion.div>
              <motion.span 
                className="text-xl sm:text-2xl font-bold text-gray-900"
                whileHover={{ scale: 1.02 }}
              >
                AnalyzMe
              </motion.span>
            </motion.div>
            
            <nav className="hidden md:flex items-center space-x-8">
              {['ES', '自己分析', '就活スケジュール管理', 'ポートフォリオ作成'].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, type: "spring", stiffness: 300 }}
                  whileHover={{ 
                    y: -2, 
                  }}
                  className="relative group"
                >
                  <Link 
                    href={`#${item.toLowerCase()}`} 
                    className="text-gray-700 hover:text-gray-900 transition-colors duration-300 text-sm lg:text-base font-medium"
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
            </nav>
            
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2"
              >
                <Button 
                  className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg text-sm font-medium"
                  onClick={onOpenRegister}
                >
                  無料で始める
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  variant="outline" 
                  className="text-sm px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 rounded-lg"
                  onClick={onOpenLogin}
                >
                  ログイン
                </Button>
                
              </motion.div>
              
              {/* Mobile menu button */}
              <motion.button
                className="md:hidden p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                
              </motion.button>
            </motion.div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <AnimatedBackground>
          <section className="py-24 sm:py-32 md:py-40 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0">
              {/* Gradient Orbs */}
              <motion.div
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-pink-200/30 to-yellow-200/30 rounded-full blur-3xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* Floating Particles */}
              {isClient && particles.map((particle) => (
                <FloatingParticle key={particle.id} particle={particle} />
              ))}
              
              {/* Grid Pattern */}
              <div className="absolute inset-0 opacity-[0.02]">
                <div className="h-full w-full" style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0,0,0) 1px, transparent 0)`,
                  backgroundSize: '40px 40px'
                }} />
              </div>
            </div>
            
            <div className="container mx-auto text-center max-w-6xl relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="mb-16"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2, delay: 0.4 }}
                  className="mb-8"
                >
                  <motion.h1 
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight tracking-tight"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.6 }}
                  >
                    <motion.span 
                      className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent"
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{
                        backgroundSize: "200% 200%",
                      }}
                    >
                      あなたのキャリアを
                    </motion.span>
                    <br />
                    <motion.span 
                      className="text-gray-600 relative"
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 1, delay: 0.8 }}
                    >
                      科学する
                      <motion.div
                        className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 1.2 }}
                      />
                    </motion.span>
                  </motion.h1>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
              >
                <motion.p 
                  className="text-xl sm:text-2xl md:text-3xl text-gray-600 mb-8 leading-relaxed font-light"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1.6 }}
                >
                  AI分析と科学的アプローチで、
                  <br />
                  あなたの「最適なキャリア」を発見しよう。
                </motion.p>
                
                {/* 機能ハイライト */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
                  {[
                    { icon: User, title: "自己分析", subtitle: "深層心理分析", delay: 1.8 },
                    { icon: FileText, title: "ES管理", subtitle: "成功率最適化", delay: 1.9 },
                    { icon: BarChart3, title: "AI分析", subtitle: "行動パターン解析", delay: 2.0 },
                    { icon: Target, title: "目標設定", subtitle: "スマート追跡", delay: 2.1 }
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      className="group flex flex-col items-center p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 hover:shadow-xl hover:scale-105"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: item.delay, duration: 0.6 }}
                      whileHover={{ 
                        y: -8,
                        transition: { duration: 0.3 }
                      }}
                    >
                      <motion.div
                        className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-3 group-hover:from-blue-100 group-hover:to-purple-100"
                        whileHover={{ rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <item.icon className="w-6 h-6 text-gray-700 group-hover:text-blue-600" />
                      </motion.div>
                      <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </span>
                      <span className="text-xs text-gray-500">
                        {item.subtitle}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2.2 }}
              >
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="group"
                >
                  <Button 
                    size="lg" 
                    className="text-lg px-12 py-4 bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white rounded-lg font-medium shadow-lg transition-all duration-300 relative overflow-hidden"
                    asChild
                  >
                    <Link href="/dashboard" className="flex items-center">
                      <motion.span
                        initial={{ x: 0 }}
                        whileHover={{ x: -5 }}
                        transition={{ duration: 0.3 }}
                      >
                        無料で始める
                      </motion.span>
                      <motion.div
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </motion.div>
                    </Link>
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-lg px-12 py-4 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm"
                    asChild
                  >
                    <Link href="/demo">
                      デモを見る
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>

              {/* 統計表示 */}
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2.4 }}
              >
                {[
                  { value: "95%", label: "ユーザー満足度", delay: 2.5 },
                  { value: "2.5x", label: "内定獲得率向上", delay: 2.6 },
                  { value: "10k+", label: "分析データポイント", delay: 2.7 },
                  { value: "30日", label: "平均目標達成期間", delay: 2.8 }
                ].map((stat, index) => (
                  <motion.div 
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: stat.delay, duration: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div 
                      className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"
                      whileInView={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.5 }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        </AnimatedBackground>

        {/* Core Features Section */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-50/50 to-transparent"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-purple-50/50 to-transparent"
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.3 }}
            />
          </div>
          
          <div className="container mx-auto max-w-7xl relative z-10">
            <SectionReveal>
              <div className="text-center mb-20">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-xl font-bold text-gray-500 mb-4">Core Features</h2>
                  <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-8">
                    <motion.span
                      className="inline-block"
                      whileInView={{ 
                        backgroundImage: [
                          "linear-gradient(90deg, #1f2937 0%, #1f2937 100%)",
                          "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #1f2937 100%)",
                          "linear-gradient(90deg, #1f2937 0%, #1f2937 100%)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        color: "transparent"
                      }}
                    >
                      科学的アプローチで、
                    </motion.span>
                    <br />
                    キャリアを最適化する
                  </h3>
                  <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
                    ResearchHubは、あなたのキャリアデータを科学的に分析し、
                    最適な成長戦略を提案する次世代キャリアプラットフォームです。
                  </p>
                </motion.div>
              </div>
            </SectionReveal>

            {/* Feature Cards with Enhanced Animations */}
            <div className="space-y-32">
              {/* Feature 1 */}
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <SectionReveal delay={0.2}>
                  <motion.div
                    whileInView={{ x: 0, opacity: 1 }}
                    initial={{ x: -50, opacity: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="mb-8">
                      <motion.div 
                        className="flex items-center gap-3 mb-4"
                        whileHover={{ x: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div 
                          className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center"
                          whileHover={{ 
                            scale: 1.1,
                            rotate: 5,
                            background: "linear-gradient(45deg, #dbeafe, #e9d5ff)"
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <User className="w-6 h-6 text-blue-600" />
                        </motion.div>
                        <h4 className="text-2xl font-bold text-gray-900">深層自己分析</h4>
                      </motion.div>
                      <p className="text-lg text-gray-600 leading-relaxed mb-6">
                        AIが行動パターンと心理的特性を分析し、あなたの本当の強みと価値観を発見。
                        データに基づいた客観的な自己理解で、キャリアの方向性を明確にします。
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <motion.div 
                          className="p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border border-gray-200"
                          whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="text-2xl font-bold text-gray-900">85%</div>
                          <div className="text-sm text-gray-600">精度向上</div>
                        </motion.div>
                        <motion.div 
                          className="p-4 bg-gradient-to-br from-gray-50 to-purple-50 rounded-lg border border-gray-200"
                          whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="text-2xl font-bold text-gray-900">12+</div>
                          <div className="text-sm text-gray-600">分析指標</div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </SectionReveal>
                
                <SectionReveal delay={0.4}>
                  <motion.div
                    whileInView={{ x: 0, opacity: 1 }}
                    initial={{ x: 50, opacity: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative group"
                  >
                    <motion.div 
                      className="w-full h-96 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl flex items-center justify-center relative overflow-hidden border border-gray-200"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Floating UI Elements */}
                      <motion.div 
                        className="absolute top-4 left-4 bg-white rounded-lg p-3 border border-gray-200 shadow-lg"
                        animate={{
                          y: [0, -5, 0],
                          rotate: [0, 1, 0]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <div className="text-sm font-medium text-gray-600">自己分析スコア</div>
                        <div className="text-2xl font-bold text-blue-600">87/100</div>
                      </motion.div>
                      <motion.div 
                        className="absolute bottom-4 right-4 bg-white rounded-lg p-3 border border-gray-200 shadow-lg"
                        animate={{
                          y: [0, 5, 0],
                          rotate: [0, -1, 0]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.5
                        }}
                      >
                        <div className="text-sm font-medium text-gray-600">発見された強み</div>
                        <div className="text-lg font-bold text-purple-600">分析思考力</div>
                      </motion.div>
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 180, 360]
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <User className="w-24 h-24 text-gray-300" />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </SectionReveal>
              </div>

              
              {/* Feature 2 */}
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <SectionReveal delay={0.2}>
                  <motion.div
                    whileInView={{ x: 0, opacity: 1 }}
                    initial={{ x: -50, opacity: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="order-2 lg:order-1"
                  >
                    <motion.div 
                      className="w-full h-96 bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl flex items-center justify-center relative overflow-hidden border border-gray-200"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div 
                        className="absolute top-4 left-4 bg-white rounded-lg p-3 border border-gray-200 shadow-lg"
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <div className="text-sm font-medium text-gray-600">ES成功率</div>
                        <div className="text-2xl font-bold text-green-600">73%</div>
                      </motion.div>
                      <motion.div 
                        className="absolute bottom-4 right-4 bg-white rounded-lg p-3 border border-gray-200 shadow-lg"
                        animate={{ y: [0, 3, 0] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                      >
                        <div className="text-sm font-medium text-gray-600">提出済み</div>
                        <div className="text-lg font-bold text-gray-900">15件</div>
                      </motion.div>
                      <motion.div
                        animate={{ scale: [1, 1.05, 1], rotate: [0, 2, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <FileText className="w-24 h-24 text-gray-300" />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </SectionReveal>

                <SectionReveal delay={0.4}>
                  <motion.div
                    whileInView={{ x: 0, opacity: 1 }}
                    initial={{ x: 50, opacity: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="order-1 lg:order-2"
                  >
                    <div className="mb-8">
                      <motion.div 
                        className="flex items-center gap-3 mb-4"
                        whileHover={{ x: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div 
                          className="w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center"
                          whileHover={{ scale: 1.1, rotate: -5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <FileText className="w-6 h-6 text-green-600" />
                        </motion.div>
                        <h4 className="text-2xl font-bold text-gray-900">ES成功率最適化</h4>
                      </motion.div>
                      <p className="text-lg text-gray-600 leading-relaxed mb-6">
                        企業分析と成功パターンから、あなたに最適なES戦略を提案。
                        リアルタイムでフィードバックを提供し、内定獲得率を最大化します。
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <motion.div 
                          className="p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-gray-200"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="text-2xl font-bold text-gray-900">2.5x</div>
                          <div className="text-sm text-gray-600">成功率向上</div>
                        </motion.div>
                        <motion.div 
                          className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-gray-200"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="text-2xl font-bold text-gray-900">24h</div>
                          <div className="text-sm text-gray-600">フィードバック</div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </SectionReveal>
              </div>

              {/* Feature 3 */}
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <SectionReveal delay={0.2}>
                  <motion.div
                    whileInView={{ x: 0, opacity: 1 }}
                    initial={{ x: -50, opacity: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="mb-8">
                      <motion.div 
                        className="flex items-center gap-3 mb-4"
                        whileHover={{ x: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div 
                          className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center"
                          whileHover={{ 
                            scale: 1.1, 
                            rotate: 10,
                            background: "linear-gradient(45deg, #f3e8ff, #fce7f3)"
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <BarChart3 className="w-6 h-6 text-purple-600" />
                        </motion.div>
                        <h4 className="text-2xl font-bold text-gray-900">AI行動分析</h4>
                      </motion.div>
                      <p className="text-lg text-gray-600 leading-relaxed mb-6">
                        あなたの活動パターンを分析し、最適な成長戦略を提案。
                        個性と行動特性から、あなただけのキャリアロードマップを作成します。
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <motion.div 
                          className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-gray-200"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="text-2xl font-bold text-gray-900">97%</div>
                          <div className="text-sm text-gray-600">予測精度</div>
                        </motion.div>
                        <motion.div 
                          className="p-4 bg-gradient-to-br from-pink-50 to-yellow-50 rounded-lg border border-gray-200"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="text-2xl font-bold text-gray-900">5種</div>
                          <div className="text-sm text-gray-600">性格特性分析</div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </SectionReveal>
                
                <SectionReveal delay={0.4}>
                  <motion.div
                    whileInView={{ x: 0, opacity: 1 }}
                    initial={{ x: 50, opacity: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative group"
                  >
                    <motion.div 
                      className="w-full h-96 bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl flex items-center justify-center relative overflow-hidden border border-gray-200"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div 
                        className="absolute top-4 left-4 bg-white rounded-lg p-3 border border-gray-200 shadow-lg"
                        animate={{ 
                          y: [0, -4, 0],
                          rotate: [0, 0.5, 0]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <div className="text-sm font-medium text-gray-600">キャリア健康度</div>
                        <div className="text-2xl font-bold text-purple-600">92/100</div>
                      </motion.div>
                      <motion.div 
                        className="absolute bottom-4 right-4 bg-white rounded-lg p-3 border border-gray-200 shadow-lg"
                        animate={{ 
                          y: [0, 4, 0],
                          rotate: [0, -0.5, 0]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      >
                        <div className="text-sm font-medium text-gray-600">今月の活動</div>
                        <div className="text-lg font-bold text-gray-900">18件</div>
                      </motion.div>
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 360]
                        }}
                        transition={{
                          scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                          rotate: { duration: 20, repeat: Infinity, ease: "linear" }
                        }}
                      >
                        <BarChart3 className="w-24 h-24 text-gray-300" />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </SectionReveal>
              </div>
            </div>
          </div>
        </section>

        {/* Who we are Section */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-xl font-bold text-gray-500 mb-4">About ResearchHub</h2>
              <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-8">
                科学的根拠に基づく
                <br />
                キャリア成長プラットフォーム
              </h3>
              <div className="max-w-4xl mx-auto">
                <p className="text-xl text-gray-600 leading-relaxed">
                  ResearchHubは、データサイエンスと心理学の知見を活用し、
                  あなたのキャリア成長を科学的にサポートするプラットフォームです。
                  自己分析から目標設定、進捗管理まで、すべてを統合した環境で
                  「最適なキャリア」の実現を支援します。
                </p>
                <motion.div className="mt-8">
                  <Button 
                    variant="outline" 
                    className="text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 px-8 py-3 rounded-lg transition-all duration-300"
                    asChild
                  >
                    <Link href="/about">詳しく知る</Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Analytics & Insights Section */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="container mx-auto max-w-7xl">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-xl font-bold text-gray-500 mb-4">Analytics & Insights</h2>
              <h3 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">
                データが教える、
                <br />
                あなたの成長ストーリー
              </h3>
              <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
                AIが分析するあなたの活動データから、客観的な成長指標と
                個別最適化された改善提案を提供します。
              </p>
            </motion.div>

            {/* Key Analytics Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0 }}
                whileHover={{ y: -5 }}
              >
                <Card className="shadow-lg h-full bg-white border border-gray-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-gray-700" />
                      </div>
                      <Badge className="bg-green-100 text-green-700 border border-green-200">+15%</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900 mb-2">87/100</div>
                    <div className="text-sm text-gray-700 font-medium">キャリア健康度スコア</div>
                    <div className="text-xs text-gray-500 mt-1">業界平均65点を上回る</div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                whileHover={{ y: -5 }}
              >
                <Card className="shadow-lg h-full bg-white border border-gray-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Target className="w-6 h-6 text-gray-700" />
                      </div>
                      <Badge className="bg-blue-100 text-blue-700 border border-blue-200">優秀</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900 mb-2">73%</div>
                    <div className="text-sm text-gray-700 font-medium">ES成功率</div>
                    <div className="text-xs text-gray-500 mt-1">業界平均25%の2.9倍</div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                whileHover={{ y: -5 }}
              >
                <Card className="shadow-lg h-full bg-white border border-gray-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Brain className="w-6 h-6 text-gray-700" />
                      </div>
                      <Badge className="bg-purple-100 text-purple-700 border border-purple-200">AI分析</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900 mb-2">97%</div>
                    <div className="text-sm text-gray-700 font-medium">予測精度</div>
                    <div className="text-xs text-gray-500 mt-1">行動パターン分析による</div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <Card className="shadow-lg h-full bg-white border border-gray-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Zap className="w-6 h-6 text-gray-700" />
                      </div>
                      <Badge className="bg-orange-100 text-orange-700 border border-orange-200">高速</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900 mb-2">30日</div>
                    <div className="text-sm text-gray-700 font-medium">平均目標達成期間</div>
                    <div className="text-xs text-gray-500 mt-1">従来の半分の期間</div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Detailed Analytics */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h4 className="text-2xl font-bold text-gray-900 mb-6">
                  リアルタイム分析ダッシュボード
                </h4>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  あなたの活動データを24時間365日分析し、成長パターンと改善点を可視化。
                  週次・月次のトレンド分析から、個人最適化された目標設定まで、
                  すべてをデータドリブンで管理できます。
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-700" />
                      <span className="font-medium text-gray-900">自己分析の深度</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div className="w-20 h-2 bg-gray-900 rounded-full"></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">85%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-700" />
                      <span className="font-medium text-gray-900">ES活動量</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div className="w-18 h-2 bg-gray-900 rounded-full"></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">73%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-gray-700" />
                      <span className="font-medium text-gray-900">目標達成率</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div className="w-22 h-2 bg-gray-900 rounded-full"></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">92%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="w-full h-96 bg-gray-50 rounded-2xl p-6 flex flex-col border border-gray-200">
                  <div className="flex justify-between items-center mb-6">
                    <h5 className="font-bold text-gray-900">今月の活動推移</h5>
                    <Badge variant="outline" className="border-gray-300 text-gray-700 bg-white">リアルタイム</Badge>
                  </div>
                  
                  <div className="flex-1 flex items-end gap-2">
                    {[65, 45, 80, 72, 90, 68, 95].map((height, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-gray-900 rounded-t shadow-lg"
                          style={{ height: `${height}%` }}
                        ></div>
                        <div className="text-xs text-gray-600 mt-2">
                          {["月", "火", "水", "木", "金", "土", "日"][index]}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-gray-900">18</div>
                        <div className="text-xs text-gray-600">自己分析</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">12</div>
                        <div className="text-xs text-gray-600">ES活動</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">7</div>
                        <div className="text-xs text-gray-600">研究</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Strategy Section */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-xl font-bold text-gray-500 mb-4">Our Method</h2>
                <h3 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">
                  科学的メソッドで、
                  <br />
                  キャリア成功を再現可能に
                </h3>
                <p className="text-xl text-gray-600 leading-relaxed mb-8">
                  ResearchHubは、心理学・行動科学・データサイエンスの知見を統合し、
                  再現可能なキャリア成功メソッドを提供。
                  あなたの個性と目標に最適化されたロードマップで、着実な成長を実現します。
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="text-2xl font-bold text-gray-900">500+</div>
                    <div className="text-sm text-gray-600">成功パターン分析</div>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="text-2xl font-bold text-gray-900">15種</div>
                    <div className="text-sm text-gray-600">分析指標</div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 px-8 py-3 rounded-lg transition-all duration-300"
                  asChild
                >
                  <Link href="/method">メソッドを詳しく</Link>
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="w-full h-96 bg-white rounded-2xl flex items-center justify-center relative overflow-hidden border border-gray-200 shadow-lg">
                  <div className="absolute top-4 left-4 bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-sm font-medium text-gray-600">成功予測</div>
                    <div className="text-2xl font-bold text-gray-900">高</div>
                  </div>
                  <div className="absolute top-4 right-4 bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-sm font-medium text-gray-600">適性スコア</div>
                    <div className="text-lg font-bold text-gray-900">89%</div>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-sm font-medium text-gray-600">推奨アクション</div>
                    <div className="text-lg font-bold text-gray-900">3件</div>
                  </div>
                  <BarChart3 className="w-24 h-24 text-gray-400" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Success Stories Section */}
        <section id="success-stories" className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-0 left-0 w-full h-full opacity-[0.03]"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, #000 0px, #000 1px, transparent 1px, transparent 30px)`,
              }}
            />
          </div>
          
          <div className="container mx-auto max-w-7xl relative z-10">
            <SectionReveal>
              <div className="text-center mb-20">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-xl font-bold text-gray-600 mb-4">Success Stories</h2>
                  <p className="text-2xl text-gray-900 max-w-4xl mx-auto leading-relaxed">
                    <motion.span
                      className="inline-block"
                      whileInView={{ 
                        color: ["#1f2937", "#3b82f6", "#8b5cf6", "#1f2937"]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      ResearchHubを活用して理想のキャリアを実現した、
                    </motion.span>
                    <br />
                    ユーザーの成功ストーリーをご紹介します。
                  </p>
                </motion.div>
              </div>
            </SectionReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {[
                {
                  title: "3ヶ月で内定獲得率80%を達成",
                  subtitle: "データ分析による戦略的ES作成で、第一志望企業に内定",
                  category: "ES最適化",
                  metrics: "内定率: 80% (従来の3.2倍)",
                  user: "Aさん（工学部4年）",
                  period: "3ヶ月",
                  delay: 0,
                  gradient: "from-blue-400 to-purple-400",
                  bgGradient: "from-blue-50 to-purple-50"
                },
                {
                  title: "自己分析スコア95点で、理想のキャリアパスを発見",
                  subtitle: "AIによる深層分析で、隠れた強みと適性を発見し、新分野への転身を成功",
                  category: "自己分析",
                  metrics: "キャリア満足度: 95%向上",
                  user: "Bさん（既卒2年目）",
                  period: "2ヶ月",
                  delay: 0.2,
                  gradient: "from-green-400 to-blue-400",
                  bgGradient: "from-green-50 to-blue-50"
                },
                {
                  title: "研究成果を活かした戦略的キャリア設計",
                  subtitle: "研究ノート機能で専門性を体系化し、学術界から産業界への転身に成功",
                  category: "研究活用",
                  metrics: "年収: 150万円アップ",
                  user: "Cさん（修士課程）",
                  period: "4ヶ月",
                  delay: 0.4,
                  gradient: "from-purple-400 to-pink-400",
                  bgGradient: "from-purple-50 to-pink-50"
                },
                {
                  title: "継続率100%で習慣化に成功",
                  subtitle: "AI予測とリマインダーで、6ヶ月間毎日キャリア活動を継続",
                  category: "習慣化",
                  metrics: "活動継続率: 100%",
                  user: "Dさん（学部3年）",
                  period: "6ヶ月",
                  delay: 0.6,
                  gradient: "from-yellow-400 to-orange-400",
                  bgGradient: "from-yellow-50 to-orange-50"
                },
                {
                  title: "個性分析で最適な職場環境を発見",
                  subtitle: "行動パターン分析により、自分に最適な企業文化と働き方を特定",
                  category: "適性診断",
                  metrics: "職場満足度: 92%",
                  user: "Eさん（博士課程）",
                  period: "5ヶ月",
                  delay: 0.8,
                  gradient: "from-cyan-400 to-blue-400",
                  bgGradient: "from-cyan-50 to-blue-50"
                },
                {
                  title: "ベンチマーク分析で業界トップクラスのパフォーマンス",
                  subtitle: "同世代比較で上位5%の成果を達成し、希望業界でのポジションを確保",
                  category: "競合分析",
                  metrics: "業界順位: 上位5%",
                  user: "Fさん（院卒1年目）",
                  period: "7ヶ月",
                  delay: 1.0,
                  gradient: "from-indigo-400 to-purple-400",
                  bgGradient: "from-indigo-50 to-purple-50"
                }
              ].map((story, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.8, 
                    delay: story.delay,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    y: -10,
                    scale: 1.03,
                    transition: { duration: 0.3 }
                  }}
                  className="group cursor-pointer"
                >
                  <Card className={`border-0 shadow-lg h-full bg-gradient-to-br ${story.bgGradient} hover:shadow-2xl transition-all duration-500 border border-gray-200 relative overflow-hidden`}>
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${story.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                    
                    <CardHeader className="relative z-10">
                      <div className="flex flex-wrap gap-2 mb-4">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Badge 
                            variant="secondary" 
                            className={`text-xs bg-gradient-to-r ${story.gradient} text-white border-0`}
                          >
                            {story.category}
                          </Badge>
                        </motion.div>
                        <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                          期間: {story.period}
                        </Badge>
                      </div>
                      
                      <motion.div
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardTitle className="text-lg font-bold text-gray-900 leading-tight mb-3 group-hover:text-gray-700 transition-colors">
                          {story.title}
                        </CardTitle>
                      </motion.div>
                      
                      <CardDescription className="text-gray-600 text-sm leading-relaxed mb-4">
                        {story.subtitle}
                      </CardDescription>
                      
                      {/* Metrics */}
                      <motion.div 
                        className="p-3 bg-white/80 backdrop-blur-sm rounded-lg mb-3 border border-gray-200 group-hover:bg-white/90 transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="text-sm font-semibold text-gray-700">{story.metrics}</div>
                      </motion.div>
                      
                      {/* User Info */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{story.user}</span>
                        <motion.div 
                          className="flex items-center gap-1"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>検証済み</span>
                        </motion.div>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* CTA Section */}
            <SectionReveal delay={0.4}>
              <motion.div 
                className="text-center p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <motion.div
                    className="w-full h-full"
                    animate={{
                      backgroundPosition: ["0% 0%", "100% 100%"],
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      backgroundImage: `conic-gradient(from 0deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6)`,
                      backgroundSize: "400% 400%",
                    }}
                  />
                </div>
                
                <div className="relative z-10">
                  <motion.h3 
                    className="text-2xl font-bold text-gray-900 mb-4"
                    whileInView={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    あなたも成功ストーリーの主人公になりませんか？
                  </motion.h3>
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    科学的アプローチとAI分析で、あなたの理想のキャリアを実現しましょう。
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        className="bg-gradient-to-r from-gray-900 to-gray-700 text-white hover:from-gray-800 hover:to-gray-600 px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                        asChild
                      >
                        <Link href="/dashboard">今すぐ無料で始める</Link>
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-8 py-3 rounded-lg font-medium transition-all duration-300"
                        asChild
                      >
                        <Link href="/success-stories">全ての事例を見る</Link>
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </SectionReveal>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-xl font-bold text-gray-600 mb-4">Pricing</h2>
              <h3 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">
                あなたに最適なプランを選択
              </h3>
              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                無料プランから始めて、必要に応じてアップグレード。
                すべてのプランで科学的キャリア分析をご利用いただけます。
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Free Plan */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0 }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-2 border-gray-200 shadow-lg h-full bg-white hover:shadow-xl transition-all duration-300">
                  <CardHeader className="text-center pb-8">
                    <Badge variant="outline" className="mb-4 w-fit mx-auto">スタータープラン</Badge>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-4">
                      無料
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      基本的なキャリア分析機能
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">基本自己分析（月3件）</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">ES管理（月5件）</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">基本統計ダッシュボード</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">コミュニティアクセス</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-6 bg-gray-100 text-gray-800 hover:bg-gray-200"
                      asChild
                    >
                      <Link href="/dashboard">無料で始める</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Pro Plan */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-2 border-blue-500 shadow-xl h-full bg-white hover:shadow-2xl transition-all duration-300 relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">人気プラン</Badge>
                  </div>
                  <CardHeader className="text-center pb-8">
                    <Badge variant="secondary" className="mb-4 w-fit mx-auto bg-blue-100 text-blue-800">プロプラン</Badge>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-4">
                      ¥2,980
                      <span className="text-lg font-normal text-gray-600">/月</span>
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      AI分析とプレミアム機能
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">無制限自己分析</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">無制限ES管理・最適化</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">AI行動パターン分析</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">個性診断レポート</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">業界ベンチマーク分析</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">優先サポート</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-6 bg-blue-500 text-white hover:bg-blue-600"
                      asChild
                    >
                      <Link href="/pricing">プロプランを始める</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Enterprise Plan */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-2 border-purple-200 shadow-lg h-full bg-white hover:shadow-xl transition-all duration-300">
                  <CardHeader className="text-center pb-8">
                    <Badge variant="outline" className="mb-4 w-fit mx-auto border-purple-500 text-purple-700">エンタープライズ</Badge>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-4">
                      お問い合わせ
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      大学・企業向けカスタムソリューション
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">全機能アクセス</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">カスタム分析レポート</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">専用サポート担当</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">API アクセス</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">オンサイトトレーニング</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">SLA保証</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline"
                      className="w-full mt-6 border-purple-500 text-purple-700 hover:bg-purple-50"
                      asChild
                    >
                      <Link href="/contact">お問い合わせ</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Career Section */}
        <section id="career" className="py-32 px-4 sm:px-6 lg:px-8 bg-gray-900 relative overflow-hidden">
          {/* Advanced Animated Background */}
          <div className="absolute inset-0">
            {/* Gradient Orbs */}
            <motion.div
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
              style={{
                background: "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
                x: [0, 50, 0],
                y: [0, -30, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl"
              style={{
                background: "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)",
              }}
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.5, 0.2],
                x: [0, -40, 0],
                y: [0, 20, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            {/* Moving Text Background */}
            <div className="absolute top-0 left-0 w-full h-full flex items-center">
              <motion.div
                className="text-6xl md:text-8xl lg:text-9xl font-black text-white/5 whitespace-nowrap"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                JOIN OUR TEAM! CREATE THE FUTURE! INNOVATE! BUILD! GROW! 
              </motion.div>
            </div>
            
            {/* Floating Particles */}
            <div className="absolute inset-0">
              {isClient && careerParticles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: particle.duration,
                    delay: particle.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </div>
          
          <div className="container mx-auto max-w-4xl text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <motion.h2 
                className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.2 }}
              >
                <motion.span
                  className="inline-block"
                  animate={{
                    background: [
                      "linear-gradient(45deg, #fff, #fff)",
                      "linear-gradient(45deg, #3b82f6, #8b5cf6)",
                      "linear-gradient(45deg, #06b6d4, #3b82f6)",
                      "linear-gradient(45deg, #fff, #fff)",
                    ],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  一緒に未来の
                </motion.span>
                <br />
                <motion.span
                  className="inline-block text-blue-400"
                  whileInView={{ 
                    rotate: [0, 2, -2, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  キャリアを
                </motion.span>
                <br />
                <motion.span
                  className="inline-block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                  whileInView={{ scale: [1, 1.1, 1] }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                >
                  創りませんか？
                </motion.span>
              </motion.h2>
              
              <motion.p 
                className="text-2xl md:text-3xl text-gray-300 mb-12 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                <motion.span
                  whileInView={{ 
                    color: ["#d1d5db", "#60a5fa", "#d1d5db"]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  ResearchHubで、科学的アプローチによる
                </motion.span>
                <br />
                キャリア支援の新しいスタンダードを築きましょう。
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 px-12 py-4 text-xl font-bold rounded-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 relative overflow-hidden group"
                  asChild
                >
                  <Link href="/careers" className="relative z-10">
                    <motion.span
                      whileHover={{ x: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      キャリアを始める
                    </motion.span>
                    <motion.div
                      className="ml-2"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ArrowRight className="w-6 h-6 inline-block" />
                    </motion.div>
                    {/* Animated Background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </Button>
              </motion.div>

              {/* Floating Action Icons */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                {[Rocket, Star, Sparkles, Zap].map((Icon, index) => (
                  <motion.div
                    key={index}
                    className="absolute text-white/20"
                    style={{
                      left: `${Math.cos((index * Math.PI) / 2) * 200}px`,
                      top: `${Math.sin((index * Math.PI) / 2) * 200}px`,
                    }}
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                      duration: 5 + index,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.5,
                    }}
                  >
                    <Icon className="w-8 h-8" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-xl font-bold text-gray-600 mb-4">Pricing</h2>
              <h3 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">
                あなたに最適なプランを選択
              </h3>
              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                無料プランから始めて、必要に応じてアップグレード。
                すべてのプランで科学的キャリア分析をご利用いただけます。
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Free Plan */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0 }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-2 border-gray-200 shadow-lg h-full bg-white hover:shadow-xl transition-all duration-300">
                  <CardHeader className="text-center pb-8">
                    <Badge variant="outline" className="mb-4 w-fit mx-auto">スタータープラン</Badge>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-4">
                      無料
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      基本的なキャリア分析機能
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">基本自己分析（月3件）</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">ES管理（月5件）</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">基本統計ダッシュボード</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">コミュニティアクセス</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-6 bg-gray-100 text-gray-800 hover:bg-gray-200"
                      asChild
                    >
                      <Link href="/dashboard">無料で始める</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Pro Plan */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-2 border-blue-500 shadow-xl h-full bg-white hover:shadow-2xl transition-all duration-300 relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">人気プラン</Badge>
                  </div>
                  <CardHeader className="text-center pb-8">
                    <Badge variant="secondary" className="mb-4 w-fit mx-auto bg-blue-100 text-blue-800">プロプラン</Badge>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-4">
                      ¥2,980
                      <span className="text-lg font-normal text-gray-600">/月</span>
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      AI分析とプレミアム機能
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">無制限自己分析</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">無制限ES管理</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">AI分析レポート</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">優先サポート</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-6 bg-blue-500 text-white hover:bg-blue-600"
                      asChild
                    >
                      <Link href="/pricing">プロプランを始める</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Enterprise Plan */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-2 border-purple-200 shadow-lg h-full bg-white hover:shadow-xl transition-all duration-300">
                  <CardHeader className="text-center pb-8">
                    <Badge variant="outline" className="mb-4 w-fit mx-auto border-purple-500 text-purple-700">エンタープライズ</Badge>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-4">
                      お問い合わせ
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      大学・企業向けカスタムソリューション
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">カスタム機能開発</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">専用サポートチーム</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">データ統合</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">セキュリティ強化</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-6 bg-purple-500 text-white hover:bg-purple-600"
                      asChild
                    >
                      <Link href="/contact">お問い合わせ</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-32 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-xl font-bold text-gray-600 mb-4">Contact Us</h2>
              <p className="text-2xl text-gray-900 max-w-3xl mx-auto leading-relaxed">
                ResearchHubについてのご質問や、
                導入のご相談はお気軽にお問い合わせください。
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0 }}
                whileHover={{ y: -5 }}
                className="text-center"
              >
                <Card className="border-0 shadow-lg h-full bg-white hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <MessageSquare className="w-8 h-8 text-gray-600" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 mb-4">
                      一般のお問い合わせ
                    </CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      サービスに関するご質問や、
                      使い方のサポートはこちら
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                      asChild
                    >
                      <Link href="/contact">お問い合わせ</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                whileHover={{ y: -5 }}
                className="text-center"
              >
                <Card className="border-0 shadow-lg h-full bg-white hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Users className="w-8 h-8 text-gray-600" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 mb-4">
                      企業・大学向け導入
                    </CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      組織でのご利用や、
                      カスタマイズのご相談はこちら
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                      asChild
                    >
                      <Link href="/enterprise">企業向け相談</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                whileHover={{ y: -5 }}
                className="text-center"
              >
                <Card className="border-0 shadow-lg h-full bg-white hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Rocket className="w-8 h-8 text-gray-600" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 mb-4">
                      パートナーシップ
                    </CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      事業提携や技術連携など、
                      パートナーシップのご提案
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                      asChild
                    >
                      <Link href="/partnership">提携のご相談</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* FAQ Section */}
            <motion.div 
              className="mt-20 pt-16 border-t border-gray-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">よくある質問</h3>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">無料プランでどこまで使えますか？</h4>
                    <p className="text-gray-600 text-sm">基本的な自己分析とES管理機能をご利用いただけます。月間の利用制限はありますが、ResearchHubの価値を十分に体験できます。</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">データの安全性は保証されていますか？</h4>
                    <p className="text-gray-600 text-sm">はい。すべてのデータは暗号化されて保存され、厳格なセキュリティ基準のもとで管理されています。</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">AI分析の精度はどの程度ですか？</h4>
                    <p className="text-gray-600 text-sm">大量のキャリアデータと科学的手法により、97%以上の高精度な分析と予測を実現しています。</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">モバイルアプリはありますか？</h4>
                    <p className="text-gray-600 text-sm">現在はWebアプリケーションのみですが、モバイルアプリも開発予定です。Webブラウザから快適にご利用いただけます。</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <motion.footer 
          className="bg-gray-900 text-white py-16 px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold mb-4">ResearchHub</h3>
              <p className="text-gray-400">科学的アプローチで、理想のキャリアを実現</p>
            </div>

            <div className="grid md:grid-cols-5 gap-8 mb-12">
              <div>
                <h4 className="font-semibold mb-4">プロダクト</h4>
                <div className="space-y-2">
                  <Link href="/features" className="block text-gray-400 hover:text-white transition-colors">機能一覧</Link>
                  <Link href="/pricing" className="block text-gray-400 hover:text-white transition-colors">料金プラン</Link>
                  <Link href="/api" className="block text-gray-400 hover:text-white transition-colors">API</Link>
                  <Link href="/updates" className="block text-gray-400 hover:text-white transition-colors">アップデート</Link>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">ソリューション</h4>
                <div className="space-y-2">
                  <Link href="/students" className="block text-gray-400 hover:text-white transition-colors">学生向け</Link>
                  <Link href="/professionals" className="block text-gray-400 hover:text-white transition-colors">社会人向け</Link>
                  <Link href="/universities" className="block text-gray-400 hover:text-white transition-colors">大学向け</Link>
                  <Link href="/enterprise" className="block text-gray-400 hover:text-white transition-colors">企業向け</Link>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">リソース</h4>
                <div className="space-y-2">
                  <Link href="/blog" className="block text-gray-400 hover:text-white transition-colors">ブログ</Link>
                  <Link href="/success-stories" className="block text-gray-400 hover:text-white transition-colors">成功事例</Link>
                  <Link href="/help" className="block text-gray-400 hover:text-white transition-colors">ヘルプセンター</Link>
                  <Link href="/webinars" className="block text-gray-400 hover:text-white transition-colors">ウェビナー</Link>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">会社情報</h4>
                <div className="space-y-2">
                  <Link href="/about" className="block text-gray-400 hover:text-white transition-colors">会社概要</Link>
                  <Link href="/team" className="block text-gray-400 hover:text-white transition-colors">チーム</Link>
                  <Link href="/career" className="block text-gray-400 hover:text-white transition-colors">採用情報</Link>
                  <Link href="/news" className="block text-gray-400 hover:text-white transition-colors">ニュース</Link>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">サポート</h4>
                <div className="space-y-2">
                  <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors">お問い合わせ</Link>
                  <Link href="/status" className="block text-gray-400 hover:text-white transition-colors">システム状況</Link>
                  <Link href="/security" className="block text-gray-400 hover:text-white transition-colors">セキュリティ</Link>
                  <Link href="/privacy" className="block text-gray-400 hover:text-white transition-colors">プライバシー</Link>
                </div>
              </div>
            </div>

            <motion.div 
              className="border-t border-gray-800 pt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center space-x-6 mb-4 md:mb-0">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center"
                  >
                    <Briefcase className="w-5 h-5 text-white" />
                  </motion.div>
                  <span className="text-xl font-bold">ResearchHub</span>
                </div>
                
                <div className="text-center md:text-right">
                  <p className="text-gray-400 text-sm mb-2">
                    科学的キャリア分析プラットフォーム
                  </p>
                  <p className="text-gray-500 text-sm">
                    &copy; 2024 ResearchHub Corporation. All rights reserved.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.footer>
      </main>
    </div>
  );
}
