"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarDays, Clock, Bell, ChevronRight } from "lucide-react"
import { format, isToday, isPast } from "date-fns"
import Link from "next/link"

interface Task {
  id: string
  title: string
  description: string
  dueDate: Date
  completed: boolean
  priority: "low" | "medium" | "high"
  createdAt: Date
}

export default function TodoSummary() {
  const [tasks, setTasks] = useState<Task[]>([])

  // Load tasks from localStorage
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

  const toggleTask = (id: string) => {
    const updatedTasks = tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    setTasks(updatedTasks)
    localStorage.setItem("calendar-tasks", JSON.stringify(updatedTasks))
  }

  const getTodayTasks = () => {
    return tasks.filter((task) => !task.completed && isToday(task.dueDate))
  }

  const getOverdueTasks = () => {
    return tasks.filter((task) => !task.completed && isPast(task.dueDate) && !isToday(task.dueDate))
  }

  const getUpcomingTasks = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return tasks
      .filter((task) => !task.completed && task.dueDate > today)
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
      .slice(0, 3)
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

  const totalTasks = tasks.filter(task => !task.completed).length
  const todayTasks = getTodayTasks()
  const overdueTasks = getOverdueTasks()
  const upcomingTasks = getUpcomingTasks()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              タスク概要
            </CardTitle>
            <CardDescription>
              {totalTasks > 0 ? `${totalTasks}件の未完了タスクがあります` : "すべてのタスクが完了しています！"}
            </CardDescription>
          </div>
          <Link href="/calendar">
            <Button variant="outline" size="sm">
              すべて見る
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {totalTasks === 0 ? (
          <div className="text-center py-6">
            <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">タスクがありません</p>
            <Link href="/calendar">
              <Button variant="link" className="mt-2">
                新しいタスクを作成
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 期限切れタスクの警告 */}
            {overdueTasks.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-red-700 mb-2">
                  <Bell className="w-4 h-4" />
                  <span className="font-medium">期限切れタスク ({overdueTasks.length}件)</span>
                </div>
                <div className="space-y-1">
                  {overdueTasks.slice(0, 2).map((task) => (
                    <div key={task.id} className="text-sm text-red-600">
                      • {task.title}
                    </div>
                  ))}
                  {overdueTasks.length > 2 && (
                    <div className="text-sm text-red-600">
                      ...他 {overdueTasks.length - 2} 件
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 今日のタスク */}
            {todayTasks.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-blue-700 mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">今日が期限 ({todayTasks.length}件)</span>
                </div>
                <div className="space-y-2">
                  {todayTasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task.id)}
                        className="h-3 w-3"
                      />
                      <span className={task.completed ? "line-through text-gray-500" : ""}>
                        {task.title}
                      </span>
                      <Badge className={`text-xs ${getPriorityColor(task.priority)} text-white ml-auto`}>
                        {task.priority === "high" ? "高" : task.priority === "medium" ? "中" : "低"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 近日予定のタスク */}
            {upcomingTasks.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">近日予定</h4>
                <div className="space-y-2">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task.id)}
                        className="h-3 w-3"
                      />
                      <div className="flex-1">
                        <span className={task.completed ? "line-through text-gray-500" : ""}>
                          {task.title}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          期限: {format(task.dueDate, "MM月dd日")}
                        </div>
                      </div>
                      <Badge className={`text-xs ${getPriorityColor(task.priority)} text-white`}>
                        {task.priority === "high" ? "高" : task.priority === "medium" ? "中" : "低"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 統計情報 */}
            <div className="grid grid-cols-3 gap-4 pt-3 border-t">
              <div className="text-center">
                <div className="text-lg font-semibold text-red-600">{overdueTasks.length}</div>
                <div className="text-xs text-gray-500">期限切れ</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">{todayTasks.length}</div>
                <div className="text-xs text-gray-500">今日期限</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">{upcomingTasks.length}</div>
                <div className="text-xs text-gray-500">近日予定</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
