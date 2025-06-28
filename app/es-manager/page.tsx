"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Filter, Edit, Trash2, FileText, Calendar, Building } from "lucide-react"
import Header from "@/components/layout/Header"
import Sidebar from "@/components/layout/Sidebar"
import { useAuth } from "@/components/providers/AuthProvider"
import { useSidebar } from "@/components/providers/SidebarProvider"

interface ESEntry {
  id: string
  company: string
  position: string
  deadline: string
  status: "draft" | "submitted" | "reviewed" | "accepted" | "rejected"
  content: string
  wordCount: number
  lastUpdated: string
}

export default function ESManagerPage() {
  const { user: authUser, loading } = useAuth()
  const { sidebarOpen, setSidebarOpen, toggleSidebar } = useSidebar()
  
  const [entries, setEntries] = useState<ESEntry[]>([
    {
      id: "1",
      company: "株式会社サンプル",
      position: "フロントエンドエンジニア",
      deadline: "2024-02-15",
      status: "draft",
      content: "私はフロントエンド開発に情熱を持っており...",
      wordCount: 450,
      lastUpdated: "2024-01-10"
    },
    {
      id: "2",
      company: "テクノロジー株式会社",
      position: "フルスタックエンジニア",
      deadline: "2024-02-20",
      status: "submitted",
      content: "私の技術的な経験と学習意欲について...",
      wordCount: 520,
      lastUpdated: "2024-01-12"
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const user = authUser ? {
    name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'ユーザー',
    email: authUser.email || '',
  } : {
    name: 'ゲスト',
    email: ''
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "draft":
        return "下書き"
      case "submitted":
        return "提出済み"
      case "reviewed":
        return "確認済み"
      case "accepted":
        return "合格"
      case "rejected":
        return "不合格"
      default:
        return "不明"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "submitted":
        return "bg-blue-100 text-blue-800"
      case "reviewed":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || entry.status === filterStatus
    return matchesSearch && matchesFilter
  })

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
          <p className="text-gray-600 mb-4">ES管理システムを使用するにはログインしてください。</p>
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
          notificationCount={2}
          onMenuClick={toggleSidebar}
        />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* ページヘッダー */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">ES管理システム</h1>
              <p className="text-gray-600">エントリーシートの作成・管理・追跡を効率的に行えます</p>
            </div>

            {/* 統計カード */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">総エントリー数</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{entries.length}</div>
                  <p className="text-xs text-muted-foreground">全ての応募企業</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">下書き</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {entries.filter(e => e.status === "draft").length}
                  </div>
                  <p className="text-xs text-muted-foreground">作成中のES</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">提出済み</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {entries.filter(e => e.status === "submitted").length}
                  </div>
                  <p className="text-xs text-muted-foreground">提出完了</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">合格率</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {entries.filter(e => e.status === "accepted").length > 0 
                      ? Math.round((entries.filter(e => e.status === "accepted").length / 
                          entries.filter(e => ["accepted", "rejected"].includes(e.status)).length) * 100)
                      : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">選考通過率</p>
                </CardContent>
              </Card>
            </div>

            {/* 検索・フィルター・新規作成 */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="企業名または職種で検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">全てのステータス</option>
                  <option value="draft">下書き</option>
                  <option value="submitted">提出済み</option>
                  <option value="reviewed">確認済み</option>
                  <option value="accepted">合格</option>
                  <option value="rejected">不合格</option>
                </select>
                
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  新規ES作成
                </Button>
              </div>
            </div>

            {/* ESエントリーリスト */}
            <div className="grid gap-4">
              {filteredEntries.map((entry) => (
                <Card key={entry.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{entry.company}</CardTitle>
                        <CardDescription className="mt-1">
                          {entry.position}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(entry.status)}>
                          {getStatusText(entry.status)}
                        </Badge>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {entry.content}
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>文字数: {entry.wordCount}文字</span>
                        <span>締切: {entry.deadline}</span>
                        <span>最終更新: {entry.lastUpdated}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredEntries.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || filterStatus !== "all" ? "検索結果がありません" : "ESがまだありません"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterStatus !== "all" 
                    ? "検索条件を変更してみてください" 
                    : "最初のエントリーシートを作成してみましょう"}
                </p>
                {!searchTerm && filterStatus === "all" && (
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    新規ES作成
                  </Button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
