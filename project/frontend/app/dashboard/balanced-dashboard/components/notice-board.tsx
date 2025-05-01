import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type NoticeItem = {
  id: string
  title: string
  date: string
  isImportant: boolean
  category: string
}

interface NoticeBoardProps {
  notices: NoticeItem[]
}

export function NoticeBoard({ notices }: NoticeBoardProps) {
  return (
    <Card className="h-full border border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex justify-between items-center">
          <span>공지사항</span>
          <Link href="#" className="text-xs text-gray-500 hover:text-gray-800">
            모두 보기
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notices.map((notice) => (
            <div key={notice.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <div className="flex items-center gap-2 mb-1">
                {notice.isImportant && (
                  <Badge variant="destructive" className="text-[10px] h-5">
                    중요
                  </Badge>
                )}
                <Badge variant="outline" className="text-[10px] h-5 border-gray-200 text-gray-600">
                  {notice.category}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <Link href="#" className="text-sm font-medium hover:text-blue-600">
                  {notice.title}
                </Link>
                <span className="text-xs text-gray-400">{notice.date}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
