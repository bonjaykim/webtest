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

export default function TeamCardStyle8({ part }: TeamCardProps) {
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
        className="rounded-lg p-5 h-full transition-all duration-300 shadow-md relative"
        style={{
          transform: isHovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: isHovered ? "0 10px 25px -5px hsl(var(--primary) / 0.3)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          background: isHovered
            ? "linear-gradient(white, white) padding-box, linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.5)) border-box"
            : "white",
          border: isHovered ? "2px solid transparent" : "2px solid hsl(var(--border))",
        }}
      >
        <div className="flex items-start mb-3">
          <div
            className="w-12 h-12 flex items-center justify-center transition-all duration-300"
            style={{
              backgroundColor: isHovered ? "hsl(var(--primary))" : "hsl(var(--muted))",
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
          >
            {Icon && <Icon size={22} style={{ color: isHovered ? "white" : "hsl(var(--muted-foreground))" }} />}
          </div>

          <div className="ml-3 flex-1">
            <h3
              className="font-semibold text-lg transition-colors duration-300"
              style={{ color: isHovered ? "hsl(var(--primary))" : "hsl(var(--foreground))" }}
            >
              {part.name}
            </h3>
            <p className="text-sm text-muted-foreground">{part.description}</p>
          </div>
        </div>

        <div
          className="text-sm font-medium flex items-center mt-3 transition-all duration-300 justify-end"
          style={{
            color: "hsl(var(--primary))",
          }}
        >
          <span>바로가기</span>
          <svg
            className="ml-1 transition-transform duration-300"
            style={{ transform: isHovered ? "translateX(4px)" : "translateX(0)" }}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
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
    </Link>
  )
}
