"use client";

import { useEffect, useState } from "react";
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
import { supabase } from "@/lib/supabase";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

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

export default function Component() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session?.user) {
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) throw profileError;
        setUserProfile(profile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const userStats = {
    name: userProfile?.name || "ゲスト",
    avatar: "/placeholder.svg?height=40&width=40",
    completedAnalyses: 3,
    portfolioProjects: 5,
    submittedES: 12,
    communityPosts: 8,
    weeklyGoalProgress: 75,
  };

  const recentActivities: Activity[] = [
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
  ];

  const weeklyTasks: Task[] = [
    { id: 1, task: "自己分析を完了する", completed: true },
    { id: 2, task: "ポートフォリオを更新", completed: false },
  ];

  const upcomingDeadlines: Deadline[] = [
    {
      id: 1,
      company: "A社",
      position: "ソフトウェアエンジニア",
      deadline: "2024/6/15",
      urgent: true
    },
    {
      id: 2,
      company: "B社",
      position: "フロントエンドエンジニア",
      deadline: "2024/6/20",
      urgent: false
    },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

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
            <Avatar className="w-8 h-8">
              <AvatarImage src={userStats.avatar} />
              <AvatarFallback>{userProfile?.name?.charAt(0) || 'U'}</AvatarFallback>
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
                <AvatarImage src={userStats.avatar} />
                <AvatarFallback>{userProfile?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-gray-900">{userProfile?.name}</h3>
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
                <div className="text-2xl font-bold">{userStats.completedAnalyses}</div>
                <p className="text-xs text-gray-500">+2 先週より</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">ポートフォリオ作品</CardTitle>
                <Target className="w-4 h-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats.portfolioProjects}</div>
                <p className="text-xs text-gray-500">+1 先週より</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">提出したES</CardTitle>
                <Target className="w-4 h-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats.submittedES}</div>
                <p className="text-xs text-gray-500">+3 先週より</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">コミュニティ投稿</CardTitle>
                <Target className="w-4 h-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats.communityPosts}</div>
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
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4">
                      <activity.icon className={`w-5 h-5 ${activity.color}`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
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
                      <CheckCircle className={`w-5 h-5 ${task.completed ? "text-green-500" : "text-gray-300"}`} />
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
}

