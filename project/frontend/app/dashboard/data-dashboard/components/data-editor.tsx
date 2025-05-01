"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

interface DataEditorProps {
  initialData: string
  onDataChange: (data: any) => void
}

export function DataEditor({ initialData, onDataChange }: DataEditorProps) {
  const [jsonData, setJsonData] = useState(initialData)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonData(e.target.value)
    setError(null)
  }

  const handleApply = () => {
    try {
      const parsedData = JSON.parse(jsonData)
      onDataChange(parsedData)
      setError(null)
      toast({
        title: "데이터가 적용되었습니다",
        description: "대시보드가 업데이트되었습니다.",
        variant: "default",
      })
    } catch (err) {
      setError("JSON 형식이 올바르지 않습니다. 다시 확인해주세요.")
      toast({
        title: "오류 발생",
        description: "JSON 형식이 올바르지 않습니다.",
        variant: "destructive",
        action: <ToastAction altText="다시 시도">다시 시도</ToastAction>,
      })
    }
  }

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">데이터 편집기</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            value={jsonData}
            onChange={handleChange}
            className="font-mono text-sm h-[300px]"
            placeholder="JSON 데이터를 입력하세요..."
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button onClick={handleApply}>적용하기</Button>
        </div>
      </CardContent>
    </Card>
  )
}
