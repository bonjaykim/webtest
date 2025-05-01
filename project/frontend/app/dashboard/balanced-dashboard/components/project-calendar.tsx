import { ChevronLeft, ChevronRight, Clock } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type CalendarEvent = {
  id: string
  title: string
  date: string
  time: string
  type: "meeting" | "deadline" | "milestone"
  project: string
}

interface ProjectCalendarProps {
  events: CalendarEvent[]
  currentWeek: string
}

export function ProjectCalendar({ events, currentWeek }: ProjectCalendarProps) {
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-600 border-blue-200"
      case "deadline":
        return "bg-red-100 text-red-600 border-red-200"
      case "milestone":
        return "bg-green-100 text-green-600 border-green-200"
      default:
        return "bg-gray-100 text-gray-600 border-gray-200"
    }
  }

  // 요일 배열
  const weekdays = ["월", "화", "수", "목", "금", "토", "일"]

  return (
    <Card className="h-full border border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">프로젝트 일정</CardTitle>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">이전 주</span>
            </Button>
            <span className="text-sm">{currentWeek}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">다음 주</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-3">
          {weekdays.map((day) => (
            <div key={day} className="text-center text-xs font-medium py-1 text-gray-500">
              {day}
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {events.map((event) => (
            <Link href="#" key={event.id}>
              <div className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <Badge variant="outline" className={`${getEventTypeColor(event.type)}`}>
                      {event.type === "meeting" ? "회의" : event.type === "deadline" ? "마감일" : "마일스톤"}
                    </Badge>
                    <Badge variant="outline" className="ml-1 border-gray-200 text-gray-600">
                      {event.project}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-400">{event.date}</div>
                </div>
                <h4 className="text-sm font-medium mb-1">{event.title}</h4>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1 text-gray-400" />
                  <span className="text-xs text-gray-500">{event.time}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
