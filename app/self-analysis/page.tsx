"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Save, Lightbulb, Edit, Trash2, Plus } from "lucide-react"
import Header from "@/components/layout/Header"
import Sidebar from "@/components/layout/Sidebar"
import AnimatedBackground from "@/components/animations/AnimatedBackground"
import PageContainer from "@/components/layout/PageContainer"
import { useAuth } from "@/components/providers/AuthProvider"
import { useSidebar } from "@/components/providers/SidebarProvider"
import { useLoginModal } from "@/hooks/useLoginModal"
import { SelfAnalysis, selfAnalysisService } from "@/lib/supabase"

// Simple toast implementation for now
const useToast = () => {
  const toast = ({ title, description, variant }: { title?: string; description?: string; variant?: "default" | "destructive" }) => {
    alert(`${title}: ${description}`)
  }
  return { toast }
}

interface User {
  name: string
  email: string
}

export default function SelfAnalysisPage() {
  const { user: authUser, loading } = useAuth()
  const { sidebarOpen, setSidebarOpen, toggleSidebar } = useSidebar()
  const loginModal = useLoginModal()
  const [analyses, setAnalyses] = useState<SelfAnalysis[]>([])
  const [currentAnalysis, setCurrentAnalysis] = useState<SelfAnalysis | null>(null)
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [suggestion, setSuggestion] = useState("")
  const { toast } = useToast()

  // Supabaseの認証ユーザー情報から名前とメールを取得
  const user = authUser ? {
    name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || "ユーザー",
    email: authUser.email || ""
  } : {
    name: "ゲスト",
    email: ""
  }

  // デバッグ用：認証状態をログ出力
  useEffect(() => {
    console.log('Auth state:', {
      loading,
      authUser: authUser ? {
        id: authUser.id,
        email: authUser.email,
        user_metadata: authUser.user_metadata
      } : null
    });
  }, [loading, authUser]);

  // Supabaseから分析データを読み込み
  useEffect(() => {
    const loadAnalyses = async () => {
      // ローディング中または未認証の場合はスキップ
      if (loading || !authUser) {
        return;
      }

      try {
        console.log('Loading analyses for user:', authUser.id);
        const data = await selfAnalysisService.getAll()
        console.log('Loaded analyses:', data);
        setAnalyses(data)
      } catch (error) {
        console.error('Failed to load analyses:', error)
        toast({
          title: "エラー",
          description: "分析データの読み込みに失敗しました。",
          variant: "destructive",
        })
      }
    }

    loadAnalyses()
  }, [authUser?.id, loading]) // authUser.idの変更のみを監視

  // 文字数カウント
  const characterCount = content.length

  // 新しい分析を作成
  const createNewAnalysis = () => {
    setCurrentAnalysis(null)
    setTitle("")
    setContent("")
    setSuggestion("")
  }

  // 分析を保存
  const saveAnalysis = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "エラー",
        description: "タイトルと内容を入力してください。",
        variant: "destructive",
      })
      return
    }

    if (!authUser) {
      toast({
        title: "エラー",
        description: "ログインが必要です。",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      if (currentAnalysis) {
        // 既存の分析を更新
        const updatedAnalysis = await selfAnalysisService.update(currentAnalysis.id, {
          title,
          content,
        })
        const updatedAnalyses = analyses.map((a) => (a.id === currentAnalysis.id ? updatedAnalysis : a))
        setAnalyses(updatedAnalyses)
        setCurrentAnalysis(updatedAnalysis)
      } else {
        // 新しい分析を作成
        const newAnalysis = await selfAnalysisService.create({
          title,
          content,
        }, authUser.id)
        const updatedAnalyses = [...analyses, newAnalysis]
        setAnalyses(updatedAnalyses)
        setCurrentAnalysis(newAnalysis)
      }

      toast({
        title: "保存完了",
        description: "自己分析が保存されました。",
      })
    } catch (error) {
      console.error('Failed to save analysis:', error)
      toast({
        title: "エラー",
        description: "保存に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 分析を選択
  const selectAnalysis = (analysis: SelfAnalysis) => {
    setCurrentAnalysis(analysis)
    setTitle(analysis.title)
    setContent(analysis.content)
    setSuggestion("")
  }

  // 分析を削除
  const deleteAnalysis = async (id: string) => {
    if (!authUser) {
      toast({
        title: "エラー",
        description: "ログインが必要です。",
        variant: "destructive",
      })
      return
    }

    try {
      await selfAnalysisService.delete(id)
      const updatedAnalyses = analyses.filter((a) => a.id !== id)
      setAnalyses(updatedAnalyses)

      if (currentAnalysis?.id === id) {
        createNewAnalysis()
      }

      toast({
        title: "削除完了",
        description: "自己分析が削除されました。",
      })
    } catch (error) {
      console.error('Failed to delete analysis:', error)
      toast({
        title: "エラー",
        description: "削除に失敗しました。",
        variant: "destructive",
      })
    }
  }

  // AI提案を取得
  const getSuggestion = async () => {
    if (!content.trim()) {
      toast({
        title: "エラー",
        description: "分析内容を入力してから提案を求めてください。",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new Error("提案の取得に失敗しました")
      }

      const data = await response.json()
      setSuggestion(data.suggestion)
    } catch (error) {
      toast({
        title: "エラー",
        description: "AI提案の取得に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // AI修正を取得
  const getImprovement = async () => {
    if (!content.trim()) {
      toast({
        title: "エラー",
        description: "分析内容を入力してから修正を求めてください。",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/improve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new Error("修正の取得に失敗しました")
      }

      const data = await response.json()
      setContent(data.improvedContent)
      toast({
        title: "修正完了",
        description: "内容が改善されました。",
      })
    } catch (error) {
      toast({
        title: "エラー",
        description: "AI修正の取得に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // ローディング中の表示
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // 未認証の場合はログインページにリダイレクト
  if (!authUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">認証が必要です</h2>
          <p className="text-gray-600 mb-6">自己分析ページを表示するにはログインしてください。</p>
          <div className="flex gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
            >
              ホームに戻る
            </Button>
            <Button 
              onClick={() => loginModal.onOpen()}
            >
              ログイン
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AnimatedBackground>
      <div className="flex">
        <Sidebar 
          user={user} 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <div className="flex-1">
          <Header
            user={user}
            notificationCount={2}
            onMenuClick={toggleSidebar}
            currentPage="self-analysis"
          />
          
          <PageContainer
            title="自己分析"
            description="自分の強みや価値観を深く理解し、キャリアの方向性を明確にしましょう"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* サイドバー - 保存された分析一覧 */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">保存された分析</CardTitle>
                      <Button onClick={createNewAnalysis} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {analyses.length === 0 ? (
                      <p className="text-sm text-gray-500">まだ分析がありません</p>
                    ) : (
                      analyses.map((analysis) => (
                        <div
                          key={analysis.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            currentAnalysis?.id === analysis.id ? "bg-blue-50 border-blue-200" : "bg-white hover:bg-gray-50"
                          }`}
                          onClick={() => selectAnalysis(analysis)}
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-sm truncate">{analysis.title}</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteAnalysis(analysis.id)
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(analysis.updated_at).toLocaleDateString("ja-JP")}
                          </p>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* メインエリア */}
              <div className="lg:col-span-3 space-y-6">
                {/* 入力エリア */}
                <Card>
                  <CardHeader>
                    <CardTitle>自己分析</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">タイトル</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="分析のタイトルを入力してください"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium">内容</label>
                        <Badge variant="secondary">{characterCount} 文字</Badge>
                      </div>
                      <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="自己分析の内容を書いてください..."
                        className="min-h-[300px] resize-none"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button onClick={saveAnalysis} className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? "保存中..." : "保存"}
                      </Button>
                      <Button onClick={getSuggestion} variant="outline" disabled={isLoading}>
                        <Lightbulb className="h-4 w-4 mr-2" />
                        AI提案
                      </Button>
                      <Button onClick={getImprovement} variant="outline" disabled={isLoading}>
                        <Edit className="h-4 w-4 mr-2" />
                        AI修正
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* AI提案エリア */}
                {suggestion && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                        AI提案
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <p className="whitespace-pre-wrap">{suggestion}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
              </div>
            </motion.div>
          </PageContainer>
        </div>
      </div>
    </AnimatedBackground>
  )
}
