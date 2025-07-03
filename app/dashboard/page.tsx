"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, BarChart3, Target, Clock, TrendingUp, FileText, User, Beaker, Calendar, Plus, ArrowRight, Award, Zap, MapPin, Brain, Lightbulb, Eye, Settings, Star, AlertCircle, CheckSquare, Users } from "lucide-react"
import Header from "@/components/layout/Header"
import Sidebar from "@/components/layout/Sidebar"
import TodoSummary from "@/components/dashboard/TodoSummary"
import { useAuth } from "@/components/providers/AuthProvider"
import { useSidebar } from "@/components/providers/SidebarProvider"
import { selfAnalysisService, researchService, taskService } from "@/lib/supabase"

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
  
  // 統合データの状態管理
  const [integratedData, setIntegratedData] = useState<{
    selfAnalyses: any[]
    esEntries: any[]
    researches: any[]
    upcomingTasks: any[]
    recentActivities: any[]
  }>({
    selfAnalyses: [],
    esEntries: [],
    researches: [],
    upcomingTasks: [],
    recentActivities: []
  })
  const [isLoadingData, setIsLoadingData] = useState(true)
  
  // 分析データの状態管理
  const [analyticsData, setAnalyticsData] = useState<{
    careerHealthScore: number
    weeklyTrends: any[]
    esSuccessRate: number
    productivityMetrics: any
    monthlyActivity: any[]
  }>({
    careerHealthScore: 0,
    weeklyTrends: [],
    esSuccessRate: 0,
    productivityMetrics: {},
    monthlyActivity: []
  })
  
  // 高度な分析データの状態管理
  const [advancedData, setAdvancedData] = useState<{
    timeline: any[]
    predictions: any
    goalTracking: any[]
    insights: any[]
    benchmarkAnalysis: any
    recommendations: any[]
    personalityInsights: any[]
  }>({
    timeline: [],
    predictions: {},
    goalTracking: [],
    insights: [],
    benchmarkAnalysis: {},
    recommendations: [],
    personalityInsights: []
  })
  
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

  // 統計計算のヘルパー関数群
  const calculateCareerHealthScore = (data: any) => {
    const { selfAnalyses, esEntries, researches, upcomingTasks } = data
    
    // 各分野のスコア計算（0-100）
    const selfAnalysisScore = Math.min(selfAnalyses.length * 20, 100) // 5個で満点
    const esActivityScore = Math.min(esEntries.length * 10, 100) // 10個で満点
    const esSuccessScore = esEntries.length > 0 
      ? (esEntries.filter((es: any) => es.status === 'accepted').length / esEntries.length) * 100 
      : 0
    const researchScore = Math.min(researches.length * 25, 100) // 4個で満点
    const taskManagementScore = 100 - Math.min(upcomingTasks.length * 10, 80) // タスクが少ないほど高スコア
    
    // 重み付き平均
    const totalScore = (
      selfAnalysisScore * 0.25 +
      esActivityScore * 0.20 +
      esSuccessScore * 0.20 +
      researchScore * 0.20 +
      taskManagementScore * 0.15
    )
    
    return Math.round(totalScore)
  }

  const calculateESSuccessRate = (esEntries: any[]) => {
    if (esEntries.length === 0) return 0
    const acceptedCount = esEntries.filter(es => es.status === 'accepted').length
    const submittedCount = esEntries.filter(es => ['submitted', 'reviewed', 'accepted', 'rejected'].includes(es.status)).length
    return submittedCount > 0 ? Math.round((acceptedCount / submittedCount) * 100) : 0
  }

  const calculateWeeklyTrends = (data: any) => {
    const { selfAnalyses, esEntries, researches } = data
    const weeks = 4 // 過去4週間
    const trends = []
    
    for (let i = weeks - 1; i >= 0; i--) {
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - (i * 7 + 7))
      const weekEnd = new Date()
      weekEnd.setDate(weekEnd.getDate() - (i * 7))
      
      const weeklyActivity = {
        week: `${weekStart.getMonth() + 1}/${weekStart.getDate()}`,
        selfAnalysis: selfAnalyses.filter((item: any) => {
          const date = new Date(item.created_at || item.createdAt)
          return date >= weekStart && date < weekEnd
        }).length,
        esActivity: esEntries.filter((item: any) => {
          const date = new Date(item.updatedAt || item.created_at)
          return date >= weekStart && date < weekEnd
        }).length,
        research: researches.filter((item: any) => {
          const date = new Date(item.created_at || item.createdAt)
          return date >= weekStart && date < weekEnd
        }).length
      }
      
      trends.push(weeklyActivity)
    }
    
    return trends
  }

  const calculateMonthlyActivity = (data: any) => {
    const { selfAnalyses, esEntries, researches } = data
    const months = 6 // 過去6ヶ月
    const activity = []
    
    for (let i = months - 1; i >= 0; i--) {
      const monthStart = new Date()
      monthStart.setMonth(monthStart.getMonth() - i, 1)
      monthStart.setHours(0, 0, 0, 0)
      
      const monthEnd = new Date(monthStart)
      monthEnd.setMonth(monthEnd.getMonth() + 1)
      
      const monthlyData = {
        month: monthStart.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short' }),
        totalActivities: 0,
        selfAnalysis: 0,
        esActivity: 0,
        research: 0
      }
      
      monthlyData.selfAnalysis = selfAnalyses.filter((item: any) => {
        const date = new Date(item.created_at || item.createdAt)
        return date >= monthStart && date < monthEnd
      }).length
      
      monthlyData.esActivity = esEntries.filter((item: any) => {
        const date = new Date(item.updatedAt || item.created_at)
        return date >= monthStart && date < monthEnd
      }).length
      
      monthlyData.research = researches.filter((item: any) => {
        const date = new Date(item.created_at || item.createdAt)
        return date >= monthStart && date < monthEnd
      }).length
      
      monthlyData.totalActivities = monthlyData.selfAnalysis + monthlyData.esActivity + monthlyData.research
      activity.push(monthlyData)
    }
    
    return activity
  }

  const calculateProductivityMetrics = (data: any) => {
    const { selfAnalyses, esEntries, researches } = data
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    // 過去30日間の活動
    const recentSelfAnalyses = selfAnalyses.filter((item: any) => {
      const date = new Date(item.created_at || item.createdAt)
      return date >= thirtyDaysAgo
    }).length
    
    const recentESActivities = esEntries.filter((item: any) => {
      const date = new Date(item.updatedAt || item.created_at)
      return date >= thirtyDaysAgo
    }).length
    
    const recentResearch = researches.filter((item: any) => {
      const date = new Date(item.created_at || item.createdAt)
      return date >= thirtyDaysAgo
    }).length
    
    return {
      dailyAverage: Math.round((recentSelfAnalyses + recentESActivities + recentResearch) / 30 * 10) / 10,
      weeklyAverage: Math.round((recentSelfAnalyses + recentESActivities + recentResearch) / 4 * 10) / 10,
      mostActiveArea: recentSelfAnalyses >= recentESActivities && recentSelfAnalyses >= recentResearch 
        ? '自己分析' 
        : recentESActivities >= recentResearch 
          ? 'ES活動' 
          : '研究',
      consistencyScore: Math.min(Math.round((recentSelfAnalyses + recentESActivities + recentResearch) / 3 * 10), 100)
    }
  }

  // 高度な分析機能群
  const generateTimeline = (data: any) => {
    const { selfAnalyses, esEntries, researches } = data
    const events: any[] = []
    
    // 自己分析のイベント
    selfAnalyses.forEach((item: any) => {
      events.push({
        date: new Date(item.created_at || item.createdAt),
        type: 'self-analysis',
        title: item.title || '自己分析',
        description: '新しい自己分析を完了',
        icon: 'User',
        color: 'green',
        importance: 'medium'
      })
    })
    
    // ES活動のマイルストーン
    esEntries.forEach((item: any) => {
      if (item.status === 'submitted') {
        events.push({
          date: new Date(item.updatedAt || item.created_at),
          type: 'es-submitted',
          title: `${item.companyName} - ES提出`,
          description: `${item.position}のポジションに応募`,
          icon: 'FileText',
          color: 'blue',
          importance: 'high'
        })
      }
      if (item.status === 'accepted') {
        events.push({
          date: new Date(item.updatedAt || item.created_at),
          type: 'es-accepted',
          title: `${item.companyName} - 合格`,
          description: '書類選考を通過しました！',
          icon: 'Award',
          color: 'emerald',
          importance: 'very-high'
        })
      }
    })
    
    // 研究のマイルストーン
    researches.forEach((item: any) => {
      events.push({
        date: new Date(item.created_at || item.createdAt),
        type: 'research',
        title: item.title,
        description: '研究プロジェクトを開始',
        icon: 'Beaker',
        color: 'purple',
        importance: 'medium'
      })
    })
    
    // 月間の主要マイルストーン（活動量が多い月）
    const monthlyActivity = calculateMonthlyActivity(data)
    monthlyActivity.forEach((month: any) => {
      if (month.totalActivities >= 5) {
        events.push({
          date: new Date(month.month + ' 1, 2024'),
          type: 'milestone',
          title: `${month.month} - 活発な活動月`,
          description: `${month.totalActivities}件の活動を完了`,
          icon: 'Zap',
          color: 'yellow',
          importance: 'medium'
        })
      }
    })
    
    // 日付でソート（新しいものが上）
    return events.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10)
  }

  const generatePredictions = (data: any) => {
    const { selfAnalyses, esEntries, researches } = data
    const monthlyActivity = calculateMonthlyActivity(data)
    
    // 最近の活動傾向を分析
    const recentMonths = monthlyActivity.slice(-3)
    const avgMonthlyActivity = recentMonths.reduce((sum, month) => sum + month.totalActivities, 0) / recentMonths.length
    
    // ES成功率の傾向
    const submittedES = esEntries.filter((es: any) => ['submitted', 'reviewed', 'accepted', 'rejected'].includes(es.status))
    const acceptedES = esEntries.filter((es: any) => es.status === 'accepted')
    const currentSuccessRate = submittedES.length > 0 ? (acceptedES.length / submittedES.length) : 0
    
    return {
      nextMonthActivity: Math.round(avgMonthlyActivity * 1.1), // 10%の成長を想定
      goalAchievementProbability: Math.min(Math.round((avgMonthlyActivity / 5) * 100), 100), // 月5件を目標とした場合
      suggestedGoals: {
        selfAnalysis: Math.max(1, Math.round(selfAnalyses.length / 6)), // 月1件ペース
        esApplications: Math.max(3, Math.round(esEntries.length / 6 * 1.2)), // 20%増加
        research: Math.max(1, researches.length === 0 ? 1 : Math.round(researches.length / 6))
      },
      successPrediction: currentSuccessRate > 0.3 ? 'high' : currentSuccessRate > 0.1 ? 'medium' : 'low',
      timeToGoal: Math.ceil(30 / Math.max(avgMonthlyActivity, 1)) // 30件達成までの予想期間（月）
    }
  }

  const generateInsights = (data: any) => {
    const { selfAnalyses, esEntries, researches } = data
    const insights = []
    
    // パターン分析
    const weekdays = ['日', '月', '火', '水', '木', '金', '土']
    const dayActivity = weekdays.map(day => ({
      day,
      count: [...selfAnalyses, ...esEntries, ...researches].filter((item: any) => {
        const date = new Date(item.created_at || item.createdAt || item.updatedAt)
        return weekdays[date.getDay()] === day
      }).length
    }))
    
    const mostActiveDay = dayActivity.reduce((max, day) => day.count > max.count ? day : max, dayActivity[0])
    
    if (mostActiveDay.count > 0) {
      insights.push({
        type: 'pattern',
        title: '活動パターン分析',
        description: `${mostActiveDay.day}曜日が最も活発です（${mostActiveDay.count}件）`,
        recommendation: `${mostActiveDay.day}曜日のルーティンを他の曜日にも適用してみましょう`,
        priority: 'medium'
      })
    }
    
    // 活動バランス分析
    const totalActivities = selfAnalyses.length + esEntries.length + researches.length
    if (totalActivities > 0) {
      const selfAnalysisRatio = selfAnalyses.length / totalActivities
      const esRatio = esEntries.length / totalActivities
      const researchRatio = researches.length / totalActivities
      
      if (selfAnalysisRatio > 0.6) {
        insights.push({
          type: 'balance',
          title: '活動バランス',
          description: '自己分析に集中しています',
          recommendation: 'ES活動や研究活動も並行して進めることをお勧めします',
          priority: 'high'
        })
      } else if (esRatio > 0.7) {
        insights.push({
          type: 'balance',
          title: '活動バランス',
          description: 'ES活動が中心になっています',
          recommendation: '自己分析を通じて応募の質を向上させましょう',
          priority: 'medium'
        })
      }
    }
    
    // 成長加速のヒント
    const careerHealthScore = calculateCareerHealthScore(data)
    if (careerHealthScore < 60) {
      insights.push({
        type: 'growth',
        title: '成長加速のヒント',
        description: '全体的な活動量を増やすことで大きな成長が期待できます',
        recommendation: '週に2-3件の活動を目標に設定してみましょう',
        priority: 'high'
      })
    }
    
    return insights.slice(0, 3) // 最大3つの洞察を返す
  }

  // フェーズ3新機能: 競合分析・ベンチマーク
  const generateBenchmarkAnalysis = (data: any) => {
    const { selfAnalyses, esEntries, researches } = data
    const careerHealthScore = calculateCareerHealthScore(data)
    
    // 業界標準との比較（仮想的な基準値）
    const industryBenchmarks = {
      averageMonthlyActivities: 8,
      averageESSuccessRate: 25,
      averageCareerHealthScore: 65,
      averageSelfAnalysisCount: 12,
      averageResearchProjects: 3
    }
    
    const currentStats = {
      monthlyActivities: (selfAnalyses.length + esEntries.length + researches.length) / 6,
      esSuccessRate: calculateESSuccessRate(esEntries),
      careerHealthScore: careerHealthScore,
      selfAnalysisCount: selfAnalyses.length,
      researchProjects: researches.length
    }
    
    return {
      industryBenchmarks,
      currentStats,
      comparisons: {
        activityLevel: currentStats.monthlyActivities >= industryBenchmarks.averageMonthlyActivities ? 'above' : 'below',
        esPerformance: currentStats.esSuccessRate >= industryBenchmarks.averageESSuccessRate ? 'above' : 'below',
        overallHealth: currentStats.careerHealthScore >= industryBenchmarks.averageCareerHealthScore ? 'above' : 'below',
        selfAnalysisDepth: currentStats.selfAnalysisCount >= industryBenchmarks.averageSelfAnalysisCount ? 'above' : 'below',
        researchEngagement: currentStats.researchProjects >= industryBenchmarks.averageResearchProjects ? 'above' : 'below'
      }
    }
  }

  const generateAdvancedRecommendations = (data: any) => {
    const benchmarkAnalysis = generateBenchmarkAnalysis(data)
    const recommendations = []

    // パフォーマンス分析に基づく推奨
    if (benchmarkAnalysis.comparisons.activityLevel === 'below') {
      recommendations.push({
        category: 'productivity',
        title: '活動量の最適化',
        description: '業界平均を下回っています。週次目標を設定して活動量を増やしましょう。',
        actionItems: ['週次計画の導入', '日次振り返りの習慣化', '小さな成功体験の積み重ね'],
        impact: 'high',
        effort: 'medium'
      })
    }

    if (benchmarkAnalysis.comparisons.esPerformance === 'below') {
      recommendations.push({
        category: 'strategy',
        title: 'ES戦略の見直し',
        description: '応募の質を重視し、個別最適化されたアプローチを取りましょう。',
        actionItems: ['企業研究の深化', 'ES内容のパーソナライズ', 'フィードバック収集と改善'],
        impact: 'very_high',
        effort: 'high'
      })
    }

    if (benchmarkAnalysis.comparisons.selfAnalysisDepth === 'below') {
      recommendations.push({
        category: 'self_development',
        title: '自己理解の深化',
        description: 'より深い自己分析により、キャリアの方向性を明確にしましょう。',
        actionItems: ['価値観の棚卸し', '強みの具体化', 'キャリアビジョンの設定'],
        impact: 'high',
        effort: 'low'
      })
    }

    return recommendations.slice(0, 3)
  }

  const generatePersonalityInsights = (data: any) => {
    const { selfAnalyses, esEntries, researches } = data
    const monthlyActivity = calculateMonthlyActivity(data)
    
    // 活動パターンから性格特性を推測
    const traits = []
    
    // 一貫性の評価
    const activityVariance = monthlyActivity.reduce((acc, month, index, arr) => {
      if (index === 0) return 0
      return acc + Math.abs(month.totalActivities - arr[index - 1].totalActivities)
    }, 0) / (monthlyActivity.length - 1)
    
    if (activityVariance < 2) {
      traits.push({
        trait: '一貫性',
        score: 85,
        description: '継続的で安定した取り組みを維持しています',
        color: 'green'
      })
    }

    // 多様性の評価
    const diversityScore = selfAnalyses.length > 0 && esEntries.length > 0 && researches.length > 0 ? 90 : 60
    traits.push({
      trait: '多面的思考',
      score: diversityScore,
      description: diversityScore > 80 ? '複数の角度からキャリアを考えています' : '特定分野に集中しています',
      color: diversityScore > 80 ? 'blue' : 'yellow'
    })

    // 計画性の評価
    const planningScore = Math.min((integratedData.upcomingTasks.length * 20), 100)
    traits.push({
      trait: '計画性',
      score: planningScore,
      description: planningScore > 60 ? '計画的にキャリア活動を進めています' : '計画性を向上させる余地があります',
      color: planningScore > 60 ? 'green' : 'orange'
    })

    return traits
  }

  // 統合データを取得する関数
  const loadIntegratedData = async () => {
    if (!authUser) return
    
    try {
      setIsLoadingData(true)
      
      // 各サービスからデータを取得
      const [selfAnalyses, researches, allTasks] = await Promise.all([
        selfAnalysisService.getAll().catch(() => []),
        researchService.getAll(authUser.id).catch(() => []),
        taskService.getAll(authUser.id).catch(() => [])
      ])

      // 今後7日間のタスクをフィルタリング
      const today = new Date()
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      const upcomingTasks = allTasks.filter((task: any) => {
        const taskDate = new Date(task.due_date || task.dueDate)
        return taskDate >= today && taskDate <= nextWeek
      })

      // ESデータはlocalStorageから取得（既存の実装に合わせて）
      const esEntries = JSON.parse(localStorage.getItem('esEntries') || '[]')

      // 最近の活動を生成
      const recentActivities = [
        ...selfAnalyses.slice(0, 3).map((item: any) => ({
          type: 'self-analysis',
          title: item.title || '自己分析',
          date: item.created_at || item.createdAt,
          icon: 'User'
        })),
        ...esEntries.slice(0, 3).map((item: any) => ({
          type: 'es',
          title: `${item.companyName} - ${item.position}`,
          date: item.updatedAt,
          icon: 'FileText'
        })),
        ...researches.slice(0, 3).map((item: any) => ({
          type: 'research',
          title: item.title,
          date: item.created_at || item.createdAt,
          icon: 'Beaker'
        }))
      ].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)

      // 統合データを設定
      const newIntegratedData = {
        selfAnalyses,
        esEntries,
        researches,
        upcomingTasks,
        recentActivities
      }
      
      setIntegratedData(newIntegratedData)

      // 分析データを計算
      const careerHealthScore = calculateCareerHealthScore(newIntegratedData)
      const weeklyTrends = calculateWeeklyTrends(newIntegratedData)
      const esSuccessRate = calculateESSuccessRate(esEntries)
      const productivityMetrics = calculateProductivityMetrics(newIntegratedData)
      const monthlyActivity = calculateMonthlyActivity(newIntegratedData)

      setAnalyticsData({
        careerHealthScore,
        weeklyTrends,
        esSuccessRate,
        productivityMetrics,
        monthlyActivity
      })

      // 高度な分析データを計算
      const timeline = generateTimeline(newIntegratedData)
      const predictions = generatePredictions(newIntegratedData)
      const insights = generateInsights(newIntegratedData)
      const benchmarkAnalysis = generateBenchmarkAnalysis(newIntegratedData)
      const recommendations = generateAdvancedRecommendations(newIntegratedData)
      const personalityInsights = generatePersonalityInsights(newIntegratedData)
      const goalTracking: any[] = [] // 今後実装

      setAdvancedData({
        timeline,
        predictions,
        goalTracking,
        insights,
        benchmarkAnalysis,
        recommendations,
        personalityInsights
      })
    } catch (error) {
      console.error('統合データの取得に失敗:', error)
    } finally {
      setIsLoadingData(false)
    }
  }

  // 認証ユーザーが変更されたときにデータを読み込み
  useEffect(() => {
    if (authUser && !loading) {
      loadIntegratedData()
    }
  }, [authUser, loading])

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
  if (loading || isLoadingData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">ダッシュボードを読み込んでいます...</p>
        </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">自己分析</CardTitle>
                  <User className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{integratedData.selfAnalyses.length}</div>
                  <p className="text-xs text-muted-foreground">エントリー数</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">ES管理</CardTitle>
                  <FileText className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{integratedData.esEntries.length}</div>
                  <p className="text-xs text-muted-foreground">
                    提出済み: {integratedData.esEntries.filter((es: any) => es.status === 'submitted').length}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">研究</CardTitle>
                  <Beaker className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{integratedData.researches.length}</div>
                  <p className="text-xs text-muted-foreground">プロジェクト数</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">健康度スコア</CardTitle>
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.careerHealthScore}</div>
                  <p className="text-xs text-muted-foreground">/ 100 点</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">ES成功率</CardTitle>
                  <Target className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.esSuccessRate}%</div>
                  <p className="text-xs text-muted-foreground">合格率</p>
                </CardContent>
              </Card>
            </div>

            {/* キャリア進捗トラッカー & クイックアクション */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* キャリア進捗トラッカー */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      今月のキャリア活動
                    </CardTitle>
                    <CardDescription>各分野での進捗状況を確認</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">自己分析</span>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold">{integratedData.selfAnalyses.length}</span>
                          <span className="text-sm text-muted-foreground ml-1">件</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">ES作成</span>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold">{integratedData.esEntries.filter((es: any) => es.status === 'submitted').length}</span>
                          <span className="text-sm text-muted-foreground ml-1">/ {integratedData.esEntries.length} 提出</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Beaker className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium">研究進捗</span>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold">{integratedData.researches.length}</span>
                          <span className="text-sm text-muted-foreground ml-1">プロジェクト</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* クイックアクション */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      クイックアクション
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        size="sm"
                        onClick={() => window.location.href = '/es-manager'}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        新しいES作成
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        size="sm"
                        onClick={() => window.location.href = '/self-analysis'}
                      >
                        <User className="w-4 h-4 mr-2" />
                        自己分析を追加
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        size="sm"
                        onClick={() => window.location.href = '/research'}
                      >
                        <Beaker className="w-4 h-4 mr-2" />
                        研究ノート記録
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        size="sm"
                        onClick={() => window.location.href = '/calendar'}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        予定を追加
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* データ分析セクション */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 週次トレンド分析 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    週次活動トレンド
                  </CardTitle>
                  <CardDescription>過去4週間の活動推移</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingData ? (
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ) : analyticsData.weeklyTrends.length > 0 ? (
                    <div className="space-y-4">
                      {analyticsData.weeklyTrends.map((week: any, index: number) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-medium">{week.week}</span>
                            <span className="text-muted-foreground">
                              合計: {week.selfAnalysis + week.esActivity + week.research}件
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="text-center p-2 bg-green-50 rounded">
                              <div className="text-lg font-bold text-green-600">{week.selfAnalysis}</div>
                              <div className="text-xs text-green-600">自己分析</div>
                            </div>
                            <div className="text-center p-2 bg-blue-50 rounded">
                              <div className="text-lg font-bold text-blue-600">{week.esActivity}</div>
                              <div className="text-xs text-blue-600">ES活動</div>
                            </div>
                            <div className="text-center p-2 bg-purple-50 rounded">
                              <div className="text-lg font-bold text-purple-600">{week.research}</div>
                              <div className="text-xs text-purple-600">研究</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">データがありません</p>
                  )}
                </CardContent>
              </Card>

              {/* 生産性メトリクス */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    生産性メトリクス
                  </CardTitle>
                  <CardDescription>過去30日間のパフォーマンス</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingData ? (
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {analyticsData.productivityMetrics.dailyAverage || 0}
                          </div>
                          <div className="text-sm text-blue-600">日平均活動</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {analyticsData.productivityMetrics.weeklyAverage || 0}
                          </div>
                          <div className="text-sm text-green-600">週平均活動</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">最も活発な分野</span>
                          <Badge variant="outline">
                            {analyticsData.productivityMetrics.mostActiveArea || '未分析'}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">継続性スコア</span>
                            <span className="text-sm font-semibold">
                              {analyticsData.productivityMetrics.consistencyScore || 0}/100
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${analyticsData.productivityMetrics.consistencyScore || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* 月次活動推移 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  月次活動推移
                </CardTitle>
                <CardDescription>過去6ヶ月間のキャリア活動の変遷</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingData ? (
                  <div className="space-y-3">
                    <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ) : analyticsData.monthlyActivity.length > 0 ? (
                  <div className="space-y-6">
                    {/* 月次活動グラフ - 横向きバー */}
                    <div className="space-y-4">
                      {analyticsData.monthlyActivity.slice(-4).reverse().map((month: any, index: number) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-gray-700">{month.month}</span>
                            <span className="text-sm text-muted-foreground">
                              合計 {month.totalActivities}件
                            </span>
                          </div>
                          
                          {/* 積み重ねバー */}
                          <div className="relative">
                            <div className="flex h-8 bg-gray-100 rounded-lg overflow-hidden">
                              {month.selfAnalysis > 0 && (
                                <div 
                                  className="bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-center text-white text-xs font-semibold"
                                  style={{ 
                                    width: `${month.totalActivities > 0 ? (month.selfAnalysis / Math.max(month.totalActivities, 1)) * 100 : 0}%`,
                                    minWidth: month.selfAnalysis > 0 ? '20px' : '0px'
                                  }}
                                >
                                  {month.selfAnalysis > 0 && month.selfAnalysis}
                                </div>
                              )}
                              {month.esActivity > 0 && (
                                <div 
                                  className="bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center text-white text-xs font-semibold"
                                  style={{ 
                                    width: `${month.totalActivities > 0 ? (month.esActivity / Math.max(month.totalActivities, 1)) * 100 : 0}%`,
                                    minWidth: month.esActivity > 0 ? '20px' : '0px'
                                  }}
                                >
                                  {month.esActivity > 0 && month.esActivity}
                                </div>
                              )}
                              {month.research > 0 && (
                                <div 
                                  className="bg-gradient-to-r from-purple-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold"
                                  style={{ 
                                    width: `${month.totalActivities > 0 ? (month.research / Math.max(month.totalActivities, 1)) * 100 : 0}%`,
                                    minWidth: month.research > 0 ? '20px' : '0px'
                                  }}
                                >
                                  {month.research > 0 && month.research}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* 各分野の詳細 */}
                          <div className="flex justify-between items-center text-xs">
                            <div className="flex gap-4">
                              {month.selfAnalysis > 0 && (
                                <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="text-green-600">自己分析 {month.selfAnalysis}</span>
                                </div>
                              )}
                              {month.esActivity > 0 && (
                                <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span className="text-blue-600">ES {month.esActivity}</span>
                                </div>
                              )}
                              {month.research > 0 && (
                                <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                  <span className="text-purple-600">研究 {month.research}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* 統計サマリー */}
                    <div className="pt-4 border-t">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-600">
                            {analyticsData.monthlyActivity.reduce((sum: number, month: any) => sum + month.selfAnalysis, 0)}
                          </div>
                          <div className="text-xs text-green-600">総自己分析</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">
                            {analyticsData.monthlyActivity.reduce((sum: number, month: any) => sum + month.esActivity, 0)}
                          </div>
                          <div className="text-xs text-blue-600">総ES活動</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-lg font-bold text-purple-600">
                            {analyticsData.monthlyActivity.reduce((sum: number, month: any) => sum + month.research, 0)}
                          </div>
                          <div className="text-xs text-purple-600">総研究</div>
                        </div>
                      </div>
                      
                      {/* 活動トレンド指標 */}
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">活動トレンド</span>
                          <div className="flex items-center gap-2">
                            {(() => {
                              const recent = analyticsData.monthlyActivity.slice(-2)
                              if (recent.length < 2) return <Badge variant="outline">データ不足</Badge>
                              const trend = recent[1].totalActivities - recent[0].totalActivities
                              return trend > 0 ? (
                                <>
                                  <TrendingUp className="h-4 w-4 text-green-600" />
                                  <Badge className="bg-green-100 text-green-700">
                                    +{trend}件 増加
                                  </Badge>
                                </>
                              ) : trend < 0 ? (
                                <>
                                  <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
                                  <Badge className="bg-red-100 text-red-700">
                                    {trend}件 減少
                                  </Badge>
                                </>
                              ) : (
                                <Badge variant="outline">変化なし</Badge>
                              )
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">データがありません</p>
                )}
              </CardContent>
            </Card>

            {/* 高度な分析セクション */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* キャリアタイムライン */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    キャリアタイムライン
                  </CardTitle>
                  <CardDescription>あなたの成長ストーリー</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingData ? (
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ) : advancedData.timeline.length > 0 ? (
                    <div className="space-y-4">
                      {advancedData.timeline.slice(0, 6).map((event: any, index: number) => (
                        <div key={index} className="flex gap-3">
                          <div className="flex-shrink-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              event.importance === 'very-high' ? 'bg-emerald-100' :
                              event.importance === 'high' ? 'bg-blue-100' :
                              event.importance === 'medium' ? 'bg-yellow-100' : 'bg-gray-100'
                            }`}>
                              {event.icon === 'User' && <User className={`h-4 w-4 ${
                                event.importance === 'very-high' ? 'text-emerald-600' :
                                event.importance === 'high' ? 'text-blue-600' :
                                event.importance === 'medium' ? 'text-yellow-600' : 'text-gray-600'
                              }`} />}
                              {event.icon === 'FileText' && <FileText className={`h-4 w-4 ${
                                event.importance === 'very-high' ? 'text-emerald-600' :
                                event.importance === 'high' ? 'text-blue-600' :
                                event.importance === 'medium' ? 'text-yellow-600' : 'text-gray-600'
                              }`} />}
                              {event.icon === 'Beaker' && <Beaker className={`h-4 w-4 ${
                                event.importance === 'very-high' ? 'text-emerald-600' :
                                event.importance === 'high' ? 'text-blue-600' :
                                event.importance === 'medium' ? 'text-yellow-600' : 'text-gray-600'
                              }`} />}
                              {event.icon === 'Award' && <Award className={`h-4 w-4 ${
                                event.importance === 'very-high' ? 'text-emerald-600' :
                                event.importance === 'high' ? 'text-blue-600' :
                                event.importance === 'medium' ? 'text-yellow-600' : 'text-gray-600'
                              }`} />}
                              {event.icon === 'Zap' && <Zap className={`h-4 w-4 ${
                                event.importance === 'very-high' ? 'text-emerald-600' :
                                event.importance === 'high' ? 'text-blue-600' :
                                event.importance === 'medium' ? 'text-yellow-600' : 'text-gray-600'
                              }`} />}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {event.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {event.description}
                                </p>
                              </div>
                              <time className="text-xs text-gray-400 flex-shrink-0 ml-2">
                                {event.date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                              </time>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">まだ活動がありません</p>
                  )}
                </CardContent>
              </Card>

              {/* AI予測とレコメンデーション */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    AI予測 & 推奨
                  </CardTitle>
                  <CardDescription>データに基づく将来予測と提案</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingData ? (
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* 次月活動予測 */}
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">来月の活動予測</span>
                        </div>
                        <div className="text-lg font-bold text-blue-800">
                          {advancedData.predictions.nextMonthActivity || 0}件
                        </div>
                        <div className="text-xs text-blue-700">
                          目標達成確率: {advancedData.predictions.goalAchievementProbability || 0}%
                        </div>
                      </div>

                      {/* 推奨目標 */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">推奨月間目標</h4>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-center p-2 bg-green-50 rounded">
                            <div className="text-sm font-bold text-green-600">
                              {advancedData.predictions.suggestedGoals?.selfAnalysis || 1}
                            </div>
                            <div className="text-xs text-green-600">自己分析</div>
                          </div>
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <div className="text-sm font-bold text-blue-600">
                              {advancedData.predictions.suggestedGoals?.esApplications || 3}
                            </div>
                            <div className="text-xs text-blue-600">ES応募</div>
                          </div>
                          <div className="text-center p-2 bg-purple-50 rounded">
                            <div className="text-sm font-bold text-purple-600">
                              {advancedData.predictions.suggestedGoals?.research || 1}
                            </div>
                            <div className="text-xs text-purple-600">研究</div>
                          </div>
                        </div>
                      </div>

                      {/* 成功予測 */}
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">成功予測</span>
                          <Badge className={
                            advancedData.predictions.successPrediction === 'high' ? 'bg-green-100 text-green-700' :
                            advancedData.predictions.successPrediction === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }>
                            {advancedData.predictions.successPrediction === 'high' ? '高' :
                             advancedData.predictions.successPrediction === 'medium' ? '中' : '要改善'}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          目標達成まで約{advancedData.predictions.timeToGoal || 1}ヶ月
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* インサイトとパターン分析 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  深層インサイト & パターン分析
                </CardTitle>
                <CardDescription>AIが発見したあなたの活動パターンと改善提案</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingData ? (
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ) : advancedData.insights.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {advancedData.insights.map((insight: any, index: number) => (
                      <div key={index} className={`p-4 rounded-lg border ${
                        insight.priority === 'high' ? 'border-red-200 bg-red-50' :
                        insight.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                        'border-blue-200 bg-blue-50'
                      }`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            insight.priority === 'high' ? 'bg-red-100' :
                            insight.priority === 'medium' ? 'bg-yellow-100' :
                            'bg-blue-100'
                          }`}>
                            <Award className={`h-3 w-3 ${
                              insight.priority === 'high' ? 'text-red-600' :
                              insight.priority === 'medium' ? 'text-yellow-600' :
                              'text-blue-600'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-medium ${
                              insight.priority === 'high' ? 'text-red-900' :
                              insight.priority === 'medium' ? 'text-yellow-900' :
                              'text-blue-900'
                            }`}>
                              {insight.title}
                            </h4>
                            <p className={`text-xs mt-1 ${
                              insight.priority === 'high' ? 'text-red-700' :
                              insight.priority === 'medium' ? 'text-yellow-700' :
                              'text-blue-700'
                            }`}>
                              {insight.description}
                            </p>
                            <div className="mt-2 pt-2 border-t border-opacity-20">
                              <p className={`text-xs font-medium ${
                                insight.priority === 'high' ? 'text-red-800' :
                                insight.priority === 'medium' ? 'text-yellow-800' :
                                'text-blue-800'
                              }`}>
                                💡 提案: {insight.recommendation}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">
                      より多くの活動データが蓄積されると、AIがパターンを分析してインサイトを提供します
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 締切り・重要日程ウィジェット & 最近の活動 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 締切り・重要日程 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    直近の重要な予定
                  </CardTitle>
                  <CardDescription>今後7日間の予定</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingData ? (
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ) : integratedData.upcomingTasks.length > 0 ? (
                    <div className="space-y-3">
                      {integratedData.upcomingTasks.slice(0, 5).map((task: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{task.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(task.due_date || task.dueDate).toLocaleDateString('ja-JP')}
                            </p>
                          </div>
                          <Badge variant={
                            new Date(task.due_date || task.dueDate) <= new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) 
                              ? "destructive" 
                              : "secondary"
                          }>
                            {Math.ceil((new Date(task.due_date || task.dueDate).getTime() - Date.now()) / (24 * 60 * 60 * 1000))}日後
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">今後7日間に予定はありません</p>
                  )}
                </CardContent>
              </Card>

              {/* 最近の活動 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    最近の活動
                  </CardTitle>
                  <CardDescription>最新の更新情報</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingData ? (
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ) : integratedData.recentActivities.length > 0 ? (
                    <div className="space-y-3">
                      {integratedData.recentActivities.map((activity: any, index: number) => (
                        <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0">
                            {activity.icon === 'User' && <User className="h-4 w-4 text-green-600" />}
                            {activity.icon === 'FileText' && <FileText className="h-4 w-4 text-blue-600" />}
                            {activity.icon === 'Beaker' && <Beaker className="h-4 w-4 text-purple-600" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(activity.date).toLocaleDateString('ja-JP')}
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">最近の活動はありません</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* カレンダー/ToDo概要 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TodoSummary />
              </div>
              
              {/* 今週のフォーカス */}
              <div>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      今週のフォーカス
                    </CardTitle>
                    <CardDescription>最優先のタスク</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {tasks.filter(task => !task.completed).slice(0, 3).map((task, index) => (
                        <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{task.title}</span>
                            <Badge className={getPriorityColor(task.priority)}>
                              {getPriorityText(task.priority)}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                        </div>
                      ))}
                      {tasks.filter(task => !task.completed).length === 0 && (
                        <p className="text-muted-foreground text-sm">すべてのタスクが完了しています！</p>
                      )}
                    </div>
                    <div className="mt-4 pt-3 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">今週の進捗</span>
                        <span className="font-semibold">{Math.round(completionRate)}%</span>
                      </div>
                      <div className="h-2 mt-2">
                        <Progress value={completionRate} />
                      </div>
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

            {/* 成長分析とキャリアインサイト */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    キャリア健康度スコア詳細
                  </CardTitle>
                  <CardDescription>各分野での発展状況と総合評価</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* 総合スコア表示 */}
                    <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <div className="text-3xl font-bold text-gray-800">{analyticsData.careerHealthScore}</div>
                      <div className="text-sm text-gray-600">/ 100点</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {analyticsData.careerHealthScore >= 80 ? '優秀' : 
                         analyticsData.careerHealthScore >= 60 ? '良好' : 
                         analyticsData.careerHealthScore >= 40 ? '普通' : '要改善'}
                      </div>
                    </div>

                    {/* 各分野の詳細スコア */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">自己分析の深度</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 bg-green-500 rounded-full transition-all duration-300" 
                              style={{ width: `${Math.min(integratedData.selfAnalyses.length * 20, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500 w-10">{Math.min(integratedData.selfAnalyses.length * 20, 100)}%</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">ES活動量</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 bg-blue-500 rounded-full transition-all duration-300" 
                              style={{ width: `${Math.min(integratedData.esEntries.length * 10, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500 w-10">{Math.min(integratedData.esEntries.length * 10, 100)}%</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">ES成功率</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 bg-yellow-500 rounded-full transition-all duration-300" 
                              style={{ width: `${analyticsData.esSuccessRate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500 w-10">{analyticsData.esSuccessRate}%</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">研究進捗</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 bg-purple-500 rounded-full transition-all duration-300" 
                              style={{ width: `${Math.min(integratedData.researches.length * 25, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500 w-10">{Math.min(integratedData.researches.length * 25, 100)}%</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">タスク管理効率</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 bg-orange-500 rounded-full transition-all duration-300" 
                              style={{ width: `${100 - Math.min(integratedData.upcomingTasks.length * 10, 80)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500 w-10">{100 - Math.min(integratedData.upcomingTasks.length * 10, 80)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    スマートキャリア提案
                  </CardTitle>
                  <CardDescription>データ分析に基づく個人最適化された提案</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* スコアベースの動的提案 */}
                    {analyticsData.careerHealthScore < 40 && (
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="h-4 w-4 text-red-600" />
                          <p className="text-sm font-medium text-red-900">全体的な活動量を増やしましょう</p>
                        </div>
                        <p className="text-xs text-red-700">
                          すべての分野でより積極的な取り組みが必要です
                        </p>
                      </div>
                    )}

                    {integratedData.selfAnalyses.length < 3 && (
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4 text-green-600" />
                          <p className="text-sm font-medium text-green-900">自己分析を充実させましょう</p>
                        </div>
                        <p className="text-xs text-green-700">
                          目標: {3 - integratedData.selfAnalyses.length}件の追加分析でスコア向上
                        </p>
                      </div>
                    )}
                    
                    {analyticsData.esSuccessRate < 30 && integratedData.esEntries.length > 3 && (
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="h-4 w-4 text-yellow-600" />
                          <p className="text-sm font-medium text-yellow-900">ES品質の向上が必要</p>
                        </div>
                        <p className="text-xs text-yellow-700">
                          現在の成功率{analyticsData.esSuccessRate}% - 内容の見直しを推奨
                        </p>
                      </div>
                    )}
                    
                    {integratedData.researches.length === 0 && (
                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Beaker className="h-4 w-4 text-purple-600" />
                          <p className="text-sm font-medium text-purple-900">研究活動を始めてみましょう</p>
                        </div>
                        <p className="text-xs text-purple-700">
                          研究ノートで知識を体系化して競争力を高めましょう
                        </p>
                      </div>
                    )}
                    
                    {analyticsData.careerHealthScore >= 80 && (
                      <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Award className="h-4 w-4 text-emerald-600" />
                          <p className="text-sm font-medium text-emerald-900">素晴らしい進捗です！</p>
                        </div>
                        <p className="text-xs text-emerald-700">
                          このペースを維持して、さらなる成長を目指しましょう
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* フェーズ3: 高度分析・ベンチマーク・個性診断 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 業界ベンチマーク分析 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    業界ベンチマーク
                  </CardTitle>
                  <CardDescription>同世代との比較分析</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingData ? (
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* 全体的なパフォーマンス */}
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
                        <div className="text-sm font-medium text-indigo-900 mb-2">総合評価</div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-indigo-700">業界平均比</span>
                          <Badge className={
                            advancedData.benchmarkAnalysis.comparisons?.overallHealth === 'above' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }>
                            {advancedData.benchmarkAnalysis.comparisons?.overallHealth === 'above' ? '平均以上' : '要改善'}
                          </Badge>
                        </div>
                      </div>

                      {/* 個別指標 */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">月間活動量</span>
                          <div className="flex items-center gap-2">
                            <div className="text-xs font-medium">
                              {Math.round(advancedData.benchmarkAnalysis.currentStats?.monthlyActivities || 0)}件
                            </div>
                            <Badge className={
                              advancedData.benchmarkAnalysis.comparisons?.activityLevel === 'above'
                                ? 'bg-green-100 text-green-600 text-xs' 
                                : 'bg-red-100 text-red-600 text-xs'
                            }>
                              {advancedData.benchmarkAnalysis.comparisons?.activityLevel === 'above' ? '↑' : '↓'}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">ES成功率</span>
                          <div className="flex items-center gap-2">
                            <div className="text-xs font-medium">
                              {advancedData.benchmarkAnalysis.currentStats?.esSuccessRate || 0}%
                            </div>
                            <Badge className={
                              advancedData.benchmarkAnalysis.comparisons?.esPerformance === 'above'
                                ? 'bg-green-100 text-green-600 text-xs' 
                                : 'bg-red-100 text-red-600 text-xs'
                            }>
                              {advancedData.benchmarkAnalysis.comparisons?.esPerformance === 'above' ? '↑' : '↓'}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">自己分析深度</span>
                          <div className="flex items-center gap-2">
                            <div className="text-xs font-medium">
                              {advancedData.benchmarkAnalysis.currentStats?.selfAnalysisCount || 0}件
                            </div>
                            <Badge className={
                              advancedData.benchmarkAnalysis.comparisons?.selfAnalysisDepth === 'above'
                                ? 'bg-green-100 text-green-600 text-xs' 
                                : 'bg-red-100 text-red-600 text-xs'
                            }>
                              {advancedData.benchmarkAnalysis.comparisons?.selfAnalysisDepth === 'above' ? '↑' : '↓'}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* 改善提案 */}
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs font-medium text-gray-700 mb-1">次のステップ</div>
                        <div className="text-xs text-gray-600">
                          {advancedData.benchmarkAnalysis.comparisons?.overallHealth === 'above' 
                            ? '現在のパフォーマンスを維持し、さらなる成長を目指しましょう'
                            : '重点分野を特定して集中的に改善しましょう'}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* AI高度推奨システム */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI高度推奨
                  </CardTitle>
                  <CardDescription>データサイエンスに基づく個別最適化</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingData ? (
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ) : advancedData.recommendations.length > 0 ? (
                    <div className="space-y-4">
                      {advancedData.recommendations.map((rec: any, index: number) => (
                        <div key={index} className={`p-3 rounded-lg border ${
                          rec.impact === 'very_high' ? 'border-red-200 bg-red-50' :
                          rec.impact === 'high' ? 'border-orange-200 bg-orange-50' :
                          'border-blue-200 bg-blue-50'
                        }`}>
                          <div className="flex items-start justify-between mb-2">
                            <h4 className={`text-sm font-medium ${
                              rec.impact === 'very_high' ? 'text-red-900' :
                              rec.impact === 'high' ? 'text-orange-900' :
                              'text-blue-900'
                            }`}>
                              {rec.title}
                            </h4>
                            <Badge className={
                              rec.impact === 'very_high' ? 'bg-red-100 text-red-700' :
                              rec.impact === 'high' ? 'bg-orange-100 text-orange-700' :
                              'bg-blue-100 text-blue-700'
                            }>
                              {rec.impact === 'very_high' ? '最重要' :
                               rec.impact === 'high' ? '重要' : '推奨'}
                            </Badge>
                          </div>
                          <p className={`text-xs mb-2 ${
                            rec.impact === 'very_high' ? 'text-red-700' :
                            rec.impact === 'high' ? 'text-orange-700' :
                            'text-blue-700'
                          }`}>
                            {rec.description}
                          </p>
                          <div className="space-y-1">
                            {rec.actionItems.map((item: string, itemIndex: number) => (
                              <div key={itemIndex} className="flex items-center gap-2">
                                <CheckSquare className={`h-3 w-3 ${
                                  rec.impact === 'very_high' ? 'text-red-500' :
                                  rec.impact === 'high' ? 'text-orange-500' :
                                  'text-blue-500'
                                }`} />
                                <span className={`text-xs ${
                                  rec.impact === 'very_high' ? 'text-red-600' :
                                  rec.impact === 'high' ? 'text-orange-600' :
                                  'text-blue-600'
                                }`}>
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Brain className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">データ分析中...</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 個性・行動パターン分析 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    個性分析
                  </CardTitle>
                  <CardDescription>行動データから読み取る特性</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingData ? (
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ) : advancedData.personalityInsights.length > 0 ? (
                    <div className="space-y-4">
                      {advancedData.personalityInsights.map((trait: any, index: number) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">{trait.trait}</span>
                            <Badge className={`text-xs ${
                              trait.color === 'green' ? 'bg-green-100 text-green-700' :
                              trait.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                              trait.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {trait.score}%
                            </Badge>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                trait.color === 'green' ? 'bg-green-500' :
                                trait.color === 'blue' ? 'bg-blue-500' :
                                trait.color === 'yellow' ? 'bg-yellow-500' :
                                'bg-gray-500'
                              }`}
                              style={{ width: `${trait.score}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-600">{trait.description}</p>
                        </div>
                      ))}

                      {/* 総合スコア */}
                      <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 mt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-900">総合キャリア適性</span>
                        </div>
                        <div className="text-lg font-bold text-purple-800">
                          {Math.round(advancedData.personalityInsights.reduce((sum: number, trait: any) => sum + trait.score, 0) / advancedData.personalityInsights.length)}%
                        </div>
                        <div className="text-xs text-purple-700">
                          バランスの取れたキャリア発展を示しています
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Eye className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">分析データが不足しています</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* 高度な目標追跡 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  スマート目標設定 & 追跡
                </CardTitle>
                <CardDescription>短期・中期・長期目標の詳細管理</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* 短期目標（1ヶ月） */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      1ヶ月目標
                    </h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-blue-800">ES応募</span>
                          <Badge variant="outline" className="text-blue-600">
                            {integratedData.esEntries.filter((es: any) => es.status === 'submitted').length} / {advancedData.predictions.suggestedGoals?.esApplications || 3}
                          </Badge>
                        </div>
                        <div className="w-full bg-blue-100 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                            style={{ 
                              width: `${Math.min((integratedData.esEntries.filter((es: any) => es.status === 'submitted').length / (advancedData.predictions.suggestedGoals?.esApplications || 3)) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-blue-700 mt-1">
                          {integratedData.esEntries.filter((es: any) => es.status === 'submitted').length >= (advancedData.predictions.suggestedGoals?.esApplications || 3) 
                            ? '目標達成！' 
                            : `あと${(advancedData.predictions.suggestedGoals?.esApplications || 3) - integratedData.esEntries.filter((es: any) => es.status === 'submitted').length}件`}
                        </p>
                      </div>

                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-purple-800">研究活動</span>
                          <Badge variant="outline" className="text-purple-600">
                            {integratedData.researches.length} / {advancedData.predictions.suggestedGoals?.research || 1}
                          </Badge>
                        </div>
                        <div className="w-full bg-purple-100 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full transition-all duration-300" 
                            style={{ 
                              width: `${Math.min((integratedData.researches.length / (advancedData.predictions.suggestedGoals?.research || 1)) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-purple-700 mt-1">
                          {integratedData.researches.length >= (advancedData.predictions.suggestedGoals?.research || 1) 
                            ? '目標達成！' 
                            : `あと${(advancedData.predictions.suggestedGoals?.research || 1) - integratedData.researches.length}件`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 中期目標（3ヶ月） */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      3ヶ月目標
                    </h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-700 mb-2">総活動数</div>
                        <div className="text-2xl font-bold text-gray-800">
                          {integratedData.selfAnalyses.length + integratedData.esEntries.length + integratedData.researches.length}
                        </div>
                        <div className="text-xs text-gray-600">
                          目標: {(advancedData.predictions.suggestedGoals?.selfAnalysis || 1) * 3 + 
                                  (advancedData.predictions.suggestedGoals?.esApplications || 3) * 3 + 
                                  (advancedData.predictions.suggestedGoals?.research || 1) * 3}件
                        </div>
                      </div>

                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="text-sm font-medium text-yellow-800 mb-1">ES成功率向上</div>
                        <div className="text-lg font-bold text-yellow-700">
                          現在 {analyticsData.esSuccessRate}%
                        </div>
                        <div className="text-xs text-yellow-600">
                          目標: {Math.min(analyticsData.esSuccessRate + 10, 100)}%
                        </div>
                      </div>

                      <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                        <div className="text-sm font-medium text-indigo-800 mb-1">キャリア健康度</div>
                        <div className="text-lg font-bold text-indigo-700">
                          現在 {analyticsData.careerHealthScore}点
                        </div>
                        <div className="text-xs text-indigo-600">
                          目標: {Math.min(analyticsData.careerHealthScore + 15, 100)}点
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 長期目標（6ヶ月） */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <Target className="h-4 w-4 text-green-500" />
                      6ヶ月ビジョン
                    </h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
                        <div className="text-sm font-medium text-gray-800 mb-2">理想的なキャリア状態</div>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>✓ 深い自己理解の確立</li>
                          <li>✓ 複数の内定・オファー獲得</li>
                          <li>✓ 専門分野での研究成果</li>
                          <li>✓ 継続的な成長習慣の定着</li>
                        </ul>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-emerald-50 rounded text-center">
                          <div className="text-sm font-bold text-emerald-600">95+</div>
                          <div className="text-xs text-emerald-600">健康度スコア</div>
                        </div>
                        <div className="p-2 bg-cyan-50 rounded text-center">
                          <div className="text-sm font-bold text-cyan-600">50%+</div>
                          <div className="text-xs text-cyan-600">ES成功率</div>
                        </div>
                      </div>

                      <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="text-sm font-medium text-amber-800 mb-1">マイルストーン予測</div>
                        <div className="text-xs text-amber-700">
                          現在のペースで約{advancedData.predictions.timeToGoal || 1}ヶ月で主要目標達成予定
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
