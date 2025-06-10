"use client";
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
} from "lucide-react";
import Link from "next/link";
import { StartFreeButton } from "@/components/StartFreeButton";

export default function HomePage() {
  return (
    <main className="p-6">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CareerHub</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
              機能
            </Link>
            <Link href="#community" className="text-gray-600 hover:text-blue-600 transition-colors">
              コミュニティ
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
              料金
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" className="text-gray-600" asChild>
                ログイン
            </Button>
            <StartFreeButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-100">就活・転職活動を一元管理</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            あなたの
            <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">キャリア</span>
            を<br />
            次のレベルへ
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            自己分析からポートフォリオ作成、ES管理まで。
            <br />
            就活・転職に必要なすべてを一つのプラットフォームで。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <StartFreeButton />
            <Button size="lg" variant="outline" className="text-lg text-white bg-gradient-to-r from-green-400 to-green-500 hover:from-green-600 hover:to-green-500 hover:text-white px-8 py-3" asChild>
              <Link href="/sign-in">
                ログイン
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3">
              デモを見る
            </Button>
          </div>
          <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>完全無料</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>登録3分</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>データ安全</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">すべての機能が一つに</h2>
            <p className="text-xl text-gray-600">
              就活・転職活動に必要なツールを統合したオールインワンプラットフォーム
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <User className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">自己分析</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600">
                  MBTI風性格診断、価値観診断、強み・弱み分析で自分を深く理解
                </CardDescription>
                <div className="mt-4 space-y-2 text-sm text-gray-500">
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>多角的診断ツール</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>結果の可視化</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">ポートフォリオ</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600">
                  プロジェクト管理からサイト生成まで。魅力的なポートフォリオを簡単作成
                </CardDescription>
                <div className="mt-4 space-y-2 text-sm text-gray-500">
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>テンプレート豊富</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>独自URL発行</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">ES管理</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600">
                  企業別ES整理、締切管理、添削機能で効率的な応募活動をサポート
                </CardDescription>
                <div className="mt-4 space-y-2 text-sm text-gray-500">
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>自動保存機能</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>ピアレビュー</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">コミュニティ</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600">
                  同じ目標を持つ仲間と繋がり、経験やノウハウを共有
                </CardDescription>
                <div className="mt-4 space-y-2 text-sm text-gray-500">
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>業界別交流</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>メンター制度</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">アクティブユーザー</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-blue-100">作成されたポートフォリオ</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">ユーザー満足度</div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">活発なコミュニティ</h2>
            <p className="text-xl text-gray-600">同じ目標を持つ仲間と繋がり、共に成長しましょう</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">経験談シェア</CardTitle>
                    <CardDescription>実際の就活体験を共有</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  面接体験、内定獲得のコツ、失敗談まで。リアルな経験談が豊富に投稿されています。
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">スキルアップ</CardTitle>
                    <CardDescription>お互いの成長をサポート</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  ポートフォリオのフィードバック、ES添削、面接練習など、相互支援が活発です。
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">業界情報</CardTitle>
                    <CardDescription>最新のトレンドを把握</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  各業界の最新動向、求められるスキル、企業文化など、貴重な情報が集まります。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            今すぐ始めて、理想のキャリアを実現しよう
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            無料登録で全機能をお試しいただけます。あなたの就活・転職活動を次のレベルへ。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <StartFreeButton />
            <Button size="lg" variant="outline" className="text-lg px-8 py-3">
              詳細を見る
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">CareerHub</span>
              </div>
              <p className="text-gray-400">就活・転職活動を成功に導く統合プラットフォーム</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">機能</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    自己分析
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    ポートフォリオ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    ES管理
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    コミュニティ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">サポート</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    ヘルプセンター
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    お問い合わせ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    利用規約
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    プライバシーポリシー
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">会社情報</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    会社概要
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    採用情報
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    ブログ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    ニュース
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CareerHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
