"use client"

import { useState } from "react"
import { Edit, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
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
                {
                  id: 4,
                  name: "Oriental Stork",
                  habitat: "Wetlands",
                  conservation: "Endangered",
                  population: "Declining",
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
                },
                {
                  id: 17,
                  name: "Siberian Tiger",
                  habitat: "Forests",
                  conservation: "Endangered",
                  population: "Declining",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export default function AccordionTreeTable() {
  const [selectedNode, setSelectedNode] = useState<SelectedNode>(null)
  const [editingItem, setEditingItem] = useState<number | null>(null)
  const [editData, setEditData] = useState<EditData>({})

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

  const renderAccordionItems = (nodes: (RootNode | BranchNode | LeafNode)[], level = 0) => {
    return nodes.map((node) => {
      const hasChildren = isBranchNode(node) && node.children.length > 0
      const hasItems = isLeafNode(node) && node.items.length > 0

      return (
        <AccordionItem key={node.id} value={node.id} className={level > 0 ? "border-0" : ""}>
          <AccordionTrigger className={`${level > 0 ? "pl-4" : ""} ${hasItems ? "hover:text-primary" : ""}`}>
            <span
              onClick={
                hasItems
                  ? (e) => {
                      e.stopPropagation()
                      selectNode(node)
                    }
                  : undefined
              }
              className={hasItems ? "cursor-pointer" : ""}
            >
              {node.name}
              {hasItems && <span className="ml-2 text-xs text-muted-foreground">({node.items.length})</span>}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            {hasChildren && (
              <Accordion type="multiple" className="border-l-2 border-muted ml-2">
                {renderAccordionItems(node.children, level + 1)}
              </Accordion>
            )}
            {hasItems && !hasChildren && (
              <div className="pl-4 py-2">
                <Button variant="outline" size="sm" className="w-full" onClick={() => selectNode(node)}>
                  View {node.items.length} items
                </Button>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      )
    })
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 border rounded-lg">
      <div className="w-full md:w-1/3 border-r pr-4">
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        <ScrollArea className="h-[500px] pr-4">
          <Accordion type="multiple">{renderAccordionItems(initialData.animals)}</Accordion>
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
          <div className="flex items-center justify-center h-[500px] text-muted-foreground border rounded-md">
            Select a category to view items
          </div>
        )}
      </div>
    </div>
  )
}

