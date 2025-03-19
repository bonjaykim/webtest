import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">My shadcn/ui Demo</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>This is a basic shadcn/ui card component</CardDescription>
          </CardHeader>
          <CardContent>
            <p>You can customize this card with your own content.</p>
          </CardContent>
          <CardFooter>
            <Button>Get Started</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>What makes shadcn/ui great</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Beautifully designed components</li>
              <li>Built with Tailwind CSS</li>
              <li>Accessible and customizable</li>
              <li>Copy and paste into your projects</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline">Learn More</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>Add more components to your project</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Use the CLI to add more components:</p>
            <pre className="bg-muted p-2 rounded-md mt-2 text-sm overflow-x-auto">
              npx shadcn@latest add dropdown-menu
            </pre>
          </CardContent>
          <CardFooter>
            <Button variant="secondary">View Docs</Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}