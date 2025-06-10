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
} from "lucide-react"
import Link from "next/link"
import { UserButton } from "@clerk/nextjs"

export default function Component() {
  // Mock data for demonstration
  const userStats = {
    name: "田中 太郎",
    avatar: "/placeholder.svg?height=40&width=40",
    completedAnalyses: 3,
    portfolioProjects: 5,
    submittedES: 12,
    communityPosts: 8,
    weeklyGoalProgress: 75,
  }

  const recentActivities = [
    {
      id: 1,
      type: "analysis",
      title: "MBTI性格診断を完了しました",
      time: "2時間前",
      icon: User,
      color: "text-purple-600",
    },
    {
      id: 2,
      type: "portfolio",
      title: "新しいプロジェクト「ECサイト開発」を追加",
      time: "5時間前",
      icon: Briefcase,
      color: "text-blue-600",
    },
    {
      id: 3,
      type: "community",
      title: "山田さんの投稿にいいねしました",
      time: "1日前",
      icon: Heart,
      color: "text-red-500",
    },
    {
      id: 4,
      type: "es",
      title: "株式会社ABCのESを提出しました",
      time: "2日前",
      icon: FileText,
      color: "text-green-600",
    },
  ]

  const weeklyTasks = [
    { id: 1, task: "価値観診断を受ける", completed: true },
    { id: 2, task: "ポートフォリオに新プロジェクト追加", completed: true },
    { id: 3, task: "3社のES作成", completed: false },
    { id: 4, task: "コミュニティで質問投稿", completed: false },
  ]

  const upcomingDeadlines = [
    { company: "株式会社XYZ", position: "フロントエンドエンジニア", deadline: "3日後", urgent: true },
    { company: "テック株式会社", position: "バックエンドエンジニア", deadline: "1週間後", urgent: false },
    { company: "スタートアップABC", position: "フルスタックエンジニア", deadline: "2週間後", urgent: false },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CareerHub</span>
            </div>
            <Separator />
            <nav className="flex items-center space-x-6">
              <Link href="#" className="flex items-center space-x-2 text-blue-600 font-medium">
                <Home className="w-4 h-4" />
                <span>ダッシュボード</span>
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                3
              </Badge>
            </Button>
            <Button variant="ghost" size="sm">
              <Search className="w-4 h-4" />
            </Button>
            <Avatar className="w-8 h-8">
              <AvatarImage src={userStats.avatar || "/placeholder.svg"} />
              <AvatarFallback>田中</AvatarFallback>
            </Avatar>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-screen p-6">
          <div className="space-y-6">
            {/* User Profile */}
            <div className="text-center">
              <Avatar className="w-16 h-16 mx-auto mb-3">
                <AvatarImage src={userStats.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-lg">田中</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-gray-900">{userStats.name}</h3>
              <p className="text-sm text-gray-500">就活生</p>
              <Badge className="mt-2 bg-green-100 text-green-700">アクティブ</Badge>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              <Link
                href="#"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium"
              >
                <Home className="w-4 h-4" />
                <span>ダッシュボード</span>
              </Link>
              <Link
                href="#"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700"
              >
                <User className="w-4 h-4" />
                <span>自己分析</span>
              </Link>
              <Link
                href="#"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700"
              >
                <Briefcase className="w-4 h-4" />
                <span>ポートフォリオ</span>
              </Link>
              <Link
                href="#"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700"
              >
                <FileText className="w-4 h-4" />
                <span>ES管理</span>
              </Link>
              <Link
                href="#"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700"
              >
                <Users className="w-4 h-4" />
                <span>コミュニティ</span>
              </Link>
              <Link
                href="#"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700"
              >
                <Settings className="w-4 h-4" />
                <span>設定</span>
              </Link>
            </nav>

            {/* Weekly Progress */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">今週の進捗</h4>
                <span className="text-sm font-medium text-blue-600">{userStats.weeklyGoalProgress}%</span>
              </div>
              <div className="mb-2">
                <Progress value={userStats.weeklyGoalProgress} />
              </div>
              <p className="text-xs text-gray-600">目標まであと少し！</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">おかえりなさい、{userStats.name}さん！</h1>
              <p className="text-gray-600">今日も就活を頑張りましょう。あなたの進捗を確認してみてください。</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">完了した自己分析</p>
                      <p className="text-2xl font-bold text-purple-600">{userStats.completedAnalyses}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <User className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">ポートフォリオ作品</p>
                      <p className="text-2xl font-bold text-blue-600">{userStats.portfolioProjects}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">提出したES</p>
                      <p className="text-2xl font-bold text-green-600">{userStats.submittedES}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">コミュニティ投稿</p>
                      <p className="text-2xl font-bold text-orange-600">{userStats.communityPosts}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">自己分析を始める</h3>
                  <p className="text-sm text-gray-600 mb-4">新しい診断ツールで自分を深く理解しよう</p>
                  <Button size="sm" className="w-full">
                    診断開始
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">新しい作品を追加</h3>
                  <p className="text-sm text-gray-600 mb-4">ポートフォリオに新しいプロジェクトを追加</p>
                  <Button size="sm" className="w-full" variant="outline">
                    作品追加
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">ESを作成</h3>
                  <p className="text-sm text-gray-600 mb-4">新しい企業のエントリーシートを作成</p>
                  <Button size="sm" className="w-full" variant="outline">
                    ES作成
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">投稿する</h3>
                  <p className="text-sm text-gray-600 mb-4">コミュニティで経験や質問をシェア</p>
                  <Button size="sm" className="w-full" variant="outline">
                    投稿作成
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span>最近のアクティビティ</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100`}>
                            <activity.icon className={`w-4 h-4 ${activity.color}`} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="ghost" className="w-full mt-4">
                      すべて見る
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Weekly Tasks */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="w-5 h-5 text-green-600" />
                      <span>今週のタスク</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {weeklyTasks.map((task) => (
                        <div key={task.id} className="flex items-center space-x-3">
                          <CheckCircle className={`w-5 h-5 ${task.completed ? "text-green-500" : "text-gray-300"}`} />
                          <span
                            className={`text-sm ${task.completed ? "text-gray-500 line-through" : "text-gray-900"}`}
                          >
                            {task.task}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Deadlines */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-red-600" />
                      <span>締切予定</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {upcomingDeadlines.map((deadline, index) => (
                        <div key={index} className="p-3 rounded-lg border border-gray-100">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-medium text-gray-900">{deadline.company}</h4>
                            <Badge variant={deadline.urgent ? "default" : "secondary"} className="text-xs">
                              {deadline.deadline}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">{deadline.position}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Achievement Badge */}
                <Card className="border-0 shadow-sm bg-gradient-to-r from-yellow-50 to-orange-50">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">今週の達成者！</h3>
                    <p className="text-sm text-gray-600">3つの自己分析を完了しました</p>
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

