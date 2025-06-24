import { getDashboardData, DashboardData } from "./actions";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Bell,
  Briefcase,
  Home,
  Search,
  Target,
  User,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import TaskToggle from "@/components/dashboard/TaskToggle"
import LogoutButton from "@/components/dashboard/LogoutButton"

interface Activity {
  id: string;
  type: string;
  title: string;
  created_at: string;
  description?: string;
}

interface Task {
  id: string;
  task: string;
  completed: boolean;
  due_date?: string;
}

interface Deadline {
  id: string;
  company: string;
  deadline: string;
  position: string;
  urgent: boolean;
}

// 時間を相対的に表示する関数
function formatRelativeTime(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = now.getTime() - date.getTime();
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 24) {
    return `${hours}時間前`;
  }
  
  const days = Math.floor(hours / 24);
  return `${days}日前`;
}

export default async function DashboardPage() {
  console.log("=== ダッシュボードページ開始 ===");
  
  try {
    // Server Actionからダッシュボードデータを取得
    const dashboardData = await getDashboardData();
    
    console.log("ダッシュボードデータ取得結果:", dashboardData ? "成功" : "失敗");
    
    // 認証されていない場合の処理を一時的にコメントアウト
    if (!dashboardData) {
      console.log("ダッシュボードデータなし - エラー表示");
      // redirect('/auth/login');
      
      // エラー表示で止める
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">認証エラー</h1>
            <p className="text-gray-600">ダッシュボードデータの取得に失敗しました</p>
            <p className="text-sm text-gray-500 mt-2">コンソールログを確認してください</p>
          </div>
        </div>
      );
    }

    console.log("ダッシュボードページ正常表示");
    const { user, stats, recentActivities, weeklyTasks, upcomingDeadlines } = dashboardData;

    return (
      <>
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6">
          <div className="flex flex-1 items-center justify-end md:justify-between">
            <div className="flex items-center gap-4 md:gap-2 lg:gap-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
                <Badge className="ml-1" variant="secondary">
                  3
                </Badge>
              </Button>
              <Button variant="ghost" size="sm">
                <Search className="w-4 h-4" />
              </Button>
              <LogoutButton />
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
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
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-gray-900">{user.name}</h3>
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
                  href="/self-analysis-page"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700"
                >
                  <User className="w-4 h-4" />
                  <span>自己分析</span>
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6 bg-gray-50">
            {/* Stats Grid */}
            <div className="grid gap-6 mb-6 grid-cols-1 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">完了した自己分析</CardTitle>
                  <Target className="w-4 h-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.completedAnalyses}</div>
                  <p className="text-xs text-gray-500">+2 先週より</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">ポートフォリオ作品</CardTitle>
                  <Target className="w-4 h-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.portfolioProjects}</div>
                  <p className="text-xs text-gray-500">+1 先週より</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">提出したES</CardTitle>
                  <Target className="w-4 h-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.submittedES}</div>
                  <p className="text-xs text-gray-500">+3 先週より</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">コミュニティ投稿</CardTitle>
                  <Target className="w-4 h-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.communityPosts}</div>
                  <p className="text-xs text-gray-500">+5 先週より</p>
                </CardContent>
              </Card>
            </div>

            {/* Activity Section */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">最近の活動</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => {
                      const IconComponent = activity.type === 'analysis' ? User : Briefcase;
                      const iconColor = activity.type === 'analysis' ? 'text-purple-600' : 'text-blue-600';
                      
                      return (
                        <div key={activity.id} className="flex items-start gap-4">
                          <IconComponent className={`w-5 h-5 ${iconColor}`} />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                            <p className="text-xs text-gray-500">{formatRelativeTime(activity.created_at)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">今週のタスク</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weeklyTasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-4">
                        <TaskToggle task={task} />
                        <span className={`text-sm ${task.completed ? "text-gray-500 line-through" : "text-gray-900"}`}>
                          {task.task}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Deadlines */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-sm font-medium">近日締め切り</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingDeadlines.map((deadline) => (
                    <div key={deadline.id} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-gray-900">{deadline.company}</h4>
                        <Badge variant={deadline.urgent ? "default" : "secondary"} className="text-xs">
                          {deadline.deadline}
                        </Badge>
                        <p className="text-xs text-gray-600">{deadline.position}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </>
    );
  } catch (error) {
    console.error("ダッシュボードページでエラー:", error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">ページエラー</h1>
          <p className="text-gray-600">ダッシュボードページでエラーが発生しました</p>
          <pre className="text-xs text-gray-500 mt-2 max-w-md overflow-auto">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </div>
      </div>
    );
  }
}
