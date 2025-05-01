import { ExternalLink, Calendar } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type TodoItem = {
  id: string
  title: string
  category: string
  link: string
  dueDate?: string
  priority: "high" | "medium" | "low"
}

interface TodoListProps {
  todos: TodoItem[]
}

export function TodoList({ todos }: TodoListProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-600 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-600 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-600 border-green-200"
      default:
        return "bg-gray-100 text-gray-600 border-gray-200"
    }
  }

  return (
    <Card className="h-full border border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex justify-between items-center">
          <span>오늘의 할 일</span>
          <Link href="#" className="text-xs text-gray-500 hover:text-gray-800">
            모두 보기
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`text-[10px] h-5 ${getPriorityColor(todo.priority)}`}>
                    {todo.priority === "high" ? "높음" : todo.priority === "medium" ? "중간" : "낮음"}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] h-5 border-gray-200 text-gray-600">
                    {todo.category}
                  </Badge>
                </div>
                <p className="text-sm font-medium">{todo.title}</p>
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                  <span className="text-xs text-gray-500">{todo.dueDate || "미정"}</span>
                </div>
              </div>
              <Link
                href={todo.link}
                className="inline-flex items-center justify-center rounded-md w-7 h-7 bg-gray-100 hover:bg-gray-200 mt-1"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="sr-only">링크 열기</span>
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
