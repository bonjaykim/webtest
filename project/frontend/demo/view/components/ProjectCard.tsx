"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Filter, X, ChevronDown, ChevronRight, Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

export default function ProjectCard({ allProjects, projectTypes, statusCheckIcons, statusColors, scheduleOptions }) {
  const [expandedProjects, setExpandedProjects] = useState({})
  const [filteredProjects, setFilteredProjects] = useState(allProjects)
  const [filters, setFilters] = useState({
    type: [],
    name: "",
    schedule: [],
  })

  const toggleProject = (projectId) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }))
  }

  // 필터 변경 핸들러
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // 프로젝트 타입 필터 변경 핸들러
  const handleTypeFilterChange = (typeId) => {
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
  const handleScheduleFilterChange = (scheduleId) => {
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
                      id={`card-type-${type.id}`}
                      checked={filters.type.includes(type.id.toString())}
                      onCheckedChange={() => handleTypeFilterChange(type.id.toString())}
                    />
                    <label htmlFor={`card-type-${type.id}`} className="text-sm flex items-center">
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
                      id={`card-schedule-${schedule.id}`}
                      checked={filters.schedule.includes(schedule.id)}
                      onCheckedChange={() => handleScheduleFilterChange(schedule.id)}
                    />
                    <label htmlFor={`card-schedule-${schedule.id}`} className="text-sm">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <CardHeader className="p-4 pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-2">
                    <project.typeIcon className="h-5 w-5" />
                  </div>
                  <div className="font-medium">{project.name}</div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => toggleProject(project.id)}>
                  {expandedProjects[project.id] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-muted-foreground">현재 상황</div>
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
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-muted-foreground">일정</div>
                <div>
                  {project.currentStatus === "-" ? (
                    <span className="text-muted-foreground">-</span>
                  ) : (
                    <Badge className={statusColors[project.currentStatus]}>
                      일정{project.currentScheduleIndex + 1}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm text-muted-foreground">진행 상황</div>
                  <div className="text-sm font-medium">{project.progress === null ? "-" : `${project.progress}%`}</div>
                </div>
                {project.progress !== null && <Progress value={project.progress} className="h-2" />}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">추가 정보</div>
                <div className="flex items-center gap-1">
                  {project.additionalInfo.map((info, index) => (
                    <info.icon key={index} className={`h-4 w-4 ${info.color}`} title={info.name} />
                  ))}
                  {project.additionalInfo.length === 0 && <span className="text-muted-foreground">-</span>}
                </div>
              </div>
            </CardContent>

            {expandedProjects[project.id] && (
              <CardFooter className="border-t p-4 flex flex-col items-start">
                <div className="grid grid-cols-2 gap-2 w-full mb-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">담당자</div>
                    <div className="text-sm">{project.manager}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">우선순위</div>
                    <div className="text-sm">
                      {project.priority === 3 ? "높음" : project.priority === 2 ? "중간" : "낮음"}
                    </div>
                  </div>
                </div>

                <div className="w-full mb-3">
                  <div className="text-xs text-muted-foreground mb-1">기간</div>
                  <div className="text-sm flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {project.startDate.toLocaleDateString()} ~ {project.endDate.toLocaleDateString()}
                  </div>
                </div>

                <div className="w-full">
                  <div className="text-xs text-muted-foreground mb-1">일정 목록</div>
                  <div className="grid grid-cols-2 gap-2">
                    {project.scheduleStates.slice(0, 4).map((schedule) => {
                      // 현재 일정 상태 결정
                      let status = "-"
                      if (schedule.hasCompleted) {
                        status = "완료"
                      } else if (schedule.hasChanged) {
                        status = "변경"
                      } else if (schedule.hasPlanned) {
                        status = "계획"
                      }

                      return (
                        <div key={schedule.id} className="flex items-center justify-between text-xs">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {schedule.name}
                          </div>
                          {status === "-" ? (
                            <span className="text-muted-foreground">-</span>
                          ) : (
                            <Badge className={`${statusColors[status]} text-xs py-0 px-1`}>{status}</Badge>
                          )}
                        </div>
                      )
                    })}
                    {project.scheduleStates.length > 4 && (
                      <div className="text-xs text-muted-foreground col-span-2 text-center">
                        + {project.scheduleStates.length - 4}개 더 보기
                      </div>
                    )}
                  </div>
                </div>
              </CardFooter>
            )}
          </Card>
        ))}

        {filteredProjects.length === 0 && (
          <div className="col-span-full text-center py-10 text-muted-foreground">검색 결과가 없습니다.</div>
        )}
      </div>
    </div>
  )
}
