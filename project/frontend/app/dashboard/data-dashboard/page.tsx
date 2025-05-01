"use client"

import { useState } from "react"
import { DataCard } from "../data-dashboard/components/data-card"
import { DataTable } from "../data-dashboard/components/data-table"
import { sampleData } from "../data-dashboard/components/lib/sample"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DataDashboard() {
  const [data] = useState(sampleData)

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-[1600px] mx-auto">
        <h1 className="text-2xl font-bold mb-6">데이터 대시보드</h1>

        <Tabs defaultValue="cards" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="cards">카드 뷰</TabsTrigger>
            <TabsTrigger value="table">테이블 뷰</TabsTrigger>
          </TabsList>

          <TabsContent value="cards">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {data.map((item, index) => (
                <DataCard key={item.id} item={item} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="table">
            <DataTable items={data} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
