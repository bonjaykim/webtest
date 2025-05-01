import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full mx-auto">
        <h1 className="text-3xl font-bold mb-2">대시보드 데모</h1>
        <p className="text-muted-foreground mb-8">다양한 스타일의 대시보드 데모입니다.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>팀 대시보드</CardTitle>
              <CardDescription>경계가 명확하면서도 과하지 않은 디자인</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
                <span className="text-muted-foreground">팀 대시보드 미리보기</span>
              </div>
            </CardContent>
            <CardFooter>
              <Link
                href="/dashboard/balanced-dashboard"
                className="w-full inline-flex h-10 items-center justify-center rounded-md bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800"
              >
                데모 보기 <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>데이터 대시보드</CardTitle>
              <CardDescription>카드와 테이블 형태로 데이터를 시각화</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
                <span className="text-muted-foreground">데이터 대시보드 미리보기</span>
              </div>
            </CardContent>
            <CardFooter>
              <Link
                href="/dashboard/data-dashboard"
                className="w-full inline-flex h-10 items-center justify-center rounded-md bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800"
              >
                데모 보기 <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
