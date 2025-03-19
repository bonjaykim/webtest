"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CardTreeTable from "./blocks/card-tree-table"
import AccordionTreeTable from "./blocks/accordion-tree-table"
import CollapsibleTreeTable from "./blocks/collapsible-tree-table"

export default function TreeTableDemo() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Tree Table Examples</h1>

      <Tabs defaultValue="card" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="card">Card Style</TabsTrigger>
          <TabsTrigger value="accordion">Accordion Style</TabsTrigger>
          <TabsTrigger value="collapsible">Collapsible Style</TabsTrigger>
        </TabsList>

        <TabsContent value="card">
          <CardTreeTable />
        </TabsContent>

        <TabsContent value="accordion">
          <AccordionTreeTable />
        </TabsContent>

        <TabsContent value="collapsible">
          <CollapsibleTreeTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}

