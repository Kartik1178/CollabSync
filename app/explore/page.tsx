"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { ProjectCard } from "@/components/project-card"
import { Search } from "lucide-react"

// Sample projects data
const sampleProjects = [
  {
    id: "4",
    title: "AI Image Generator",
    description: "A web application that generates images using AI models",
    tags: ["Python", "React", "TensorFlow", "API"],
    members: 3,
    lastUpdated: "1 day ago",
  },
  {
    id: "5",
    title: "Blockchain Explorer",
    description: "A tool to explore and analyze blockchain transactions",
    tags: ["JavaScript", "Web3", "Ethereum", "Node.js"],
    members: 5,
    lastUpdated: "3 days ago",
  },
  {
    id: "6",
    title: "Social Media Dashboard",
    description: "A dashboard to manage and analyze social media accounts",
    tags: ["React", "Next.js", "Tailwind CSS", "API"],
    members: 2,
    lastUpdated: "1 week ago",
  },
  {
    id: "7",
    title: "Fitness Tracker",
    description: "A mobile app to track workouts and fitness progress",
    tags: ["React Native", "Firebase", "Redux", "Mobile"],
    members: 4,
    lastUpdated: "2 weeks ago",
  },
  {
    id: "8",
    title: "Recipe Sharing Platform",
    description: "A platform for users to share and discover recipes",
    tags: ["Vue.js", "Node.js", "MongoDB", "Express"],
    members: 3,
    lastUpdated: "3 weeks ago",
  },
  {
    id: "9",
    title: "Budget Management App",
    description: "An application to track expenses and manage budgets",
    tags: ["Angular", "TypeScript", "Firebase", "Chart.js"],
    members: 2,
    lastUpdated: "1 month ago",
  },
]

// Sample popular tags
const popularTags = [
  "React",
  "JavaScript",
  "TypeScript",
  "Node.js",
  "Python",
  "Next.js",
  "Vue.js",
  "Angular",
  "MongoDB",
  "Firebase",
]

export default function ExplorePage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [projects, setProjects] = useState(sampleProjects)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(storedUser))
  }, [router])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Filter projects based on search query and selected tags
    const filtered = sampleProjects.filter((project) => {
      const matchesQuery =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => project.tags.includes(tag))

      return matchesQuery && matchesTags
    })

    setProjects(filtered)
  }

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  if (!user) {
    return null // Loading state or redirect handled by useEffect
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} />

      <main className="flex-1 container py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Explore Projects</h1>
            <p className="text-muted-foreground">Discover projects and find collaboration opportunities</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Search</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search projects..."
                      className="w-full pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full mt-4">
                    Search
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Tags</CardTitle>
                <CardDescription>Filter projects by technology</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                {selectedTags.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => setSelectedTags([])} className="text-xs">
                    Clear filters
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Projects</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="new">Newest</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="trending" className="mt-0">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {projects.slice(0, 3).map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="new" className="mt-0">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {projects.slice(3, 6).map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}

