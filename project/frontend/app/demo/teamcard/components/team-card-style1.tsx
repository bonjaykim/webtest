"use client"

import Link from "next/link"
import { Code2, Palette, Megaphone, Settings, BarChart2, Users, type LucideIcon } from "lucide-react"
import { useState } from "react"

interface TeamPart {
  id: number
  name: string
  description: string
  link: string
  icon: string
}

interface TeamCardProps {
  part: TeamPart
}

export default function TeamCardStyle1({ part }: TeamCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // 아이콘 매핑
  const iconMap: Record<string, LucideIcon> = {
    "code-2": Code2,
    palette: Palette,
    megaphone: Megaphone,
    settings: Settings,
    "bar-chart-2": BarChart2,
    users: Users,
  }

  const Icon = iconMap[part.icon]

  // 차트 테마 색상 (호버 효과용)
  const chartColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ]

  // ID를 기반으로 색상 선택 (순환)
  const colorIndex = (part.id - 1) % chartColors.length
  const themeColor = chartColors[colorIndex]

  return (
    <Link
      href={part.link}
      className="block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="border rounded-lg p-4 h-full transition-all duration-300"
        style={{
          borderColor: isHovered ? themeColor : "hsl(var(--border))",
          backgroundColor: isHovered ? `${themeColor}10` : "transparent",
        }}
      >
        <div className="flex items-center mb-3">
          {Icon && (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mr-3 transition-colors duration-300"
              style={{
                backgroundColor: isHovered ? `${themeColor}20` : "hsl(var(--muted))",
              }}
            >
              <Icon size={20} style={{ color: isHovered ? themeColor : "hsl(var(--muted-foreground))" }} />
            </div>
          )}
          <h3 className="font-medium text-lg">{part.name}</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-2">{part.description}</p>
        <div
          className="text-sm font-medium transition-colors duration-300"
          style={{ color: isHovered ? themeColor : "hsl(var(--primary))" }}
        >
          자세히 보기 →
        </div>
      </div>
    </Link>
  )
}
