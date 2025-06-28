"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, BarChart3, Target, Clock, TrendingUp } from "lucide-react"
import Header from "@/components/layout/Header"
import Sidebar from "@/components/layout/Sidebar"
import TodoSummary from "@/components/dashboard/TodoSummary"
import { useAuth } from "@/components/providers/AuthProvider"
import { useSidebar } from "@/components/providers/SidebarProvider"

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: "high" | "medium" | "low"
  dueDate: string
}

interface User {
  name: string
  email: string
}

export default function DashboardPage() {
  const { user: authUser, loading } = useAuth()
  const { sidebarOpen, setSidebarOpen, toggleSidebar } = useSidebar()
  
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "履歴書の更新",
      description: "最新の職歴と技術スキルを反映",
      completed: false,
      priority: "high",
      dueDate: "2024-01-15",
    },
    {
      id: "2",
      title: "ポートフォリオサイトの改善",
      description: "レスポンシブデザインの最適化",
      completed: true,
      priority: "medium",
      dueDate: "2024-01-10",
    },
    {
      id: "3",
      title: "自己分析レポートの作成",
      description: "キャリア目標と強みの整理",
      completed: false,
      priority: "high",
      dueDate: "2024-01-20",
    },
    {
      id: "4",
      title: "面接対策",
      description: "よくある質問への回答準備",
      completed: false,
      priority: "medium",
      dueDate: "2024-01-25",
    },
  ])

  // Supabaseの認証ユーザー情報から名前とメールを取得
  const user = authUser ? {
    name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || "ユーザー",
    email: authUser.email || ""
  } : {
    name: "ゲスト",
    email: ""
  }

  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task))
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "高"
      case "medium":
        return "中"
      case "low":
        return "低"
      default:
        return "なし"
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
          <p className="text-gray-600 mb-4">ダッシュボードを表示するにはログインしてください。</p>
          <Button onClick={() => window.location.href = '/'}>
            ホームに戻る
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex h-screen bg-gray-100/40">
      <Sidebar 
        user={user} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className={`flex flex-col flex-1 transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-64' : 'ml-0'
      }`}>
        <Header 
          user={user} 
          notificationCount={3}
          onMenuClick={toggleSidebar}
        />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* ダッシュボードヘッダー */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
              <p className="text-gray-600 mt-1">キャリア成長の進捗を確認しましょう</p>
            </div>

            {/* 統計カード */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">完了タスク</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completedTasks}</div>
                  <p className="text-xs text-muted-foreground">/ {totalTasks} タスク</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">進捗率</CardTitle>
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(completionRate)}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">今月の目標</CardTitle>
                  <Target className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">アクション項目</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">成長スコア</CardTitle>
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78</div>
                  <p className="text-xs text-muted-foreground">前月比 +12</p>
                </CardContent>
              </Card>
            </div>

            {/* カレンダー/ToDo概要 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TodoSummary />
              </div>
              
              {/* 右側の追加統計やクイックリンク */}
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">今週の進捗</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">完了タスク</span>
                        <span className="font-semibold">{completedTasks}/{totalTasks}</span>
                      </div>
                      <div className="h-2">
                        <Progress value={completionRate} />
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>進捗率</span>
                        <span>{Math.round(completionRate)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">クイックアクション</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start" size="sm">
                        <Target className="w-4 h-4 mr-2" />
                        新しい目標を設定
                      </Button>
                      <Button variant="outline" className="w-full justify-start" size="sm">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        進捗レポートを確認
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* 従来のタスク一覧（キャリア関連） */}
            <Card>
              <CardHeader>
                <CardTitle>キャリアアクション項目</CardTitle>
                <CardDescription>キャリア成長のための重要なタスクを管理しましょう</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center space-x-4 p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
                    >
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="w-5 h-5 cursor-pointer"
                      >
                        {task.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-300" />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3
                            className={`font-medium ${
                              task.completed ? "line-through text-gray-500" : "text-gray-900"
                            }`}
                          >
                            {task.title}
                          </h3>
                          <Badge className={getPriorityColor(task.priority)}>
                            {getPriorityText(task.priority)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            期限: {new Date(task.dueDate).toLocaleDateString("ja-JP")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 成長分析とインサイト */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>成長分析</CardTitle>
                  <CardDescription>あなたのキャリア発展を可視化</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">スキル向上</span>
                      <span className="text-sm text-gray-500">+15%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">ネットワーク構築</span>
                      <span className="text-sm text-gray-500">+8%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">目標達成率</span>
                      <span className="text-sm text-gray-500">{Math.round(completionRate)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>推奨アクション</CardTitle>
                  <CardDescription>AI による成長提案</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900">技術スキル向上</p>
                      <p className="text-xs text-blue-700 mt-1">新しいフレームワークの学習をお勧めします</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-900">ネットワーキング</p>
                      <p className="text-xs text-green-700 mt-1">業界イベントへの参加を検討してください</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
