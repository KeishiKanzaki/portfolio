"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, BarChart3, Target, Clock, TrendingUp } from "lucide-react"
import Header from "@/components/layout/Header"
import Sidebar from "@/components/layout/Sidebar"
import { useAuth } from "@/components/providers/AuthProvider"

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
    <div className="flex h-screen bg-gray-100/40">
      <Sidebar user={user} />
      <div className="flex flex-col flex-1">
        <Header user={user} notificationCount={3} />
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

            {/* タスク一覧 */}
            <Card>
              <CardHeader>
                <CardTitle>アクション項目</CardTitle>
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

            {/* クイックアクション */}
            <Card>
              <CardHeader>
                <CardTitle>クイックアクション</CardTitle>
                <CardDescription>よく使用する機能へのショートカット</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <BarChart3 className="h-6 w-6" />
                    <span>進捗レポート</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Target className="h-6 w-6" />
                    <span>目標設定</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <TrendingUp className="h-6 w-6" />
                    <span>成長分析</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
