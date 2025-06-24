"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Bell,
  Briefcase,
  Calendar,
  CheckCircle,
  FileText,
  Heart,
  Home,
  MessageSquare,
  Plus,
  Search,
  Settings,
  Target,
  User,
  Users,
  Clock,
  ArrowRight,
  Award,
  LogIn,
} from "lucide-react"
import Link from "next/link"
import { useLoginModal } from "@/hooks/useLoginModal";

interface Activity {
  id: number;
  type: string;
  title: string;
  time: string;
  icon: any;
  color: string;
}

interface Task {
  id: number;
  task: string;
  completed: boolean;
}

interface Deadline {
  id: number;
  company: string;
  deadline: string;
  position: string;
  urgent: boolean;
}

export default function DemoPage() {
  const { onOpen: onOpenLogin } = useLoginModal();

  // デモ用のサンプルデータ
  const userStats = {
    name: "田中太郎（デモ）",
    avatar: "/placeholder.svg?height=40&width=40",
    completedAnalyses: 3,
    portfolioProjects: 5,
    submittedES: 12,
    communityPosts: 8,
  };

  const activities: Activity[] = [
    {
      id: 1,
      type: "self_analysis",
      title: "MBTI診断を完了しました",
      time: "2時間前",
      icon: User,
      color: "text-purple-600",
    },
    {
      id: 2,
      type: "portfolio",
      title: "ポートフォリオに新しいプロジェクトを追加",
      time: "5時間前",
      icon: Briefcase,
      color: "text-blue-600",
    },
    {
      id: 3,
      type: "es",
      title: "株式会社ABCのESを提出",
      time: "1日前",
      icon: FileText,
      color: "text-green-600",
    },
    {
      id: 4,
      type: "community",
      title: "面接対策のディスカッションに参加",
      time: "2日前",
      icon: MessageSquare,
      color: "text-orange-600",
    },
  ];

  const todayTasks: Task[] = [
    { id: 1, task: "強み・弱み分析を完了する", completed: false },
    { id: 2, task: "ポートフォリオのレビューを受ける", completed: true },
    { id: 3, task: "企業研究：株式会社XYZ", completed: false },
    { id: 4, task: "面接練習（模擬面接）", completed: true },
  ];

  const upcomingDeadlines: Deadline[] = [
    {
      id: 1,
      company: "株式会社ABC",
      deadline: "2024-01-15",
      position: "フロントエンドエンジニア",
      urgent: true,
    },
    {
      id: 2,
      company: "株式会社XYZ",
      deadline: "2024-01-20",
      position: "プロダクトマネージャー",
      urgent: false,
    },
    {
      id: 3,
      company: "スタートアップDEF",
      deadline: "2024-01-25",
      position: "フルスタックエンジニア",
      urgent: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* デモバナー */}
      <div className="bg-gradient-to-r from-blue-600 to-orange-500 text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Badge className="bg-white/20 text-white border-white/30">
              デモモード
            </Badge>
            <span className="text-sm">
              これはCareerHubの機能をお試しいただけるデモ画面です
            </span>
          </div>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={onOpenLogin}
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            <LogIn className="w-4 h-4 mr-2" />
            ログインして始める
          </Button>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CareerHub</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" size="sm">
              <Home className="w-4 h-4 mr-2" />
              ダッシュボード
            </Button>
            <Button variant="ghost" size="sm">
              <User className="w-4 h-4 mr-2" />
              自己分析
            </Button>
            <Button variant="ghost" size="sm">
              <Briefcase className="w-4 h-4 mr-2" />
              ポートフォリオ
            </Button>
            <Button variant="ghost" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              ES管理
            </Button>
            <Button variant="ghost" size="sm">
              <Users className="w-4 h-4 mr-2" />
              コミュニティ
            </Button>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback>田</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            おかえりなさい、{userStats.name}さん！
          </h1>
          <p className="text-gray-600">今日も就活を頑張りましょう 🚀</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-purple-100 rounded-lg">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{userStats.completedAnalyses}</div>
              <div className="text-sm text-gray-600">完了した自己分析</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{userStats.portfolioProjects}</div>
              <div className="text-sm text-gray-600">ポートフォリオ</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-green-100 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{userStats.submittedES}</div>
              <div className="text-sm text-gray-600">提出済みES</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-orange-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{userStats.communityPosts}</div>
              <div className="text-sm text-gray-600">コミュニティ投稿</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                最近のアクティビティ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-lg bg-white ${activity.color}`}>
                      <activity.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Today's Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                今日のタスク
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayTasks.map((task) => (
                  <div key={task.id} className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded border-2 flex-shrink-0 ${
                      task.completed 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                    <span className={`text-sm ${
                      task.completed 
                        ? 'line-through text-gray-500' 
                        : 'text-gray-900'
                    }`}>
                      {task.task}
                    </span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm mt-4">
                <span className="text-gray-600">進捗状況</span>
                <span className="font-medium">2/4 完了</span>
              </div>
              <div className="mt-2">
                <Progress value={50} />
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                締切が迫っています
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={deadline.urgent ? "outline" : "secondary"} 
                             className={deadline.urgent ? "border-red-500 text-red-600" : ""}>
                        {deadline.urgent ? "緊急" : "通常"}
                      </Badge>
                      <span className="text-sm text-gray-500">{deadline.deadline}</span>
                    </div>
                    <h4 className="font-semibold text-gray-900">{deadline.company}</h4>
                    <p className="text-sm text-gray-600">{deadline.position}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>クイックアクション</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-20 flex-col space-y-2" variant="outline">
                <User className="w-6 h-6" />
                <span className="text-sm">自己分析開始</span>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline">
                <Plus className="w-6 h-6" />
                <span className="text-sm">新しいES</span>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline">
                <Briefcase className="w-6 h-6" />
                <span className="text-sm">ポートフォリオ編集</span>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline">
                <Users className="w-6 h-6" />
                <span className="text-sm">コミュニティ</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
