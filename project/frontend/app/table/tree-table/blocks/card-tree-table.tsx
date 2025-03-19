"use client"

import { useState } from "react"
import { Edit, Save, X, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

export default function CardTreeTable() {
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

  const renderTree = (nodes: (RootNode | BranchNode | LeafNode)[], path = "") => {
    return (
      <div className="space-y-2">
        {nodes.map((node) => {
          const nodeId = `${path}-${node.id}`
          const isExpanded = expandedNodes[nodeId]
          const hasChildren = isBranchNode(node) && node.children.length > 0
          const hasItems = isLeafNode(node) && node.items.length > 0

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
                  <span className="font-medium">{node.name}</span>
                </div>

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
        <CardContent>{renderTree(initialData.animals)}</CardContent>
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

