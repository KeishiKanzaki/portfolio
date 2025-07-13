"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, Upload, Calendar, Download, Trash2, Plus, Edit } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/layout/Header"
import Sidebar from "@/components/layout/Sidebar"
import AnimatedBackground from "@/components/animations/AnimatedBackground"
import PageContainer from "@/components/layout/PageContainer"
import { useAuth } from "@/components/providers/AuthProvider"
import { useSidebar } from "@/components/providers/SidebarProvider"
import { researchService, type Research as ResearchType } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface Research {
  id: string
  title: string
  description: string
  type: "graduation" | "master" | "doctoral" | "other"
  year: string
  pdfFile?: File
  pdf_file_path?: string
  pdf_file_name?: string
  createdAt: Date
}

export default function ResearchManager() {
  const { user: authUser, loading } = useAuth()
  const { sidebarOpen, setSidebarOpen, toggleSidebar } = useSidebar()
  const { toast } = useToast()
  
  const [researches, setResearches] = useState<Research[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingResearch, setEditingResearch] = useState<Research | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "graduation" as Research["type"],
    year: new Date().getFullYear().toString(),
    pdfFile: null as File | null,
  })

  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    type: "graduation" as Research["type"],
    year: new Date().getFullYear().toString(),
    pdfFile: null as File | null,
  })

  // Supabaseの認証ユーザー情報から名前とメールを取得
  const user = authUser ? {
    name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || "ユーザー",
    email: authUser.email || ""
  } : {
    name: "ゲスト",
    email: ""
  }

  // Load researches from Supabase on component mount
  useEffect(() => {
    if (authUser) {
      loadResearches()
    }
  }, [authUser])

  const loadResearches = async () => {
    if (!authUser) return
    
    try {
      setIsLoading(true)
      const researchData = await researchService.getAll(authUser.id)
      // データベースの形式をコンポーネントの形式に変換
      const convertedData: Research[] = researchData.map((item: ResearchType) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        type: item.type,
        year: item.year,
        pdf_file_path: item.pdf_file_path,
        pdf_file_name: item.pdf_file_name,
        createdAt: new Date(item.created_at),
      }))
      setResearches(convertedData)
    } catch (error) {
      console.error('Error loading researches:', error)
      toast({
        title: "エラー",
        description: "研究データの読み込みに失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!authUser) {
      toast({
        title: "エラー",
        description: "ログインが必要です。",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      
      const newResearch = await researchService.create({
        title: formData.title,
        description: formData.description,
        type: formData.type,
        year: formData.year,
        pdfFile: formData.pdfFile || undefined,
      }, authUser.id)

      // 新しい研究をリストに追加
      const convertedResearch: Research = {
        id: newResearch.id,
        title: newResearch.title,
        description: newResearch.description,
        type: newResearch.type,
        year: newResearch.year,
        pdf_file_path: newResearch.pdf_file_path,
        pdf_file_name: newResearch.pdf_file_name,
        createdAt: new Date(newResearch.created_at),
      }

      setResearches([convertedResearch, ...researches])
      setFormData({
        title: "",
        description: "",
        type: "graduation",
        year: new Date().getFullYear().toString(),
        pdfFile: null,
      })
      setIsDialogOpen(false)
      
      toast({
        title: "成功",
        description: "研究が正常に保存されました。",
      })
    } catch (error) {
      console.error('Error creating research:', error)
      toast({
        title: "エラー",
        description: "研究の保存に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setFormData({ ...formData, pdfFile: file })
    }
  }

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setEditFormData({ ...editFormData, pdfFile: file })
    }
  }

  const handleEdit = (research: Research) => {
    setEditingResearch(research)
    setEditFormData({
      title: research.title,
      description: research.description,
      type: research.type,
      year: research.year,
      pdfFile: null,
    })
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!authUser || !editingResearch) return

    try {
      setIsSubmitting(true)

      const updatedResearch = await researchService.update(
        editingResearch.id, 
        {
          title: editFormData.title,
          description: editFormData.description,
          type: editFormData.type,
          year: editFormData.year,
          pdfFile: editFormData.pdfFile || undefined,
        },
        authUser.id
      )

      const convertedResearch: Research = {
        id: updatedResearch.id,
        title: updatedResearch.title,
        description: updatedResearch.description,
        type: updatedResearch.type,
        year: updatedResearch.year,
        pdf_file_path: updatedResearch.pdf_file_path,
        pdf_file_name: updatedResearch.pdf_file_name,
        createdAt: new Date(updatedResearch.created_at),
      }

      setResearches(researches.map(r => 
        r.id === editingResearch.id ? convertedResearch : r
      ))

      setIsEditDialogOpen(false)
      setEditingResearch(null)
      setEditFormData({
        title: "",
        description: "",
        type: "graduation",
        year: new Date().getFullYear().toString(),
        pdfFile: null,
      })

      toast({
        title: "成功",
        description: "研究が正常に更新されました。",
      })
    } catch (error) {
      console.error('Error updating research:', error)
      toast({
        title: "エラー",
        description: "研究の更新に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await researchService.delete(id)
      setResearches(researches.filter((research) => research.id !== id))
      toast({
        title: "成功",
        description: "研究が正常に削除されました。",
      })
    } catch (error) {
      console.error('Error deleting research:', error)
      toast({
        title: "エラー",
        description: "研究の削除に失敗しました。",
        variant: "destructive",
      })
    }
  }

  const getTypeLabel = (type: Research["type"]) => {
    const labels = {
      graduation: "卒業研究",
      master: "修士研究",
      doctoral: "博士研究",
      other: "その他",
    }
    return labels[type]
  }

  const getTypeBadgeVariant = (type: Research["type"]) => {
    const variants = {
      graduation: "default",
      master: "secondary",
      doctoral: "destructive",
      other: "outline",
    }
    return variants[type] as "default" | "secondary" | "destructive" | "outline"
  }

  const handlePdfDownload = async (research: Research) => {
    if (!research.pdf_file_path) return

    try {
      const downloadUrl = await researchService.getPdfDownloadUrl(research.pdf_file_path)
      const a = document.createElement("a")
      a.href = downloadUrl
      a.download = research.pdf_file_name || "research.pdf"
      a.click()
    } catch (error) {
      console.error('Error downloading PDF:', error)
      toast({
        title: "エラー",
        description: "PDFのダウンロードに失敗しました。",
        variant: "destructive",
      })
    }
  }

  // ローディング中の表示
  if (loading || isLoading) {
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
          <p className="text-gray-600 mb-4">研究管理システムを使用するにはログインしてください。</p>
          <Button onClick={() => window.location.href = '/'}>
            ホームに戻る
          </Button>
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
            notificationCount={0}
            onMenuClick={toggleSidebar}
            currentPage="research"
          />
          
          <PageContainer
            title="研究管理"
            description="研究活動の記録と管理を行い、学術的な成果を整理しましょう"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">研究管理システム</h1>
            <p className="text-muted-foreground mt-2">卒業研究や修士研究などを整理・保存できます</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                新しい研究を追加
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>研究を追加</DialogTitle>
                <DialogDescription>研究の詳細情報とPDFファイルを登録してください</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">タイトル *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="研究のタイトルを入力してください"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">研究種別 *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: Research["type"]) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="graduation">卒業研究</SelectItem>
                        <SelectItem value="master">修士研究</SelectItem>
                        <SelectItem value="doctoral">博士研究</SelectItem>
                        <SelectItem value="other">その他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">年度 *</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      placeholder="2024"
                      min="1900"
                      max="2100"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">概要 *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="研究の概要や内容について説明してください"
                    className="min-h-[120px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pdf">PDFファイル</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="pdf"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                    {formData.pdfFile && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <FileText className="h-4 w-4 mr-1" />
                        {formData.pdfFile.name}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    キャンセル
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    <Upload className="h-4 w-4 mr-2" />
                    {isSubmitting ? "保存中..." : "保存"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* 編集モーダル */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>研究を編集</DialogTitle>
                <DialogDescription>研究の詳細情報を更新してください</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleEditSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">タイトル *</Label>
                  <Input
                    id="edit-title"
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    placeholder="研究のタイトルを入力してください"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-type">研究種別 *</Label>
                    <Select
                      value={editFormData.type}
                      onValueChange={(value: Research["type"]) => setEditFormData({ ...editFormData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="graduation">卒業研究</SelectItem>
                        <SelectItem value="master">修士研究</SelectItem>
                        <SelectItem value="doctoral">博士研究</SelectItem>
                        <SelectItem value="other">その他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-year">年度 *</Label>
                    <Input
                      id="edit-year"
                      type="number"
                      value={editFormData.year}
                      onChange={(e) => setEditFormData({ ...editFormData, year: e.target.value })}
                      placeholder="2024"
                      min="1900"
                      max="2100"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-description">概要 *</Label>
                  <Textarea
                    id="edit-description"
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    placeholder="研究の概要や内容について説明してください"
                    className="min-h-[120px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-pdf">PDFファイル（新しいファイルで置き換える場合）</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="edit-pdf"
                      type="file"
                      accept=".pdf"
                      onChange={handleEditFileChange}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                    {editFormData.pdfFile && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <FileText className="h-4 w-4 mr-1" />
                        {editFormData.pdfFile.name}
                      </div>
                    )}
                  </div>
                  {editingResearch?.pdf_file_name && !editFormData.pdfFile && (
                    <p className="text-sm text-muted-foreground">
                      現在のファイル: {editingResearch.pdf_file_name}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    キャンセル
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    <Upload className="h-4 w-4 mr-2" />
                    {isSubmitting ? "更新中..." : "更新"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-8">
          <Separator />
        </div>

        {researches.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">研究が登録されていません</h3>
              <p className="text-muted-foreground mb-4">最初の研究を追加して管理を始めましょう</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                研究を追加
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {researches.map((research) => (
              <Card key={research.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2 mb-2">{research.title}</CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={getTypeBadgeVariant(research.type)}>{getTypeLabel(research.type)}</Badge>
                        <Badge variant="outline">{research.year}年度</Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(research)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(research.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-3 mb-4">{research.description}</CardDescription>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {research.createdAt.toLocaleDateString("ja-JP")}
                    </div>

                    {research.pdf_file_path && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePdfDownload(research)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
              </div>
            </motion.div>
          </PageContainer>
        </div>
      </div>
    </AnimatedBackground>
  )
}
