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

export default function TeamCardStyle5({ part }: TeamCardProps) {
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
        className="rounded-lg p-5 h-full transition-all duration-300 shadow-md border"
        style={{
          transform: isHovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: isHovered ? "0 10px 25px -5px hsl(var(--primary) / 0.2)" : "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
          borderColor: isHovered ? "hsl(var(--primary))" : "hsl(var(--border))",
        }}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3
              className="font-semibold text-lg mb-2 transition-colors duration-300"
              style={{ color: isHovered ? "hsl(var(--primary))" : "hsl(var(--foreground))" }}
            >
              {part.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-3">{part.description}</p>
          </div>

          {Icon && (
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ml-3"
              style={{
                backgroundColor: isHovered ? "hsl(var(--primary))" : "hsl(var(--muted))",
                transform: isHovered ? "scale(1.1)" : "scale(1)",
              }}
            >
              <Icon size={22} style={{ color: isHovered ? "white" : "hsl(var(--muted-foreground))" }} />
            </div>
          )}
        </div>

        <div
          className="text-sm font-medium flex items-center mt-2 transition-all duration-300"
          style={{
            color: "hsl(var(--primary))",
            opacity: isHovered ? 1 : 0.8,
          }}
        >
          <span>바로가기</span>
          <div
            className="ml-1 transition-all duration-300 flex items-center"
            style={{
              width: isHovered ? "20px" : "12px",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3.33337 8H12.6667"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 3.33337L12.6667 8.00004L8 12.6667"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}
