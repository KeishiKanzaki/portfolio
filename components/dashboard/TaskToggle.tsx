"use client";

import { useState, useTransition } from "react";
import { CheckCircle } from "lucide-react";
import { updateTaskStatus } from "@/app/dashboard/actions";

interface Task {
  id: string;
  task: string;
  completed: boolean;
  due_date?: string;
}

interface TaskToggleProps {
  task: Task;
}

export default function TaskToggle({ task }: TaskToggleProps) {
  const [completed, setCompleted] = useState(task.completed);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const newCompleted = !completed;
    setCompleted(newCompleted);
    
    startTransition(async () => {
      const result = await updateTaskStatus(task.id, newCompleted);
      if (!result.success) {
        // エラーが発生した場合は元の状態に戻す
        setCompleted(completed);
        console.error('タスクの更新に失敗しました:', result.error);
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`w-5 h-5 ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <CheckCircle 
        className={`w-5 h-5 ${completed ? "text-green-500" : "text-gray-300"}`} 
      />
    </button>
  );
}
