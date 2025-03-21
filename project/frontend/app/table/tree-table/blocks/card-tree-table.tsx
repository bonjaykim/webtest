"use client"

import { useState, useEffect } from "react"
import { Edit, Save, X, Plus, Minus, FolderOpen, FolderClosed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

// Sample data
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

// 특정 노드의 모든 하위 노드 ID를 수집하는 함수
const collectSubNodeIds = (node: RootNode | BranchNode | LeafNode, path = "", result: string[] = []): string[] => {
  const nodeId = `${path}-${node.id}`
  result.push(nodeId)

  if ("children" in node && node.children.length > 0) {
    node.children.forEach((child) => {
      collectSubNodeIds(child, nodeId, result)
    })
  }

  return result
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

export default function CardTreeTable() {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({})
  const [selectedNode, setSelectedNode] = useState<SelectedNode>(null)
  const [editingItem, setEditingItem] = useState<number | null>(null)
  const [editData, setEditData] = useState<EditData>({})
  const [data, setData] = useState<AnimalData>(initialData)
  const [completedNodes, setCompletedNodes] = useState<Record<string, boolean>>({})

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

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }))
  }

  // 특정 최상위 노드의 모든 하위 노드를 접거나 펼치는 함수
  const toggleCategoryNodes = (node: RootNode | BranchNode | LeafNode, expand: boolean) => {
    // 노드가 children을 가지고 있는지 확인
    if (!("children" in node)) return

    // 모든 하위 노드 ID를 수집
    const subNodeIds: string[] = []

    // 재귀적으로 모든 하위 노드 ID를 수집하는 함수
    const collectNodeIds = (currentNode: RootNode | BranchNode, currentPath = "") => {
      const nodeId = `${currentPath}-${currentNode.id}`
      subNodeIds.push(nodeId)

      if ("children" in currentNode) {
        currentNode.children.forEach((child) => {
          collectNodeIds(child, nodeId)
        })
      }
    }

    const path = "" // Declare path here
    collectNodeIds(node as RootNode | BranchNode, path)

    const newExpandedState = { ...expandedNodes }

    subNodeIds.forEach((nodeId) => {
      newExpandedState[nodeId] = expand
    })

    setExpandedNodes(newExpandedState)
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
      editData.population
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

  const renderTree = (nodes: (RootNode | BranchNode | LeafNode)[], path = "", isTopLevel = false) => {
    return (
      <div className="space-y-2">
        {nodes.map((node) => {
          const nodeId = `${path}-${node.id}`
          const isExpanded = expandedNodes[nodeId]
          const hasChildren = isBranchNode(node) && node.children.length > 0
          const hasItems = isLeafNode(node) && node.items.length > 0
          const isCompleted = completedNodes[nodeId] || false

          return (
            <div key={nodeId} className="border rounded-md">
              <div
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted"
                onClick={() => toggleNode(nodeId)}
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <Minus className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Plus className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className={`font-medium ${isCompleted ? "text-muted-foreground" : ""}`}>{node.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  {isTopLevel && hasChildren && (
                    <>
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
                    </>
                  )}

                  {hasItems && (
                    <Badge
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        selectNode(node)
                      }}
                    >
                      {node.items.length} items
                    </Badge>
                  )}
                </div>
              </div>

              {isExpanded && (hasChildren || hasItems) && (
                <div className="p-3 pt-0 border-t">
                  {hasChildren && renderTree(node.children, nodeId)}

                  {hasItems && !hasChildren && (
                    <Button variant="outline" size="sm" className="w-full" onClick={() => selectNode(node)}>
                      View {node.items.length} items
                    </Button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Browse animal categories</CardDescription>
        </CardHeader>
        <CardContent>{renderTree(data.animals, "", true)}</CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>{selectedNode ? `${selectedNode.name} Items` : "Items"}</CardTitle>
          <CardDescription>
            {selectedNode
              ? `Showing ${selectedNode.items.length} items from ${selectedNode.name}`
              : "Select a category to view items"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedNode ? (
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
          ) : (
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              Select a category to view items
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

