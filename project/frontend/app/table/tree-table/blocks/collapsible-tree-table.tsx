"use client"

import { useState, useEffect } from "react"
import { ChevronRight, ChevronDown, Edit, Save, X, FileText, FolderOpen, FolderClosed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
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

export default function CollapsibleTreeTable() {
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

    const subNodeIds = collectSubNodeIds(node as RootNode | BranchNode)
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

  const renderTree = (nodes: (RootNode | BranchNode | LeafNode)[], path = "", level = 0, isTopLevel = false) => {
    return (
      <div className="space-y-1">
        {nodes.map((node) => {
          const nodeId = `${path}-${node.id}`
          const isExpanded = expandedNodes[nodeId]
          const hasChildren = isBranchNode(node) && node.children.length > 0
          const hasItems = isLeafNode(node) && node.items.length > 0
          const isCompleted = completedNodes[nodeId] || false

          return (
            <div key={nodeId}>
              <div className={`flex items-center justify-between py-1 hover:bg-muted/50 rounded-sm`}>
                <div className="flex items-center">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleNode(nodeId)}>
                    {hasChildren || hasItems ? (
                      isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )
                    ) : (
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>

                  <span
                    className={`ml-1 cursor-pointer ${hasItems ? "font-medium hover:text-primary" : ""} ${
                      isCompleted ? "text-muted-foreground" : ""
                    }`}
                    onClick={() => (hasItems ? selectNode(node) : toggleNode(nodeId))}
                  >
                    {node.name}
                    {hasItems && <span className="ml-2 text-xs text-muted-foreground">({node.items.length})</span>}
                  </span>
                </div>

                {isTopLevel && hasChildren && (
                  <div className="flex gap-1 pr-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      title={`Expand all ${node.name}`}
                      onClick={() => toggleCategoryNodes(node, true)}
                    >
                      <FolderOpen className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      title={`Collapse all ${node.name}`}
                      onClick={() => toggleCategoryNodes(node, false)}
                    >
                      <FolderClosed className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {isExpanded && (
                <div className={`pl-${level > 0 ? 6 : 4}`}>
                  {hasChildren && renderTree(node.children, nodeId, level + 1)}

                  {hasItems && !hasChildren && (
                    <div className="py-1 pl-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => selectNode(node)}
                      >
                        View all items
                      </Button>
                    </div>
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
    <div className="border rounded-lg shadow-sm overflow-hidden">
      <div className="bg-muted/50 p-4 border-b">
        <h2 className="text-lg font-semibold">Animal Classification</h2>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 border-r">
          <div className="p-4">
            <h3 className="text-sm font-medium mb-2">Categories</h3>
            <ScrollArea className="h-[400px]">{renderTree(data.animals, "", 0, true)}</ScrollArea>
          </div>
        </div>

        <div className="w-full md:w-2/3">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium">{selectedNode ? `${selectedNode.name} Items` : "Items"}</h3>
              {selectedNode && (
                <Button variant="outline" size="sm">
                  Add Item
                </Button>
              )}
            </div>

            <Separator className="my-2" />

            {selectedNode ? (
              <ScrollArea className="h-[350px]">
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
              <div className="flex items-center justify-center h-[350px] text-muted-foreground">
                Select a category to view items
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

