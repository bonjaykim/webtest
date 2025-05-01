export const sampleData = [
    {
      id: "item1",
      name: "서버 응답 시간",
      teams: [
        {
          name: "백엔드팀",
          value: 120,
          threshold: "200ms 미만",
          description: "API 서버의 평균 응답 시간 (밀리초)",
          link: "https://www.google.com/search?q=server+response+time",
        },
        {
          name: "인프라팀",
          value: 85,
          threshold: "100ms 미만",
          description: "데이터베이스 쿼리 평균 응답 시간 (밀리초)",
          link: "https://www.google.com/search?q=database+query+time",
        },
        {
          name: "백엔드팀+인프라팀",
          value: 205,
          threshold: "300ms 이상",
          description: "전체 시스템 응답 시간 (밀리초)",
          link: "https://www.google.com/search?q=system+response+time",
        },
      ],
    },
    {
      id: "item2",
      name: "사용자 세션 수",
      teams: [
        {
          name: "프론트엔드팀",
          value: 1250,
          threshold: "1000명 이상",
          description: "현재 활성화된 사용자 세션 수",
          link: "https://www.google.com/search?q=active+user+sessions",
        },
        {
          name: "마케팅팀",
          value: 850,
          threshold: "500명 이상",
          description: "신규 사용자 세션 수",
          link: "https://www.google.com/search?q=new+user+sessions",
        },
      ],
    },
    {
      id: "item3",
      name: "시스템 가용성",
      teams: [
        {
          name: "인프라팀",
          value: 99.95,
          threshold: "99.9% 이상",
          description: "시스템 가용성 비율 (%)",
          link: "https://www.google.com/search?q=system+availability",
        },
        {
          name: "DevOps팀",
          value: 99.8,
          threshold: "99.5% 이상",
          description: "서비스 가용성 비율 (%)",
          link: "https://www.google.com/search?q=service+availability",
        },
      ],
    },
    {
      id: "item4",
      name: "오류 발생률",
      teams: [
        {
          name: "백엔드팀",
          value: 0.5,
          threshold: "1% 미만",
          description: "API 요청 중 오류 발생 비율 (%)",
          link: "https://www.google.com/search?q=api+error+rate",
        },
        {
          name: "프론트엔드팀",
          value: 0.8,
          threshold: "2% 미만",
          description: "클라이언트 측 오류 발생 비율 (%)",
          link: "https://www.google.com/search?q=client+error+rate",
        },
        {
          name: "QA팀",
          value: 1.2,
          threshold: "1% 미만",
          description: "전체 시스템 오류 발생 비율 (%)",
          link: "https://www.google.com/search?q=system+error+rate",
        },
      ],
    },
    {
      id: "item5",
      name: "사용자 만족도",
      teams: [
        {
          name: "UX팀",
          value: 4.2,
          threshold: "4.0 이상",
          description: "사용자 인터페이스 만족도 점수 (5점 만점)",
          link: "https://www.google.com/search?q=user+interface+satisfaction",
        },
        {
          name: "고객지원팀",
          value: 3.8,
          threshold: "4.0 이상",
          description: "고객 지원 만족도 점수 (5점 만점)",
          link: "https://www.google.com/search?q=customer+support+satisfaction",
        },
      ],
    },
    {
      id: "item6",
      name: "페이지 로드 시간",
      teams: [
        {
          name: "프론트엔드팀",
          value: 2.3,
          threshold: "3초 미만",
          description: "웹 페이지 평균 로드 시간 (초)",
          link: "https://www.google.com/search?q=page+load+time",
        },
        {
          name: "백엔드팀",
          value: 1.5,
          threshold: "2초 미만",
          description: "API 데이터 로드 시간 (초)",
          link: "https://www.google.com/search?q=api+load+time",
        },
      ],
    },
    {
      id: "item7",
      name: "리소스 사용률",
      teams: [
        {
          name: "인프라팀",
          value: 68,
          threshold: "80% 미만",
          description: "CPU 사용률 (%)",
          link: "https://www.google.com/search?q=cpu+usage",
        },
        {
          name: "DevOps팀",
          value: 75,
          threshold: "90% 미만",
          description: "메모리 사용률 (%)",
          link: "https://www.google.com/search?q=memory+usage",
        },
        {
          name: "인프라팀+DevOps팀",
          value: 55,
          threshold: "70% 미만",
          description: "디스크 사용률 (%)",
          link: "https://www.google.com/search?q=disk+usage",
        },
      ],
    },
  ]
  