"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, Edit, Save, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
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
                { id: 1, name: "Sparrow", habitat: "Urban", conservation: "Least Concern", population: "Abundant" },
                { id: 2, name: "Magpie", habitat: "Urban/Rural", conservation: "Least Concern", population: "Common" },
                { id: 3, name: "Korean Crow", habitat: "Forests", conservation: "Least Concern", population: "Stable" },
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
                },
                {
                  id: 7,
                  name: "Japanese Tit",
                  habitat: "Forests",
                  conservation: "Least Concern",
                  population: "Stable",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export default function CollapsibleTreeTable() {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({})
  const [selectedNode, setSelectedNode] = useState<SelectedNode>(null)
  const [editingItem, setEditingItem] = useState<number | null>(null)
  const [editData, setEditData] = useState<EditData>({})

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }))
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
      // In a real app, you would update the data in your database
      console.log("Saving changes:", editData)

      // Update the local state
      const updatedItems = selectedNode.items.map((item) =>
        item.id === editingItem
          ? {
              ...item,
              name: editData.name || item.name,
              habitat: editData.habitat || item.habitat,
              conservation: editData.conservation || item.conservation,
              population: editData.population || item.population,
            }
          : item,
      )
      setSelectedNode({ ...selectedNode, items: updatedItems })
      setEditingItem(null)
    }
  }

  const handleEditChange = (field: keyof AnimalItem, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // 노드 타입을 확인하는 타입 가드 함수들
  const isLeafNode = (node: BranchNode | LeafNode | RootNode): node is LeafNode => {
    return "items" in node && Array.isArray(node.items)
  }

  const isBranchNode = (node: BranchNode | LeafNode | RootNode): node is BranchNode => {
    return "children" in node && Array.isArray(node.children)
  }

  const renderTree = (nodes: (RootNode | BranchNode | LeafNode)[], path = "", level = 0) => {
    return (
      <div className="space-y-1">
        {nodes.map((node) => {
          const nodeId = `${path}-${node.id}`
          const isExpanded = expandedNodes[nodeId]
          const hasChildren = isBranchNode(node) && node.children.length > 0
          const hasItems = isLeafNode(node) && node.items.length > 0

          return (
            <Collapsible key={nodeId} open={isExpanded} onOpenChange={() => toggleNode(nodeId)} className="w-full">
              <div className={`flex items-center pl-${level * 4} py-1 hover:bg-muted/50 rounded-sm`}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
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
                </CollapsibleTrigger>

                <span
                  className={`ml-1 cursor-pointer ${hasItems ? "font-medium hover:text-primary" : ""}`}
                  onClick={() => (hasItems ? selectNode(node) : null)}
                >
                  {node.name}
                  {hasItems && <span className="ml-2 text-xs text-muted-foreground">({node.items.length})</span>}
                </span>
              </div>

              <CollapsibleContent>
                {hasChildren && renderTree(node.children, nodeId, level + 1)}

                {hasItems && !hasChildren && (
                  <div className={`pl-${level * 4 + 8} py-1`}>
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
              </CollapsibleContent>
            </Collapsible>
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
            <ScrollArea className="h-[400px]">{renderTree(initialData.animals)}</ScrollArea>
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
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedNode.items.map((item) => (
                      <TableRow key={item.id}>
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

