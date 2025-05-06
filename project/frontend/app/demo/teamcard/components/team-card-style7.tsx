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

export default function TeamCardStyle7({ part }: TeamCardProps) {
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

  return (
    <Link
      href={part.link}
      className="block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="rounded-lg p-5 h-full transition-all duration-300 shadow-md relative overflow-hidden"
        style={{
          transform: isHovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: isHovered ? "0 10px 25px -5px hsl(var(--primary) / 0.3)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* 코너 액센트 */}
        <div
          className="absolute top-0 right-0 w-16 h-16 transition-all duration-300"
          style={{
            background: "linear-gradient(135deg, transparent 50%, hsl(var(--primary) / 0.8) 50%)",
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "scale(1)" : "scale(0)",
            transformOrigin: "top right",
          }}
        />

        <div className="relative z-10">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-all duration-300"
            style={{
              backgroundColor: isHovered ? "hsl(var(--primary) / 0.1)" : "hsl(var(--muted))",
              transform: isHovered ? "rotate(10deg)" : "rotate(0deg)",
              border: isHovered ? "2px solid hsl(var(--primary))" : "2px solid transparent",
            }}
          >
            {Icon && (
              <Icon size={24} style={{ color: isHovered ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }} />
            )}
          </div>

          <h3
            className="font-semibold text-lg mb-2 transition-colors duration-300"
            style={{ color: isHovered ? "hsl(var(--primary))" : "hsl(var(--foreground))" }}
          >
            {part.name}
          </h3>

          <p className="text-sm text-muted-foreground mb-3">{part.description}</p>

          <div
            className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300 px-3 py-1"
            style={{
              backgroundColor: isHovered ? "hsl(var(--primary))" : "transparent",
              color: isHovered ? "white" : "hsl(var(--primary))",
              border: "1px solid hsl(var(--primary))",
              transform: isHovered ? "translateX(4px)" : "translateX(0)",
            }}
          >
            <span>자세히 보기</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
