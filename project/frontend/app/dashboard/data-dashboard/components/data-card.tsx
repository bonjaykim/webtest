"use client"

import { ExternalLink, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DataItem {
  id: string
  name: string
  teams: {
    name: string
    value: number
    threshold: string
    description: string
    link: string
  }[]
}

interface DataCardProps {
  item: DataItem
  index: number
}

export function DataCard({ item, index }: DataCardProps) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  const toggleExpand = (teamIndex: number) => {
    setExpandedItems((prev) => ({
      ...prev,
      [`${item.id}-${teamIndex}`]: !prev[`${item.id}-${teamIndex}`],
    }))
  }

  const getThresholdColor = (threshold: string) => {
    if (threshold.includes("조건")) {
      return "bg-blue-100 text-blue-600 border-blue-200"
    } else if (threshold.includes("미만")) {
      return "bg-red-100 text-red-600 border-red-200"
    } else if (threshold.includes("이상")) {
      return "bg-green-100 text-green-600 border-green-200"
    } else {
      return "bg-gray-100 text-gray-600 border-gray-200"
    }
  }

  return (
    <Card className="h-full border border-gray-200 shadow-md hover:shadow-lg transition-all">
      <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-800 text-white text-xs font-medium">
            {index + 1}
          </div>
          <CardTitle className="text-lg font-bold">{item.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 bg-white">
        <div className="space-y-4">
          {item.teams.map((team, teamIndex) => (
            <div
              key={`${item.id}-${team.name}-${teamIndex}`}
              className="border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors bg-gray-50"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium">{team.value}</span>
                  <Badge variant="outline" className="text-[10px] h-5 border-gray-200 text-gray-600">
                    {team.name}
                  </Badge>
                </div>
                <Link
                  href={team.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md w-7 h-7 bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="sr-only">링크 열기</span>
                </Link>
              </div>

              <div
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded p-1"
                onClick={() => toggleExpand(teamIndex)}
              >
                <Badge variant="outline" className={`text-[10px] h-5 ${getThresholdColor(team.threshold)}`}>
                  {team.threshold}
                </Badge>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-gray-500 transition-transform",
                    expandedItems[`${item.id}-${teamIndex}`] && "transform rotate-180",
                  )}
                />
              </div>

              {expandedItems[`${item.id}-${teamIndex}`] && (
                <div className="mt-2 pl-2 py-2 border-l-2 border-gray-300 text-sm text-gray-600 bg-white rounded">
                  {team.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
