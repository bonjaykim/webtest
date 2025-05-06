import TeamCardStyle2 from "./components/team-card-style2"
import TeamCardStyle6 from "./components/team-card-style6"
import TeamCardStyle7 from "./components/team-card-style7"
import TeamCardStyle8 from "./components/team-card-style8"

export default function Home() {
  // 샘플 팀 파트 데이터
  const teamParts = [
    {
      id: 1,
      name: "개발",
      description: "프론트엔드, 백엔드, 모바일 앱 개발 및 유지보수",
      link: "/development",
      icon: "code-2",
    },
    {
      id: 2,
      name: "디자인",
      description: "UI/UX 디자인, 그래픽 디자인, 브랜드 아이덴티티",
      link: "/design",
      icon: "palette",
    },
    {
      id: 3,
      name: "마케팅",
      description: "디지털 마케팅, 콘텐츠 제작, 소셜 미디어 관리",
      link: "/marketing",
      icon: "megaphone",
    },
    {
      id: 4,
      name: "운영",
      description: "프로젝트 관리, 리소스 할당, 일정 관리",
      link: "/operations",
      icon: "settings",
    },
    {
      id: 5,
      name: "재무",
      description: "예산 관리, 재무 계획, 비용 분석",
      link: "/finance",
      icon: "bar-chart-2",
    },
    {
      id: 6,
      name: "인사",
      description: "채용, 교육, 직원 복지 및 성과 관리",
      link: "/hr",
      icon: "users",
    },
  ]

  return (
    <main className="container mx-auto p-4 space-y-16">
      <section>
        <h2 className="text-2xl font-bold mb-6">스타일 1: 그림자 효과 카드</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {teamParts.map((part) => (
            <TeamCardStyle2 key={part.id} part={part} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">스타일 2: 그라데이션 배경 카드</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {teamParts.map((part) => (
            <TeamCardStyle6 key={part.id} part={part} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">스타일 3: 코너 액센트 카드</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {teamParts.map((part) => (
            <TeamCardStyle7 key={part.id} part={part} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">스타일 4: 테두리 그라데이션 카드</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {teamParts.map((part) => (
            <TeamCardStyle8 key={part.id} part={part} />
          ))}
        </div>
      </section>
    </main>
  )
}
