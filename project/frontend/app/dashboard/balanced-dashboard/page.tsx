"use client"

import { NoticeBoard } from "../balanced-dashboard/components/notice-board"
import { ProjectCalendar } from "../balanced-dashboard/components/project-calendar"
import { TodoList } from "../balanced-dashboard/components/todo-list"

export default function BalancedDashboard() {
  // 샘플 데이터
  const notices = [
    { id: "1", title: "2024년 2분기 프로젝트 계획 발표", date: "2024-04-15", isImportant: true, category: "공지" },
    { id: "2", title: "신규 팀원 소개", date: "2024-04-10", isImportant: false, category: "인사" },
    { id: "3", title: "월간 회의 일정 변경 안내", date: "2024-04-08", isImportant: true, category: "일정" },
    { id: "4", title: "신규 프로젝트 킥오프 미팅", date: "2024-04-05", isImportant: false, category: "프로젝트" },
  ]

  const todos = [
    {
      id: "1",
      title: "UI 디자인 검토",
      category: "디자인",
      link: "#",
      dueDate: "2024-04-20",
      priority: "high" as const,
    },
    {
      id: "2",
      title: "주간 보고서 작성",
      category: "문서",
      link: "#",
      dueDate: "2024-04-18",
      priority: "medium" as const,
    },
    {
      id: "3",
      title: "API 엔드포인트 테스트",
      category: "개발",
      link: "#",
      dueDate: "2024-04-22",
      priority: "high" as const,
    },
    {
      id: "4",
      title: "팀 미팅 준비",
      category: "회의",
      link: "#",
      priority: "low" as const,
    },
  ]

  const events = [
    {
      id: "1",
      title: "디자인 리뷰 미팅",
      date: "2024-04-16",
      time: "14:00-15:30",
      type: "meeting" as const,
      project: "웹 리뉴얼",
    },
    {
      id: "2",
      title: "프론트엔드 개발 완료",
      date: "2024-04-18",
      time: "18:00",
      type: "deadline" as const,
      project: "모바일 앱",
    },
    {
      id: "3",
      title: "베타 버전 출시",
      date: "2024-04-20",
      time: "10:00",
      type: "milestone" as const,
      project: "웹 리뉴얼",
    },
    {
      id: "4",
      title: "주간 팀 미팅",
      date: "2024-04-17",
      time: "09:30-11:00",
      type: "meeting" as const,
      project: "전체",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="w-full mx-auto">
        <h1 className="text-2xl font-bold mb-6">팀 대시보드</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* 첫 번째 컬럼 - 공지사항 */}
          <div className="sm:col-span-1 lg:col-span-1 order-1">
            <NoticeBoard notices={notices} />
          </div>

          {/* 두 번째 컬럼 - 오늘의 할일 */}
          <div className="sm:col-span-1 lg:col-span-1 order-3 sm:order-2">
            <TodoList todos={todos} />
          </div>

          {/* 세 번째 컬럼 - 프로젝트 캘린더 (화면의 절반 차지) */}
          <div className="sm:col-span-2 lg:col-span-2 order-2 sm:order-3">
            <ProjectCalendar events={events} currentWeek="2024년 4월 15일 - 21일" />
          </div>
        </div>
      </div>
    </div>
  )
}
