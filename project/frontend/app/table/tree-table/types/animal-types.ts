// 동물 항목에 대한 인터페이스
export interface AnimalItem {
    id: number
    name: string
    habitat: string
    conservation: string
    population: string
  }
  
  // 최종 노드(국가)에 대한 인터페이스
  export interface LeafNode {
    id: string
    name: string
    items: AnimalItem[]
  }
  
  // 중간 노드(지역)에 대한 인터페이스
  export interface BranchNode {
    id: string
    name: string
    children: (BranchNode | LeafNode)[]
  }
  
  // 최상위 노드(동물 종류)에 대한 인터페이스
  export interface RootNode {
    id: string
    name: string
    children: BranchNode[]
  }
  
  // 전체 데이터 구조에 대한 인터페이스
  export interface AnimalData {
    animals: RootNode[]
  }
  
  // 선택된 노드 타입 (LeafNode만 선택 가능)
  export type SelectedNode = LeafNode | null
  
  // 편집 중인 데이터 타입
  export type EditData = Partial<AnimalItem>