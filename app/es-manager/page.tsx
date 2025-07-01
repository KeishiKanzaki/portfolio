"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Edit, Trash2, FileText, Calendar, Building, Save, Building2 } from "lucide-react"
import Header from "@/components/layout/Header"
import Sidebar from "@/components/layout/Sidebar"
import { useAuth } from "@/components/providers/AuthProvider"
import { useSidebar } from "@/components/providers/SidebarProvider"

interface ESEntry {
  id: string
  companyName: string
  position: string
  deadline: string
  status: "draft" | "submitted" | "reviewed" | "accepted" | "rejected"
  content: string
  characterLimit: number
  createdAt: string
  updatedAt: string
}

export default function ESManagerPage() {
  const { user: authUser, loading } = useAuth()
  const { sidebarOpen, setSidebarOpen, toggleSidebar } = useSidebar()
  
  const [entries, setEntries] = useState<ESEntry[]>([])
  const [selectedEntry, setSelectedEntry] = useState<ESEntry | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [formData, setFormData] = useState({
    companyName: "",
    position: "",
    deadline: "",
    status: "draft" as "draft" | "submitted" | "reviewed" | "accepted" | "rejected",
    content: "",
    characterLimit: 400,
  })

  const user = authUser ? {
    name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'ユーザー',
    email: authUser.email || '',
  } : {
    name: 'ゲスト',
    email: ''
  }

  // ローカルストレージからデータを読み込み
  useEffect(() => {
    const savedEntries = localStorage.getItem("es-entries")
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [])

  // データをローカルストレージに保存
  const saveToLocalStorage = (newEntries: ESEntry[]) => {
    localStorage.setItem("es-entries", JSON.stringify(newEntries))
  }

  // 新規エントリー作成
  const createEntry = () => {
    const newEntry: ESEntry = {
      id: Date.now().toString(),
      companyName: formData.companyName,
      position: formData.position,
      deadline: formData.deadline,
      status: formData.status,
      content: formData.content,
      characterLimit: formData.characterLimit,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const newEntries = [...entries, newEntry]
    setEntries(newEntries)
    saveToLocalStorage(newEntries)
    resetForm()
    setIsDialogOpen(false)
  }

  // エントリー更新
  const updateEntry = () => {
    if (!selectedEntry) return

    const updatedEntry = {
      ...selectedEntry,
      companyName: formData.companyName,
      position: formData.position,
      deadline: formData.deadline,
      status: formData.status,
      content: formData.content,
      characterLimit: formData.characterLimit,
      updatedAt: new Date().toISOString(),
    }

    const newEntries = entries.map((entry) => (entry.id === selectedEntry.id ? updatedEntry : entry))
    setEntries(newEntries)
    saveToLocalStorage(newEntries)
    setSelectedEntry(updatedEntry)
    resetForm()
    setIsDialogOpen(false)
    setIsEditing(false)
  }

  // エントリー削除
  const deleteEntry = (id: string) => {
    const newEntries = entries.filter((entry) => entry.id !== id)
    setEntries(newEntries)
    saveToLocalStorage(newEntries)
    if (selectedEntry?.id === id) {
      setSelectedEntry(null)
    }
  }

  // フォームリセット
  const resetForm = () => {
    setFormData({
      companyName: "",
      position: "",
      deadline: "",
      status: "draft",
      content: "",
      characterLimit: 400,
    })
  }

  // エントリー選択
  const selectEntry = (entry: ESEntry) => {
    setSelectedEntry(entry)
  }

  // 編集開始
  const startEdit = (entry: ESEntry) => {
    setFormData({
      companyName: entry.companyName,
      position: entry.position,
      deadline: entry.deadline,
      status: entry.status,
      content: entry.content,
      characterLimit: entry.characterLimit,
    })
    setSelectedEntry(entry)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  // 文字数カウント
  const getCharacterCount = (text: string) => text.length

  // 選択されたエントリーの内容を直接更新
  const updateSelectedEntryContent = (newContent: string) => {
    if (!selectedEntry) return
    
    const updatedEntry = { ...selectedEntry, content: newContent, updatedAt: new Date().toISOString() }
    const newEntries = entries.map((entry) =>
      entry.id === selectedEntry.id ? updatedEntry : entry
    )
    setEntries(newEntries)
    saveToLocalStorage(newEntries)
    setSelectedEntry(updatedEntry)
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
    const matchesSearch = entry.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 企業一覧 */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        企業一覧
                      </CardTitle>
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            onClick={() => {
                              resetForm()
                              setIsEditing(false)
                              setSelectedEntry(null)
                            }}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            新規作成
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{isEditing ? "ES編集" : "新規ES作成"}</DialogTitle>
                            <DialogDescription>企業情報とエントリーシートの内容を入力してください</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="company">企業名</Label>
                                <Input
                                  id="company"
                                  value={formData.companyName}
                                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                  placeholder="株式会社○○"
                                />
                              </div>
                              <div>
                                <Label htmlFor="position">職種</Label>
                                <Input
                                  id="position"
                                  value={formData.position}
                                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                  placeholder="エンジニア"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="deadline">締切日</Label>
                                <Input
                                  id="deadline"
                                  type="date"
                                  value={formData.deadline}
                                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor="status">ステータス</Label>
                                <select
                                  id="status"
                                  value={formData.status}
                                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                >
                                  <option value="draft">下書き</option>
                                  <option value="submitted">提出済み</option>
                                  <option value="reviewed">確認済み</option>
                                  <option value="accepted">合格</option>
                                  <option value="rejected">不合格</option>
                                </select>
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="limit">文字数制限</Label>
                              <Input
                                id="limit"
                                type="number"
                                value={formData.characterLimit}
                                onChange={(e) =>
                                  setFormData({ ...formData, characterLimit: Number.parseInt(e.target.value) || 400 })
                                }
                                min="1"
                                max="2000"
                              />
                            </div>
                            <div>
                              <Label htmlFor="content">ES内容</Label>
                              <Textarea
                                id="content"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="志望動機や自己PRを記入してください..."
                                rows={10}
                                className="resize-none"
                              />
                              <div className="flex justify-between items-center mt-2 text-sm">
                                <span
                                  className={`${getCharacterCount(formData.content) > formData.characterLimit ? "text-red-500" : "text-gray-500"}`}
                                >
                                  {getCharacterCount(formData.content)} / {formData.characterLimit} 文字
                                </span>
                                {getCharacterCount(formData.content) > formData.characterLimit && (
                                  <Badge variant="destructive">文字数超過</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                              キャンセル
                            </Button>
                            <Button
                              onClick={isEditing ? updateEntry : createEntry}
                              disabled={
                                !formData.companyName ||
                                !formData.content ||
                                getCharacterCount(formData.content) > formData.characterLimit
                              }
                            >
                              <Save className="w-4 h-4 mr-1" />
                              {isEditing ? "更新" : "保存"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* 検索・フィルター */}
                    <div className="space-y-4 mb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="企業名または職種で検索..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="all">全てのステータス</option>
                        <option value="draft">下書き</option>
                        <option value="submitted">提出済み</option>
                        <option value="reviewed">確認済み</option>
                        <option value="accepted">合格</option>
                        <option value="rejected">不合格</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      {filteredEntries.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">まだESが登録されていません</p>
                      ) : (
                        filteredEntries.map((entry) => (
                          <div
                            key={entry.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedEntry?.id === entry.id ? "bg-blue-50 border-blue-200" : "bg-white hover:bg-gray-50"
                            }`}
                            onClick={() => selectEntry(entry)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium text-gray-900">{entry.companyName}</h3>
                                <p className="text-sm text-gray-600">{entry.position}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    startEdit(entry)
                                  }}
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteEntry(entry.id)
                                  }}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <Badge className={getStatusColor(entry.status)}>
                                {getStatusText(entry.status)}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {getCharacterCount(entry.content)}/{entry.characterLimit}文字
                              </Badge>
                              {getCharacterCount(entry.content) > entry.characterLimit && (
                                <Badge variant="destructive" className="text-xs">
                                  超過
                                </Badge>
                              )}
                            </div>
                            {entry.deadline && (
                              <div className="mt-1 text-xs text-gray-500">
                                締切: {new Date(entry.deadline).toLocaleDateString("ja-JP")}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* ES詳細・編集エリア */}
              <div className="lg:col-span-2">
                {selectedEntry ? (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            {selectedEntry.companyName} - {selectedEntry.position}
                          </CardTitle>
                          <CardDescription>
                            作成日: {new Date(selectedEntry.createdAt).toLocaleDateString("ja-JP")}
                            {selectedEntry.updatedAt !== selectedEntry.createdAt && (
                              <span className="ml-2">
                                更新日: {new Date(selectedEntry.updatedAt).toLocaleDateString("ja-JP")}
                              </span>
                            )}
                            {selectedEntry.deadline && (
                              <span className="ml-2">
                                締切: {new Date(selectedEntry.deadline).toLocaleDateString("ja-JP")}
                              </span>
                            )}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(selectedEntry.status)}>
                          {getStatusText(selectedEntry.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="view" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="view">表示</TabsTrigger>
                          <TabsTrigger value="edit">編集</TabsTrigger>
                        </TabsList>
                        <TabsContent value="view" className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-3">
                              <h3 className="font-medium">ES内容</h3>
                              <Badge
                                variant={
                                  getCharacterCount(selectedEntry.content) > selectedEntry.characterLimit
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {getCharacterCount(selectedEntry.content)} / {selectedEntry.characterLimit} 文字
                              </Badge>
                            </div>
                            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                              {selectedEntry.content || "内容が入力されていません"}
                            </div>
                          </div>
                        </TabsContent>
                        <TabsContent value="edit" className="space-y-4">
                          <div>
                            <Label htmlFor="edit-content">ES内容を編集</Label>
                            <Textarea
                              id="edit-content"
                              value={selectedEntry.content}
                              onChange={(e) => updateSelectedEntryContent(e.target.value)}
                              rows={15}
                              className="resize-none"
                              placeholder="志望動機や自己PRを記入してください..."
                            />
                            <div className="flex justify-between items-center mt-2">
                              <span
                                className={`text-sm ${getCharacterCount(selectedEntry.content) > selectedEntry.characterLimit ? "text-red-500" : "text-gray-500"}`}
                              >
                                {getCharacterCount(selectedEntry.content)} / {selectedEntry.characterLimit} 文字
                              </span>
                              {getCharacterCount(selectedEntry.content) > selectedEntry.characterLimit && (
                                <Badge variant="destructive" className="text-xs">
                                  文字数超過
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="flex items-center justify-center h-96">
                      <div className="text-center">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">ESを選択してください</h3>
                        <p className="text-gray-600">左側の企業一覧からESを選択して表示・編集できます</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* 統計情報 */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">統計情報</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
