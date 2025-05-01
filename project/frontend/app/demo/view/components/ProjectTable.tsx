"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Filter, X, ChevronDown, ChevronRight, Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

// 타입 정의
interface ProjectType {
  id: number
  name: string
  icon: React.ElementType
}

interface Schedule {
  id: number | string
  name: string
  hasPlanned?: boolean
  hasChanged?: boolean
  hasCompleted?: boolean
  date?: Date
}

interface StatusCheckIcon {
  id: string
  name: string
  icon: React.ElementType
}

interface InfoIcon {
  id: number
  name: string
  icon: React.ElementType
  color: string
}

interface Project {
  id: string
  name: string
  type: string
  typeId: number
  typeIcon: React.ElementType
  priority: number
  scheduleStates: Schedule[]
  currentScheduleIndex: number
  currentStatus: string
  progress: number | null
  additionalInfo: InfoIcon[]
  statusChecks: Record<string, boolean>
  description: string
  manager: string
  budget: number
  startDate: Date
  endDate: Date
}

interface StatusColors {
  [key: string]: string
}

interface ProjectTableProps {
  allProjects: Project[]
  projectTypes: ProjectType[]
  statusCheckIcons: StatusCheckIcon[]
  statusColors: StatusColors
  scheduleOptions: { id: string; name: string }[]
}

