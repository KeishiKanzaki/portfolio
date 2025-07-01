"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, Upload, Calendar, Download, Trash2, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Research {
  id: string
  title: string
  description: string
  type: "graduation" | "master" | "doctoral" | "other"
  year: string
  pdfFile?: File
  createdAt: Date
}

export default function ResearchManager() {
  const [researches, setResearches] = useState<Research[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "graduation" as Research["type"],
    year: new Date().getFullYear().toString(),
    pdfFile: null as File | null,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newResearch: Research = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      type: formData.type,
      year: formData.year,
      pdfFile: formData.pdfFile || undefined,
      createdAt: new Date(),
    }

    setResearches([newResearch, ...researches])
    setFormData({
      title: "",
      description: "",
      type: "graduation",
      year: new Date().getFullYear().toString(),
      pdfFile: null,
    })
    setIsDialogOpen(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setFormData({ ...formData, pdfFile: file })
    }
  }

  const handleDelete = (id: string) => {
    setResearches(researches.filter((research) => research.id !== id))
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

  return (
    <div className="min-h-screen bg-background">
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
                  <Button type="submit">
                    <Upload className="h-4 w-4 mr-2" />
                    保存
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(research.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-3 mb-4">{research.description}</CardDescription>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {research.createdAt.toLocaleDateString("ja-JP")}
                    </div>

                    {research.pdfFile && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const url = URL.createObjectURL(research.pdfFile!)
                          const a = document.createElement("a")
                          a.href = url
                          a.download = research.pdfFile!.name
                          a.click()
                          URL.revokeObjectURL(url)
                        }}
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
    </div>
  )
}
