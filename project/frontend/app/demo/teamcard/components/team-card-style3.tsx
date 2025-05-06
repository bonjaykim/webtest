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

export default function TeamCardStyle3({ part }: TeamCardProps) {
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
        className="p-4 h-full transition-all duration-300 relative overflow-hidden"
        style={{
          borderBottom: `2px solid ${isHovered ? themeColor : "hsl(var(--border))"}`,
        }}
      >
        {/* 호버 시 나타나는 사이드 액센트 */}
        <div
          className="absolute left-0 top-0 w-1 h-full transition-opacity duration-300"
          style={{
            backgroundColor: themeColor,
            opacity: isHovered ? 1 : 0,
          }}
        />

        <div className="flex items-center mb-3">
          {Icon && (
            <Icon
              size={20}
              className="mr-2 transition-colors duration-300"
              style={{ color: isHovered ? themeColor : "hsl(var(--muted-foreground))" }}
            />
          )}
          <h3
            className="font-medium text-lg transition-colors duration-300"
            style={{ color: isHovered ? themeColor : "hsl(var(--foreground))" }}
          >
            {part.name}
          </h3>
        </div>

        <p className="text-sm text-muted-foreground mb-3 pl-0.5">{part.description}</p>

        <div
          className="text-sm font-medium flex items-center transition-all duration-300"
          style={{
            color: isHovered ? themeColor : "hsl(var(--primary))",
            transform: isHovered ? "translateX(8px)" : "translateX(0)",
          }}
        >
          <span>더 알아보기</span>
        </div>
      </div>
    </Link>
  )
}