export default function ProjectTable({
  allProjects,
  projectTypes,
  statusCheckIcons,
  statusColors,
  scheduleOptions,
}: ProjectTableProps) {
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({})
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(allProjects)
  const [filters, setFilters] = useState({
    type: [] as string[],
    name: "",
    schedule: [] as string[],
  })

  const toggleProject = (projectId: string) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }))
  }

  // 필터 변경 핸들러
  const handleFilterChange = (field: string, value: string | string[]) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // 프로젝트 타입 필터 변경 핸들러
  const handleTypeFilterChange = (typeId: string) => {
    setFilters((prev) => {
      const currentTypes = [...prev.type]
      const index = currentTypes.indexOf(typeId)

      if (index > -1) {
        currentTypes.splice(index, 1)
      } else {
        currentTypes.push(typeId)
      }

      return {
        ...prev,
        type: currentTypes,
      }
    })
  }

  // 일정 필터 변경 핸들러
  const handleScheduleFilterChange = (scheduleId: string) => {
    setFilters((prev) => {
      const currentSchedules = [...prev.schedule]
      const index = currentSchedules.indexOf(scheduleId)

      if (index > -1) {
        currentSchedules.splice(index, 1)
      } else {
        currentSchedules.push(scheduleId)
      }

      return {
        ...prev,
        schedule: currentSchedules,
      }
    })
  }

  // 필터 초기화
  const clearFilters = () => {
    setFilters({
      type: [],
      name: "",
      schedule: [],
    })
  }

  // 필터 적용
  useEffect(() => {
    let result = [...allProjects]

    if (filters.type.length > 0) {
      result = result.filter((project) => filters.type.includes(project.typeId.toString()))
    }

    if (filters.name) {
      result = result.filter((project) => project.name.toLowerCase().includes(filters.name.toLowerCase()))
    }

    if (filters.schedule.length > 0) {
      result = result.filter((project) => {
        const currentScheduleId = (project.currentScheduleIndex + 1).toString()
        return filters.schedule.includes(currentScheduleId)
      })
    }

    setFilteredProjects(result)
  }, [filters, allProjects])

  // 우선순위를 텍스트로 변환
  const getPriorityText = (priority: number) => {
    switch (priority) {
      case 3:
        return "높음"
      case 2:
        return "중간"
      case 1:
        return "낮음"
      default:
        return "-"
    }
  }

  // 날짜 포맷팅
  const formatDate = (date: Date | undefined) => {
    if (!date) return "-"
    return new Date(date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                프로젝트 타입
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <div className="p-2">
                {projectTypes.map((type) => (
                  <div key={type.id} className="flex items-center space-x-2 mb-1">
                    <Checkbox
                      id={`table-type-${type.id}`}
                      checked={filters.type.includes(type.id.toString())}
                      onCheckedChange={() => handleTypeFilterChange(type.id.toString())}
                    />
                    <label htmlFor={`table-type-${type.id}`} className="text-sm flex items-center">
                      <type.icon className="h-4 w-4 mr-2" />
                      {type.name}
                    </label>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Clock className="mr-2 h-4 w-4" />
                일정
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <div className="p-2">
                {scheduleOptions.map((schedule) => (
                  <div key={schedule.id} className="flex items-center space-x-2 mb-1">
                    <Checkbox
                      id={`table-schedule-${schedule.id}`}
                      checked={filters.schedule.includes(schedule.id)}
                      onCheckedChange={() => handleScheduleFilterChange(schedule.id)}
                    />
                    <label htmlFor={`table-schedule-${schedule.id}`} className="text-sm">
                      {schedule.name}
                    </label>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="프로젝트 검색..."
              className="pl-8"
              value={filters.name}
              onChange={(e) => handleFilterChange("name", e.target.value)}
            />
          </div>
        </div>

        {(filters.name || filters.schedule.length > 0 || filters.type.length > 0) && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            필터 초기화
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]"></TableHead>
            <TableHead>프로젝트</TableHead>
            <TableHead>일정</TableHead>
            <TableHead>진행</TableHead>
            <TableHead>현재 상황</TableHead>
            <TableHead>추가 정보</TableHead>
            <TableHead>우선순위</TableHead>
            <TableHead>담당자</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProjects.map((project) => (
            <>
              <TableRow key={project.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0"
                    onClick={() => toggleProject(project.id)}
                  >
                    {expandedProjects[project.id] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-2">
                      <project.typeIcon className="h-5 w-5" />
                    </div>
                    <div>{project.name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {project.currentStatus === "-" ? (
                    <span className="text-muted-foreground">-</span>
                  ) : (
                    <Badge className={statusColors[project.currentStatus]}>
                      일정{project.currentScheduleIndex + 1}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="w-32">
                    {project.progress === null ? (
                      <span className="text-muted-foreground">-</span>
                    ) : (
                      <div className="space-y-1">
                        <Progress value={project.progress} className="h-2" />
                        <div className="text-xs text-right">{project.progress}%</div>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {statusCheckIcons.map((icon) => {
                      const isOk = project.statusChecks[icon.id]
                      return (
                        <div
                          key={icon.id}
                          className={`flex items-center justify-center w-5 h-5 rounded-full ${
                            isOk ? "bg-green-100" : "bg-red-100"
                          }`}
                          title={`${icon.name}: ${isOk ? "정상" : "문제 있음"}`}
                        >
                          <icon.icon className={`h-3 w-3 ${isOk ? "text-green-600" : "text-red-600"}`} />
                        </div>
                      )
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {project.additionalInfo.map((info, index) => (
                      <info.icon key={index} className={`h-4 w-4 ${info.color}`} title={info.name} />
                    ))}
                    {project.additionalInfo.length === 0 && <span className="text-muted-foreground">-</span>}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`${
                      project.priority === 3
                        ? "border-red-200 bg-red-100 text-red-800"
                        : project.priority === 2
                        ? "border-amber-200 bg-amber-100 text-amber-800"
                        : "border-blue-200 bg-blue-100 text-blue-800"
                    }`}
                  >
                    {getPriorityText(project.priority)}
                  </Badge>
                </TableCell>
                <TableCell>{project.manager}</TableCell>
              </TableRow>
              {expandedProjects[project.id] && (
                <TableRow>
                  <TableCell colSpan={8} className="bg-muted/30">
                    <div className="p-2">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-1">프로젝트 설명</h4>
                          <p className="text-sm text-muted-foreground">{project.description}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1">일정 정보</h4>
                          <div className="space-y-1">
                            {project.scheduleStates.map((schedule) => (
                              <div key={schedule.id} className="flex items-center text-sm">
                                <div className="w-20">{schedule.name}:</div>
                                <Badge
                                  variant="outline"
                                  className={`${
                                    schedule.hasCompleted
                                      ? "border-green-200 bg-green-100 text-green-800"
                                      : schedule.hasChanged
                                      ? "border-amber-200 bg-amber-100 text-amber-800"
                                      : schedule.hasPlanned
                                      ? "border-blue-200 bg-blue-100 text-blue-800"
                                      : "border-gray-200 bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {schedule.hasCompleted
                                    ? "완료"
                                    : schedule.hasChanged
                                    ? "변경"
                                    : schedule.hasPlanned
                                    ? "계획"
                                    : "예정 없음"}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1">기간 및 예산</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span className="w-16 text-muted-foreground">시작일:</span>
                              {formatDate(project.startDate)}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span className="w-16 text-muted-foreground">종료일:</span>
                              {formatDate(project.endDate)}
                            </div>
                            <div className="flex items-center">
                              <span className="w-16 ml-6 text-muted-foreground">예산:</span>
                              {project.budget.toLocaleString()} 만원
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
