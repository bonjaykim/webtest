"use client"

import Link from "next/link"
import { useState } from "react"
import * as React from "react"
import { ExternalLink, ChevronDown, ChevronRight } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

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

interface DataTableProps {
  items: DataItem[]
}

export function DataTable({ items }: DataTableProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  const toggleRow = (rowId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
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

  // 모든 팀과 항목의 조합을 생성
  const tableRows = items.flatMap((item) =>
    item.teams.map((team, teamIndex) => ({
      rowId: `${item.id}-${team.name}-${teamIndex}`,
      itemId: item.id,
      itemName: item.name,
      teamName: team.name,
      value: team.value,
      threshold: team.threshold,
      description: team.description,
      link: team.link,
    })),
  )

  return (
    <Card className="border border-gray-200 shadow-md">
      <CardContent className="p-0">
        <style jsx global>{`
          /* 스크롤바 숨기기 */
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
        `}</style>
        <div className="w-full overflow-auto max-h-[calc(100vh-200px)] no-scrollbar">
          <Table>
            <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
              <TableRow className="border-b border-gray-200 hover:bg-transparent">
                <TableHead className="w-[40px] text-gray-700"></TableHead>
                <TableHead className="w-[180px] text-gray-700 font-bold">항목명</TableHead>
                <TableHead className="w-[80px] text-gray-700 font-bold text-center">값</TableHead>
                <TableHead className="w-[120px] text-gray-700 font-bold">연관팀</TableHead>
                <TableHead className="w-[120px] text-gray-700 font-bold">threshold</TableHead>
                <TableHead className="w-[60px] text-gray-700 font-bold">링크</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableRows.map((row) => (
                <React.Fragment key={row.rowId}>
                  <TableRow className="cursor-pointer hover:bg-gray-50" onClick={() => toggleRow(row.rowId)}>
                    <TableCell className="p-2">
                      {expandedRows[row.rowId] ? (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{row.itemName}</TableCell>
                    <TableCell className="text-center font-medium">{row.value}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] h-5 border-gray-200 text-gray-600">
                        {row.teamName}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] h-5 ${getThresholdColor(row.threshold)}`}>
                        {row.threshold}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={row.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-md w-7 h-7 bg-gray-100 hover:bg-gray-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span className="sr-only">링크 열기</span>
                      </Link>
                    </TableCell>
                  </TableRow>
                  {expandedRows[row.rowId] && (
                    <TableRow key={`${row.rowId}-expanded`} className="bg-gray-50">
                      <TableCell colSpan={6} className="p-4">
                        <div className="text-sm text-gray-600 border-l-2 border-gray-300 pl-3 bg-white rounded p-2">
                          <strong>항목 설명:</strong> {row.description}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
