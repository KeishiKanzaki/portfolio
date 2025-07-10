//クライアントコンポーネントを使用。
"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
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
} from "lucide-react";
import { StartFreeButton } from "@/components/StartFreeButton";
import { useLoginModal } from "@/hooks/useLoginModal";
import { useEffect, useState } from "react";

export default function HomePage() {
  const { onOpen: onOpenLogin } = useLoginModal(); //ログインモーダルの開閉制御
  const { scrollYProgress } = useScroll(); //スクロール進行度を0-1の値で取得（ページの一番上が0、一番下が1）。
  const [isClient, setIsClient] = useState(false); //クライアントサイドレンダリング

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

  const yTransform = useTransform(scrollYProgress, [0, 1], [0, -100]); //スクロールで要素を上に移動（パララックス効果）
  const scaleTransform = useTransform(scrollYProgress, [0, 1], [1, 0.8]); //スクロールで要素を縮小

  useEffect(() => {
    setIsClient(true); // クライアントサイドでのみ実行
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
        ease: "easeInOut" as const
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
                ResearchHub
              </motion.span>
            </motion.div>
            
            <nav className="hidden md:flex items-center space-x-8">
              {['機能', 'ストラテジー', 'インタビュー', 'キャリア'].map((item, index) => (
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
                className="hidden sm:block"
              >
                <Button 
                  className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg text-sm font-medium"
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
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </motion.button>
            </motion.div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <section className="py-24 sm:py-32 md:py-40 px-4 sm:px-6 lg:px-8 bg-gray-50 relative overflow-hidden">
          
          <div className="container mx-auto text-center max-w-6xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-16"
            >
              <motion.h1 
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight tracking-tight text-gray-900"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                あなたのキャリアを
                <br />
                <span className="text-gray-600">
                  科学する
                </span>
              </motion.h1>
            </motion.div>
            
            <motion.div 
              className="mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <p className="text-xl sm:text-2xl md:text-3xl text-gray-600 mb-8 leading-relaxed font-light">
                AI分析と科学的アプローチで、
                <br />
                あなたの「最適なキャリア」を発見しよう。
              </p>
              
              {/* 機能ハイライト */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
                <motion.div 
                  className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border border-gray-200"
                  whileHover={{ scale: 1.02, y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <User className="w-8 h-8 text-gray-700 mb-2" />
                  <span className="text-sm font-medium text-gray-900">自己分析</span>
                  <span className="text-xs text-gray-500">深層心理分析</span>
                </motion.div>
                
                <motion.div 
                  className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border border-gray-200"
                  whileHover={{ scale: 1.02, y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <FileText className="w-8 h-8 text-gray-700 mb-2" />
                  <span className="text-sm font-medium text-gray-900">ES管理</span>
                  <span className="text-xs text-gray-500">成功率最適化</span>
                </motion.div>
                
                <motion.div 
                  className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border border-gray-200"
                  whileHover={{ scale: 1.02, y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  <BarChart3 className="w-8 h-8 text-gray-700 mb-2" />
                  <span className="text-sm font-medium text-gray-900">AI分析</span>
                  <span className="text-xs text-gray-500">行動パターン解析</span>
                </motion.div>
                
                <motion.div 
                  className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border border-gray-200"
                  whileHover={{ scale: 1.02, y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                >
                  <Target className="w-8 h-8 text-gray-700 mb-2" />
                  <span className="text-sm font-medium text-gray-900">目標設定</span>
                  <span className="text-xs text-gray-500">スマート追跡</span>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  className="text-lg px-12 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium shadow-lg transition-all duration-300"
                  asChild
                >
                  <Link href="/dashboard">
                    無料で始める
                    <ArrowRight className="w-5 h-5 ml-2" />
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
                  className="text-lg px-12 py-4 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-lg font-medium transition-all duration-300"
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
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gray-900">95%</div>
                <div className="text-sm text-gray-600">ユーザー満足度</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gray-900">2.5x</div>
                <div className="text-sm text-gray-600">内定獲得率向上</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gray-900">10k+</div>
                <div className="text-sm text-gray-600">分析データポイント</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gray-900">30日</div>
                <div className="text-sm text-gray-600">平均目標達成期間</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Core Features Section */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="container mx-auto max-w-7xl">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-xl font-bold text-gray-500 mb-4">Core Features</h2>
              <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-8">
                科学的アプローチで、
                <br />
                キャリアを最適化する
              </h3>
              <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
                ResearchHubは、あなたのキャリアデータを科学的に分析し、
                最適な成長戦略を提案する次世代キャリアプラットフォームです。
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-700" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900">深層自己分析</h4>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    AIが行動パターンと心理的特性を分析し、あなたの本当の強みと価値観を発見。
                    データに基づいた客観的な自己理解で、キャリアの方向性を明確にします。
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-2xl font-bold text-gray-900">85%</div>
                      <div className="text-sm text-gray-600">精度向上</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-2xl font-bold text-gray-900">12+</div>
                      <div className="text-sm text-gray-600">分析指標</div>
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
                <div className="w-full h-96 bg-gray-50 rounded-2xl flex items-center justify-center relative overflow-hidden border border-gray-200">
                  <div className="absolute top-4 left-4 bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                    <div className="text-sm font-medium text-gray-600">自己分析スコア</div>
                    <div className="text-2xl font-bold text-gray-900">87/100</div>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                    <div className="text-sm font-medium text-gray-600">発見された強み</div>
                    <div className="text-lg font-bold text-gray-900">分析思考力</div>
                  </div>
                  <User className="w-24 h-24 text-gray-400" />
                </div>
              </motion.div>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="order-2 lg:order-1"
              >
                <div className="w-full h-96 bg-gray-50 rounded-2xl flex items-center justify-center relative overflow-hidden border border-gray-200">
                  <div className="absolute top-4 left-4 bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                    <div className="text-sm font-medium text-gray-600">ES成功率</div>
                    <div className="text-2xl font-bold text-gray-900">73%</div>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                    <div className="text-sm font-medium text-gray-600">提出済み</div>
                    <div className="text-lg font-bold text-gray-900">15件</div>
                  </div>
                  <FileText className="w-24 h-24 text-gray-400" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="order-1 lg:order-2"
              >
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-gray-700" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900">ES成功率最適化</h4>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    企業分析と成功パターンから、あなたに最適なES戦略を提案。
                    リアルタイムでフィードバックを提供し、内定獲得率を最大化します。
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-2xl font-bold text-gray-900">2.5x</div>
                      <div className="text-sm text-gray-600">成功率向上</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-2xl font-bold text-gray-900">24h</div>
                      <div className="text-sm text-gray-600">フィードバック</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-gray-700" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900">AI行動分析</h4>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    あなたの活動パターンを分析し、最適な成長戦略を提案。
                    個性と行動特性から、あなただけのキャリアロードマップを作成します。
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-2xl font-bold text-gray-900">97%</div>
                      <div className="text-sm text-gray-600">予測精度</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-2xl font-bold text-gray-900">5種</div>
                      <div className="text-sm text-gray-600">性格特性分析</div>
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
                <div className="w-full h-96 bg-gray-50 rounded-2xl flex items-center justify-center relative overflow-hidden border border-gray-200">
                  <div className="absolute top-4 left-4 bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                    <div className="text-sm font-medium text-gray-600">キャリア健康度</div>
                    <div className="text-2xl font-bold text-gray-900">92/100</div>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                    <div className="text-sm font-medium text-gray-600">今月の活動</div>
                    <div className="text-lg font-bold text-gray-900">18件</div>
                  </div>
                  <BarChart3 className="w-24 h-24 text-gray-400" />
                </div>
              </motion.div>
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
        <section id="success-stories" className="py-32 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="container mx-auto max-w-7xl">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-xl font-bold text-gray-600 mb-4">Success Stories</h2>
              <p className="text-2xl text-gray-900 max-w-4xl mx-auto leading-relaxed">
                ResearchHubを活用して理想のキャリアを実現した、
                ユーザーの成功ストーリーをご紹介します。
              </p>
            </motion.div>

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
                },
                {
                  title: "自己分析スコア95点で、理想のキャリアパスを発見",
                  subtitle: "AIによる深層分析で、隠れた強みと適性を発見し、新分野への転身を成功",
                  category: "自己分析",
                  metrics: "キャリア満足度: 95%向上",
                  user: "Bさん（既卒2年目）",
                  period: "2ヶ月",
                  delay: 0.2,
                },
                {
                  title: "研究成果を活かした戦略的キャリア設計",
                  subtitle: "研究ノート機能で専門性を体系化し、学術界から産業界への転身に成功",
                  category: "研究活用",
                  metrics: "年収: 150万円アップ",
                  user: "Cさん（修士課程）",
                  period: "4ヶ月",
                  delay: 0.4,
                },
                {
                  title: "継続率100%で習慣化に成功",
                  subtitle: "AI予測とリマインダーで、6ヶ月間毎日キャリア活動を継続",
                  category: "習慣化",
                  metrics: "活動継続率: 100%",
                  user: "Dさん（学部3年）",
                  period: "6ヶ月",
                  delay: 0.6,
                },
                {
                  title: "個性分析で最適な職場環境を発見",
                  subtitle: "行動パターン分析により、自分に最適な企業文化と働き方を特定",
                  category: "適性診断",
                  metrics: "職場満足度: 92%",
                  user: "Eさん（博士課程）",
                  period: "5ヶ月",
                  delay: 0.8,
                },
                {
                  title: "ベンチマーク分析で業界トップクラスのパフォーマンス",
                  subtitle: "同世代比較で上位5%の成果を達成し、希望業界でのポジションを確保",
                  category: "競合分析",
                  metrics: "業界順位: 上位5%",
                  user: "Fさん（院卒1年目）",
                  period: "7ヶ月",
                  delay: 1.0,
                }
              ].map((story, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.8, 
                    delay: story.delay,
                  }}
                  whileHover={{ 
                    y: -5,
                    scale: 1.02,
                  }}
                  className="group cursor-pointer"
                >
                  <Card className="border-0 shadow-lg h-full bg-white hover:shadow-xl transition-all duration-300 border border-gray-200">
                    <CardHeader>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 border border-gray-300">
                          {story.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                          期間: {story.period}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-bold text-gray-900 leading-tight mb-3 group-hover:text-gray-700 transition-colors">
                        {story.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 text-sm leading-relaxed mb-4">
                        {story.subtitle}
                      </CardDescription>
                      
                      {/* Metrics */}
                      <div className="p-3 bg-gray-50 rounded-lg mb-3 border border-gray-200">
                        <div className="text-sm font-semibold text-gray-700">{story.metrics}</div>
                      </div>
                      
                      {/* User Info */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{story.user}</span>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>検証済み</span>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* CTA Section */}
            <motion.div 
              className="text-center p-8 bg-gray-50 rounded-2xl border border-gray-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                あなたも成功ストーリーの主人公になりませんか？
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                科学的アプローチとAI分析で、あなたの理想のキャリアを実現しましょう。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-gray-900 text-white hover:bg-gray-800 px-8 py-3 rounded-lg font-medium transition-all duration-300"
                  asChild
                >
                  <Link href="/dashboard">今すぐ無料で始める</Link>
                </Button>
                <Button 
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-8 py-3 rounded-lg font-medium transition-all duration-300"
                  asChild
                >
                  <Link href="/success-stories">全ての事例を見る</Link>
                </Button>
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
        <section id="career" className="py-32 px-4 sm:px-6 lg:px-8 bg-gray-50 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full">
              <motion.div
                className="text-6xl md:text-8xl lg:text-9xl font-black text-gray-100 whitespace-nowrap absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                JOIN OUR TEAM! JOIN OUR TEAM! JOIN OUR TEAM!
              </motion.div>
            </div>
          </div>
          
          <div className="container mx-auto max-w-4xl text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-8">
                一緒に未来の
                <br />
                キャリアを
                <br />
                創りませんか？
              </h2>
              
              <p className="text-2xl md:text-3xl text-gray-600 mb-12 leading-relaxed">
                ResearchHubで、科学的アプローチによる
                <br />
                キャリア支援の新しいスタンダードを築きましょう。
              </p>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  className="bg-gray-900 text-white hover:bg-gray-800 px-12 py-4 text-xl font-bold rounded-lg"
                  asChild
                >
                  <Link href="/career">
                    採用情報を見る
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
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
