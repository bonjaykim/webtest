"use client"

import { useState, useEffect } from "react"
import { Edit, Save, X, FolderOpen, FolderClosed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import type {
  AnimalData,
  AnimalItem,
  BranchNode,
  LeafNode,
  RootNode,
  SelectedNode,
  EditData,
} from "../types/animal-types"

// Sample data with done property
const initialData: AnimalData = {
  animals: [
    {
      id: "birds",
      name: "Birds",
      children: [
        {
          id: "asia",
          name: "Asia",
          children: [
            {
              id: "korea",
              name: "Korea",
              items: [
                {
                  id: 1,
                  name: "Sparrow",
                  habitat: "Urban",
                  conservation: "Least Concern",
                  population: "Abundant",
                  done: false,
                },
                {
                  id: 2,
                  name: "Magpie",
                  habitat: "Urban/Rural",
                  conservation: "Least Concern",
                  population: "Common",
                  done: false,
                },
                {
                  id: 3,
                  name: "Korean Crow",
                  habitat: "Forests",
                  conservation: "Least Concern",
                  population: "Stable",
                  done: false,
                },
                {
                  id: 4,
                  name: "Oriental Stork",
                  habitat: "Wetlands",
                  conservation: "Endangered",
                  population: "Declining",
                  done: false,
                },
              ],
            },
            {
              id: "japan",
              name: "Japan",
              items: [
                {
                  id: 6,
                  name: "Japanese White-eye",
                  habitat: "Forests",
                  conservation: "Least Concern",
                  population: "Stable",
                  done: false,
                },
                {
                  id: 7,
                  name: "Japanese Tit",
                  habitat: "Forests",
                  conservation: "Least Concern",
                  population: "Stable",
                  done: false,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "mammals",
      name: "Mammals",
      children: [
        {
          id: "asia",
          name: "Asia",
          children: [
            {
              id: "korea",
              name: "Korea",
              items: [
                {
                  id: 16,
                  name: "Korean Water Deer",
                  habitat: "Wetlands",
                  conservation: "Vulnerable",
                  population: "Declining",
                  done: false,
                },
                {
                  id: 17,
                  name: "Siberian Tiger",
                  habitat: "Forests",
                  conservation: "Endangered",
                  population: "Declining",
                  done: false,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

// 노드 타입을 확인하는 타입 가드 함수들
const isLeafNode = (node: BranchNode | LeafNode | RootNode): node is LeafNode => {
  return "items" in node && Array.isArray(node.items)
}

const isBranchNode = (node: BranchNode | LeafNode | RootNode): node is BranchNode => {
  return "children" in node && Array.isArray(node.children)
}

const isRootNode = (node: BranchNode | LeafNode | RootNode): node is RootNode => {
  return ("children" in node && Array.isArray(node.children) && node.id === "birds") || node.id === "mammals"
}

export default function AccordionTreeTable() {
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [selectedNode, setSelectedNode] = useState<SelectedNode>(null)
  const [editingItem, setEditingItem] = useState<number | null>(null)
  const [editData, setEditData] = useState<EditData>({})
  const [data, setData] = useState<AnimalData>(initialData)
  const [completedNodes, setCompletedNodes] = useState<Record<string, boolean>>({})
  const [nodeMap, setNodeMap] = useState<Record<string, { node: RootNode | BranchNode | LeafNode; path: string }>>({})

  // 노드 맵 생성 - 모든 노드를 ID로 빠르게 찾을 수 있도록 함
  useEffect(() => {
    const map: Record<string, { node: RootNode | BranchNode | LeafNode; path: string }> = {}

    const mapNode = (node: RootNode | BranchNode | LeafNode, path = "") => {
      const nodeId = `${path}-${node.id}`
      map[node.id] = { node, path }

      if ("children" in node && node.children.length > 0) {
        node.children.forEach((child) => {
          mapNode(child, nodeId)
        })
      }
    }

    data.animals.forEach((rootNode) => {
      mapNode(rootNode)
    })

    setNodeMap(map)
  }, [data])

  // 모든 노드의 완료 상태를 계산
  useEffect(() => {
    const calculateCompletedNodes = () => {
      const completed: Record<string, boolean> = {}

      // 리프 노드(국가)의 완료 상태 계산
      const processLeafNode = (node: LeafNode, path = ""): boolean => {
        const nodeId = `${path}-${node.id}`
        const allDone = node.items.length > 0 && node.items.every((item) => item.done)
        completed[nodeId] = allDone
        return allDone
      }

      // 브랜치 노드(지역)의 완료 상태 계산
      const processBranchNode = (node: BranchNode, path = ""): boolean => {
        const nodeId = `${path}-${node.id}`
        const allChildrenDone =
          node.children.length > 0 &&
          node.children.every((child) => {
            if (isLeafNode(child)) {
              return processLeafNode(child, nodeId)
            } else if (isBranchNode(child)) {
              return processBranchNode(child, nodeId)
            }
            return false
          })

        completed[nodeId] = allChildrenDone
        return allChildrenDone
      }

      // 루트 노드(동물 종류)의 완료 상태 계산
      data.animals.forEach((rootNode) => {
        const rootNodeId = `-${rootNode.id}`
        const allChildrenDone =
          rootNode.children.length > 0 && rootNode.children.every((child) => processBranchNode(child, rootNodeId))
        completed[rootNodeId] = allChildrenDone
      })

      setCompletedNodes(completed)
    }

    calculateCompletedNodes()
  }, [data])

  // 특정 최상위 노드의 모든 하위 노드를 접거나 펼치는 함수
  const toggleCategoryNodes = (node: RootNode | BranchNode | LeafNode, expand: boolean) => {
    // 노드가 children을 가지고 있는지 확인
    if (!("children" in node)) return

    // 모든 하위 노드 ID를 수집
    const allNodeIds: string[] = []

    // 현재 노드의 ID도 추가 (최상위 노드인 경우)
    if (isRootNode(node)) {
      allNodeIds.push(node.id)
    }

    // 재귀적으로 모든 하위 노드 ID를 수집하는 함수
    const collectNodeIds = (currentNode: RootNode | BranchNode) => {
      if ("children" in currentNode) {
        currentNode.children.forEach((child) => {
          allNodeIds.push(child.id)
          if ("children" in child) {
            collectNodeIds(child as BranchNode)
          }
        })
      }
    }

    collectNodeIds(node as RootNode | BranchNode)

    console.log("Toggle nodes:", allNodeIds, expand)

    if (expand) {
      // 기존 확장된 항목에 새로운 항목 추가
      setExpandedItems((prev) => {
        const newItems = [...prev]
        allNodeIds.forEach((id) => {
          if (!newItems.includes(id)) {
            newItems.push(id)
          }
        })
        return newItems
      })
    } else {
      // 확장된 항목에서 해당 카테고리의 항목 제거
      setExpandedItems((prev) => prev.filter((id) => !allNodeIds.includes(id)))
    }
  }

  const selectNode = (node: LeafNode) => {
    setSelectedNode(node)
    setEditingItem(null)
  }

  const startEditing = (item: AnimalItem) => {
    setEditingItem(item.id)
    setEditData({ ...item })
  }

  const cancelEditing = () => {
    setEditingItem(null)
    setEditData({})
  }

  const saveEditing = () => {
    if (
      selectedNode &&
      editingItem !== null &&
      editData.name &&
      editData.habitat &&
      editData.conservation &&
      editData.population !== undefined
    ) {
      // Update the local state
      const updatedItems = selectedNode.items.map((item) =>
        item.id === editingItem
          ? {
              ...item,
              name: editData.name || item.name,
              habitat: editData.habitat || item.habitat,
              conservation: editData.conservation || item.conservation,
              population: editData.population || item.population,
              done: editData.done !== undefined ? editData.done : item.done,
            }
          : item,
      )

      // 데이터 업데이트
      updateNodeItems(selectedNode.id, updatedItems)

      setSelectedNode({ ...selectedNode, items: updatedItems })
      setEditingItem(null)
    }
  }

  const handleEditChange = (field: keyof AnimalItem, value: string | boolean | "indeterminate") => {
    setEditData((prev) => ({
      ...prev,
      [field]: field === "done" ? value === true : value,
    }))
  }

  // 체크박스 상태 변경 처리
  const handleCheckboxChange = (itemId: number, checked: boolean | "indeterminate") => {
    if (!selectedNode) return

    const updatedItems = selectedNode.items.map((item) =>
      item.id === itemId ? { ...item, done: checked === true } : item,
    )

    // 데이터 업데이트
    updateNodeItems(selectedNode.id, updatedItems)

    setSelectedNode({ ...selectedNode, items: updatedItems })
  }

  // 데이터 업데이트 함수
  const updateNodeItems = (nodeId: string, updatedItems: AnimalItem[]) => {
    const newData = { ...data }

    // 데이터 트리에서 해당 노드를 찾아 업데이트
    const updateNode = (nodes: (RootNode | BranchNode | LeafNode)[]) => {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]

        if (node.id === nodeId && isLeafNode(node)) {
          ;(node as LeafNode).items = updatedItems
          return true
        }

        if (isBranchNode(node) || isRootNode(node)) {
          if ("children" in node && updateNode(node.children)) {
            return true
          }
        }
      }
      return false
    }

    updateNode(newData.animals)
    setData(newData)
  }

  const renderAccordionItems = (
    nodes: (RootNode | BranchNode | LeafNode)[],
    level = 0,
    isTopLevel = false,
    parentPath = "",
  ) => {
    return nodes.map((node) => {
      const nodeId = `${parentPath}-${node.id}`
      const hasChildren = isBranchNode(node) && node.children.length > 0
      const hasItems = isLeafNode(node) && node.items.length > 0
      const isCompleted = completedNodes[nodeId] || false

      return (
        <AccordionItem key={node.id} value={node.id} className={level > 0 ? "border-0" : ""}>
          <div className="flex items-center justify-between">
            <AccordionTrigger
              className={`
                ${level > 0 ? "pl-4" : ""} 
                ${hasItems ? "hover:text-primary" : ""} 
                ${isCompleted ? "text-muted-foreground" : ""}
                flex-1
              `}
            >
              <span
                className={`${hasItems ? "cursor-pointer" : ""} ${isCompleted ? "text-muted-foreground" : ""}`}
                onClick={
                  hasItems
                    ? (e) => {
                        e.stopPropagation()
                        selectNode(node)
                      }
                    : undefined
                }
              >
                {node.name}
                {hasItems && <span className="ml-2 text-xs text-muted-foreground">({node.items.length})</span>}
              </span>
            </AccordionTrigger>

            {isTopLevel && hasChildren && (
              <div className="flex gap-1 pr-4 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  title={`Expand all ${node.name}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleCategoryNodes(node, true)
                  }}
                >
                  <FolderOpen className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  title={`Collapse all ${node.name}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleCategoryNodes(node, false)
                  }}
                >
                  <FolderClosed className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <AccordionContent>
            {hasChildren && (
              <Accordion
                type="multiple"
                value={expandedItems}
                onValueChange={setExpandedItems}
                className="border-l-2 border-muted ml-2"
              >
                {renderAccordionItems(node.children, level + 1, false, nodeId)}
              </Accordion>
            )}

            {hasItems && !hasChildren && (
              <div className="py-1 pl-6">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => selectNode(node)}
                >
                  View {node.items.length} items
                </Button>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      )
    })
  }

  // 아코디언 컴포넌트 초기화 부분 수정
  // useEffect(() => {
  //   // 초기에 최상위 노드들을 확장
  //   const initialExpanded = data.animals.map((animal) => animal.id)
  //   setExpandedItems(initialExpanded)
  // }, [data.animals])

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 border rounded-lg">
      <div className="w-full md:w-1/3 border-r pr-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Categories</h2>
        </div>
        <ScrollArea className="h-[500px] pr-4">
          <Accordion type="multiple" value={expandedItems} onValueChange={setExpandedItems}>
            {renderAccordionItems(data.animals, 0, true)}
          </Accordion>
        </ScrollArea>
      </div>

      <div className="w-full md:w-2/3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{selectedNode ? `${selectedNode.name} Items` : "Items"}</h2>
          {selectedNode && (
            <Button variant="outline" size="sm">
              Add Item
            </Button>
          )}
        </div>

        {selectedNode ? (
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Habitat</TableHead>
                  <TableHead>Conservation</TableHead>
                  <TableHead>Population</TableHead>
                  <TableHead>Done</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedNode.items.map((item) => (
                  <TableRow key={item.id} className={item.done ? "bg-muted/30" : ""}>
                    {editingItem === item.id ? (
                      <>
                        <TableCell>
                          <Input
                            value={editData.name || ""}
                            onChange={(e) => handleEditChange("name", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={editData.habitat || ""}
                            onChange={(e) => handleEditChange("habitat", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={editData.conservation || ""}
                            onChange={(e) => handleEditChange("conservation", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={editData.population || ""}
                            onChange={(e) => handleEditChange("population", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={editData.done || false}
                            onCheckedChange={(checked) => handleEditChange("done", checked === true)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="icon" onClick={saveEditing}>
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={cancelEditing}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.habitat}</TableCell>
                        <TableCell>{item.conservation}</TableCell>
                        <TableCell>{item.population}</TableCell>
                        <TableCell>
                          <Checkbox
                            checked={item.done}
                            onCheckedChange={(checked) => handleCheckboxChange(item.id, checked === true)}
                          />
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => startEditing(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        ) : (
          <div className="flex items-center justify-center h-[500px] text-muted-foreground border rounded-md">
            Select a category to view items
          </div>
        )}
      </div>
    </div>
  )
}

