import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  FolderTree,
  LayoutDashboard
} from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">My shadcn/ui Demo</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-primary" />
              <CardTitle>대시보드</CardTitle>
            </div>
            <CardDescription>다양한 대시보드 예제</CardDescription>
          </CardHeader>
          <CardContent>
            <p>팀, 데이터 대시보드 등 다양한 예제 제공</p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard">
              <Button>대시보드 보기</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Table className="h-5 w-5 text-primary" />
              <CardTitle>프로젝트 테이블</CardTitle>
            </div>
            <CardDescription>프로젝트 관리 테이블</CardDescription>
          </CardHeader>
          <CardContent>
            <p>프로젝트 목록 및 상세 정보 보기</p>
          </CardContent>
          <CardFooter>
            <Link href="/demo/view">
              <Button>프로젝트 테이블 보기</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FolderTree className="h-5 w-5 text-primary" />
              <CardTitle>트리 테이블</CardTitle>
            </div>
            <CardDescription>트리 형태의 테이블 구조</CardDescription>
          </CardHeader>
          <CardContent>
            <p>계층 구조로 정리된 데이터 테이블</p>
          </CardContent>
          <CardFooter>
            <Link href="/table/tree-table">
              <Button>트리 테이블 보기</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}