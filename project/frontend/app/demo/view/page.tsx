"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  LayoutGrid,
  LayoutList,
  Ship,
  Car,
  Truck,
  Train,
  FileText,
  AlertCircle,
  Info,
  Bell,
  Users,
  Shield,
  Zap,
  Database,
  CheckCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import ProjectTable from "./components/ProjectTable"
import ProjectCard from "./components/ProjectCard"

// 데이터 생성 부분
const projectTypes = [
  { id: 1, name: "선박", icon: Ship },
  { id: 2, name: "자동차", icon: Car },
  { id: 3, name: "트럭", icon: Truck },
  { id: 4, name: "기차", icon: Train },
]

const statusColors = {
  계획: "bg-blue-100 text-blue-800",
  변경: "bg-amber-100 text-amber-800",
  완료: "bg-green-100 text-green-800",
}

// 추가 정보 아이콘 정의
const additionalInfoIcons = [
  { id: 1, name: "문서", icon: FileText, color: "text-muted-foreground" },
  { id: 2, name: "이슈", icon: AlertCircle, color: "text-red-500" },
  { id: 3, name: "메모", icon: Info, color: "text-blue-500" },
  { id: 4, name: "회의", icon: Users, color: "text-purple-500" },
  { id: 5, name: "알림", icon: Bell, color: "text-amber-500" },
]

// 현재 상황 아이콘 정의
const statusCheckIcons = [
  { id: "A", name: "보안", icon: Shield },
  { id: "B", name: "성능", icon: Zap },
  { id: "C", name: "데이터", icon: Database },
  { id: "D", name: "품질", icon: CheckCircle },
  { id: "E", name: "오류", icon: AlertCircle },
]

// 일정 목록
const scheduleOptions = Array.from({ length: 8 }, (_, i) => ({
  id: (i + 1).toString(),
  name: `일정 ${i + 1}`,
}))

const generateProjects = (type) => {
  const projects = []
  const count = Math.floor(Math.random() * 3) + 2 // 2-4개의 프로젝트

  for (let i = 1; i <= count; i++) {
    // 각 일정별로 계획, 변경, 완료 상태 생성
    const scheduleStates = []
    let currentScheduleIndex = 0

    for (let j = 1; j <= 8; j++) {
      const hasPlanned = Math.random() > 0.3
      const hasChanged = hasPlanned && Math.random() > 0.5
      const hasCompleted = hasChanged && Math.random() > 0.5

      scheduleStates.push({
        id: j,
        name: `일정 ${j}`,
        hasPlanned,
        hasChanged,
        hasCompleted,
        date: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      })

      // 완료되지 않은 첫 번째 일정을 현재 일정으로 설정
      if (currentScheduleIndex === 0 && !hasCompleted) {
        currentScheduleIndex = j - 1
      }
    }

    // 모든 일정이 완료된 경우 마지막 일정을 현재 일정으로 설정
    if (currentScheduleIndex === 0 && scheduleStates.every((s) => s.hasCompleted)) {
      currentScheduleIndex = 7
    }

    // 현재 일정의 상태 결정
    let currentStatus = "-"
    const currentSchedule = scheduleStates[currentScheduleIndex]

    if (currentSchedule) {
      if (currentSchedule.hasCompleted) {
        currentStatus = "완료"
      } else if (currentSchedule.hasChanged) {
        currentStatus = "변경"
      } else if (currentSchedule.hasPlanned) {
        currentStatus = "계획"
      }
    }

    // 진행 상황 생성 (없음 또는 0-100)
    const hasProgress = Math.random() > 0.2
    const progress = hasProgress ? Math.floor(Math.random() * 101) : null

    // 추가 정보 생성 (5가지 중 랜덤하게 0-3개 선택)
    const additionalInfo = []
    const infoCount = Math.floor(Math.random() * 4)
    const availableInfos = [...additionalInfoIcons]

    for (let k = 0; k < infoCount; k++) {
      if (availableInfos.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableInfos.length)
        additionalInfo.push(availableInfos[randomIndex])
        availableInfos.splice(randomIndex, 1)
      }
    }

    // 현재 상황 상태 생성 (A~E)
    const statusChecks = {}
    statusCheckIcons.forEach((icon) => {
      statusChecks[icon.id] = Math.random() > 0.3 // 70% 확률로 문제 없음
    })

    projects.push({
      id: `${type.id}-${i}`,
      name: `${type.name} 프로젝트 ${i}`,
      type: type.name,
      typeId: type.id,
      typeIcon: type.icon,
      priority: Math.floor(Math.random() * 3) + 1, // 1(낮음), 2(중간), 3(높음)
      scheduleStates,
      currentScheduleIndex,
      currentStatus,
      progress,
      additionalInfo,
      statusChecks,
      description: `${type.name} 프로젝트 ${i}에 대한 상세 설명입니다. 이 프로젝트는 ${
        Math.random() > 0.5 ? "국내" : "해외"
      } 프로젝트로, ${Math.floor(Math.random() * 24) + 1}개월 동안 진행될 예정입니다.`,
      manager: `담당자 ${Math.floor(Math.random() * 10) + 1}`,
      budget: Math.floor(Math.random() * 10000) + 1000,
      startDate: new Date(2025, Math.floor(Math.random() * 6), Math.floor(Math.random() * 28) + 1),
      endDate: new Date(2025, Math.floor(Math.random() * 6) + 6, Math.floor(Math.random() * 28) + 1),
    })
  }

  // priority 높은 순으로 정렬
  return projects.sort((a, b) => b.priority - a.priority)
}

// 모든 프로젝트 데이터를 미리 생성
const allProjects = []
projectTypes.forEach((type) => {
  allProjects.push(...generateProjects(type))
})

// 프로젝트 타입 순서대로 정렬 (선박, 자동차, 트럭, 기차)
allProjects.sort((a, b) => a.typeId - b.typeId)

export default function ProjectsByTypeView() {
  const [viewMode, setViewMode] = useState("table") // table 또는 card

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <Link href="/" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">프로젝트 테이블</h1>
          <div className="ml-auto">
            <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value)}>
              <ToggleGroupItem value="table" aria-label="테이블 뷰">
                <LayoutList className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="card" aria-label="카드 뷰">
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          {viewMode === "table" ? (
            <ProjectTable
              allProjects={allProjects}
              projectTypes={projectTypes}
              statusCheckIcons={statusCheckIcons}
              statusColors={statusColors}
              scheduleOptions={scheduleOptions}
            />
          ) : (
            <ProjectCard
              allProjects={allProjects}
              projectTypes={projectTypes}
              statusCheckIcons={statusCheckIcons}
              statusColors={statusColors}
              scheduleOptions={scheduleOptions}
            />
          )}
        </div>
      </main>
    </div>
  )
}
