"use client"

import { useState, useEffect } from "react"
import { CustomCalendar } from "@/components/ui/custom-calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, Clock, Plus, Edit, Trash2, Bell } from "lucide-react"
import { format, isToday, isTomorrow, isThisWeek, isPast, differenceInDays } from "date-fns"
import Header from "@/components/layout/Header"
import Sidebar from "@/components/layout/Sidebar"
import { useAuth } from "@/components/providers/AuthProvider"
import { useSidebar } from "@/components/providers/SidebarProvider"

//トースト用のカスタムフック
const useToast = () => {
  const toast = ({ title, description, variant }: { title?: string; description?: string; variant?: "default" | "destructive" }) => {
    alert(`${title}: ${description}`)
  }
  return { toast }
}

interface Task {
  id: string
  title: string
  description: string
  dueDate: Date
  completed: boolean
  priority: "low" | "medium" | "high"
  createdAt: Date
}

interface User {
  name: string
  email: string
}

export default function TodoCalendarApp() {
  const { user: authUser, loading } = useAuth()
  const { sidebarOpen, setSidebarOpen, toggleSidebar } = useSidebar()
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [newTask, setNewTask] = useState<{
    title: string
    description: string
    dueDate: Date
    priority: "low" | "medium" | "high"
  }>({
    title: "",
    description: "",
    dueDate: new Date(),
    priority: "medium",
  })
  const { toast } = useToast()

  // Supabaseの認証ユーザー情報から名前とメールを取得
  const user = authUser ? {
    name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || "ユーザー",
    email: authUser.email || ""
  } : {
    name: "ゲスト",
    email: ""
  }

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("calendar-tasks")
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        dueDate: new Date(task.dueDate),
        createdAt: new Date(task.createdAt),
      }))
      setTasks(parsedTasks)
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("calendar-tasks", JSON.stringify(tasks))
  }, [tasks])

  const addTask = () => {
    if (newTask.title.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        dueDate: newTask.dueDate,
        completed: false,
        priority: newTask.priority,
        createdAt: new Date(),
      }
      setTasks([...tasks, task])
      setNewTask({
        title: "",
        description: "",
        dueDate: new Date(),
        priority: "medium",
      })
      setIsDialogOpen(false)
      
      toast({
        title: "タスク作成完了",
        description: "新しいタスクが追加されました。",
      })
    }
  }

  const updateTask = () => {
    if (editingTask && newTask.title.trim()) {
      setTasks(tasks.map((task) => (task.id === editingTask.id ? { ...task, ...newTask } : task)))
      setEditingTask(null)
      setNewTask({
        title: "",
        description: "",
        dueDate: new Date(),
        priority: "medium",
      })
      setIsDialogOpen(false)
      
      toast({
        title: "タスク更新完了",
        description: "タスクが更新されました。",
      })
    }
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
    
    toast({
      title: "タスク削除完了",
      description: "タスクが削除されました。",
    })
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const openEditDialog = (task: Task) => {
    setEditingTask(task)
    setNewTask({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
    })
    setIsDialogOpen(true)
  }

  const resetDialog = () => {
    setEditingTask(null)
    setNewTask({
      title: "",
      description: "",
      dueDate: new Date(),
      priority: "medium",
    })
  }

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => format(task.dueDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd"))
  }

  const getTodayTasks = () => {
    return tasks.filter((task) => isToday(task.dueDate))
  }

  const getUpcomingTasks = () => {
    return tasks
      .filter(
        (task) => !task.completed && (isToday(task.dueDate) || isTomorrow(task.dueDate) || isThisWeek(task.dueDate)),
      )
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
  }

  const getOverdueTasks = () => {
    return tasks.filter((task) => !task.completed && isPast(task.dueDate) && !isToday(task.dueDate))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTaskUrgency = (dueDate: Date) => {
    const days = differenceInDays(dueDate, new Date())
    if (days < 0) return "overdue"
    if (days === 0) return "today"
    if (days === 1) return "tomorrow"
    if (days <= 7) return "this-week"
    return "future"
  }

  const TaskCard = ({ task }: { task: Task }) => {
    const urgency = getTaskUrgency(task.dueDate)

    return (
      <Card className={`mb-3 ${task.completed ? "opacity-60" : ""} ${urgency === "overdue" ? "border-red-300" : ""}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} className="mt-1" />
              <div className="flex-1">
                <h3 className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                  {task.title}
                </h3>
                {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    <CalendarDays className="w-3 h-3 mr-1" />
                    {format(task.dueDate, "MMM dd, yyyy")}
                  </Badge>
                  <Badge className={`text-xs ${getPriorityColor(task.priority)} text-white`}>{task.priority}</Badge>
                  {urgency === "overdue" && (
                    <Badge variant="destructive" className="text-xs">
                      <Bell className="w-3 h-3 mr-1" />
                      期限切れ
                    </Badge>
                  )}
                  {urgency === "today" && (
                    <Badge className="text-xs bg-blue-500 text-white">
                      <Clock className="w-3 h-3 mr-1" />
                      今日が期限
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex space-x-1">
              <Button variant="ghost" size="sm" onClick={() => openEditDialog(task)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
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
          <p className="text-gray-600 mb-4">カレンダーページを表示するにはログインしてください。</p>
          <Button onClick={() => window.location.href = '/'}>
            ホームに戻る
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header user={user} onMenuClick={toggleSidebar} />
      <Sidebar user={user} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className={`min-h-screen bg-gray-50 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="p-4 pt-20">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">カレンダー & タスク管理</h1>
              <p className="text-gray-600">カレンダー統合とリマインダー機能でタスクを管理しましょう</p>
            </div>

            {/* Reminders Section */}
            {(getOverdueTasks().length > 0 || getTodayTasks().filter((t) => !t.completed).length > 0) && (
              <Card className="mb-6 border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-800">
                    <Bell className="w-5 h-5 mr-2" />
                    リマインダー
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {getOverdueTasks().length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-red-700 mb-2">期限切れタスク ({getOverdueTasks().length})</h4>
                      <div className="space-y-2">
                        {getOverdueTasks()
                          .slice(0, 3)
                          .map((task) => (
                            <div key={task.id} className="text-sm">
                              <span className="font-medium">{task.title}</span>
                              <span className="text-muted-foreground ml-2">(期限 {format(task.dueDate, "MM月dd日")})</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                  {getTodayTasks().filter((t) => !t.completed).length > 0 && (
                    <div>
                      <h4 className="font-medium text-blue-700 mb-2">
                        今日が期限 ({getTodayTasks().filter((t) => !t.completed).length})
                      </h4>
                      <div className="space-y-2">
                        {getTodayTasks()
                          .filter((t) => !t.completed)
                          .slice(0, 3)
                          .map((task) => (
                            <div key={task.id} className="text-sm">
                              <span className="font-medium">{task.title}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar Section */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>カレンダー</CardTitle>
                  <CardDescription>日付を選択してタスクを表示</CardDescription>
                </CardHeader>
                <CardContent>
                  <CustomCalendar
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    modifiers={{
                      hasTask: (date: Date) => getTasksForDate(date).length > 0,
                    }}
                  />

                  {selectedDate && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">{format(selectedDate, "yyyy年MM月dd日")} のタスク</h4>
                      {getTasksForDate(selectedDate).length === 0 ? (
                        <p className="text-sm text-muted-foreground">この日のタスクはありません</p>
                      ) : (
                        <div className="space-y-2">
                          {getTasksForDate(selectedDate).map((task) => (
                            <div key={task.id} className="text-sm p-2 bg-muted rounded">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={task.completed}
                                  onCheckedChange={() => toggleTask(task.id)}
                                  className="h-3 w-3"
                                />
                                <span className={task.completed ? "line-through" : ""}>{task.title}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tasks Section */}
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">タスク</h2>
                  <Dialog
                    open={isDialogOpen}
                    onOpenChange={(open) => {
                      setIsDialogOpen(open)
                      if (!open) resetDialog()
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        タスク追加
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingTask ? "タスク編集" : "新しいタスク"}</DialogTitle>
                        <DialogDescription>
                          {editingTask ? "タスクの詳細を更新してください" : "期限と優先度を設定して新しいタスクを作成してください"}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="title">タイトル</Label>
                          <Input
                            id="title"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            placeholder="タスクのタイトルを入力"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">説明</Label>
                          <Textarea
                            id="description"
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                            placeholder="タスクの説明を入力（任意）"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="dueDate">期限</Label>
                          <Input
                            id="dueDate"
                            type="date"
                            value={format(newTask.dueDate, "yyyy-MM-dd")}
                            onChange={(e) => setNewTask({ ...newTask, dueDate: new Date(e.target.value) })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="priority">優先度</Label>
                          <Select
                            value={newTask.priority}
                            onValueChange={(value: "low" | "medium" | "high") => setNewTask({ ...newTask, priority: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">低</SelectItem>
                              <SelectItem value="medium">中</SelectItem>
                              <SelectItem value="high">高</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={editingTask ? updateTask : addTask}>
                          {editingTask ? "タスク更新" : "タスク追加"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <Tabs defaultValue="upcoming" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="upcoming">近日予定</TabsTrigger>
                    <TabsTrigger value="today">今日</TabsTrigger>
                    <TabsTrigger value="all">すべて</TabsTrigger>
                    <TabsTrigger value="completed">完了済み</TabsTrigger>
                  </TabsList>

                  <TabsContent value="upcoming" className="mt-4">
                    <div className="space-y-4">
                      {getUpcomingTasks().length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">近日予定のタスクはありません</p>
                      ) : (
                        getUpcomingTasks().map((task) => <TaskCard key={task.id} task={task} />)
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="today" className="mt-4">
                    <div className="space-y-4">
                      {getTodayTasks().length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">今日期限のタスクはありません</p>
                      ) : (
                        getTodayTasks().map((task) => <TaskCard key={task.id} task={task} />)
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="all" className="mt-4">
                    <div className="space-y-4">
                      {tasks.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">まだタスクがありません。最初のタスクを作成しましょう！</p>
                      ) : (
                        tasks
                          .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
                          .map((task) => <TaskCard key={task.id} task={task} />)
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="completed" className="mt-4">
                    <div className="space-y-4">
                      {tasks.filter((task) => task.completed).length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">完了したタスクはありません</p>
                      ) : (
                        tasks
                          .filter((task) => task.completed)
                          .sort((a, b) => b.dueDate.getTime() - a.dueDate.getTime())
                          .map((task) => <TaskCard key={task.id} task={task} />)
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
