"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard-header"
import { useToast } from "@/hooks/use-toast"
import { Code, Github, MessageSquare, Plus, Share2, Users } from "lucide-react"

// Sample project data
const sampleProject = {
  id: "1",
  title: "E-Commerce Platform",
  description:
    "A modern e-commerce platform built with React and Node.js. Features include product listings, shopping cart, user authentication, and payment processing.",
  tags: ["React", "Node.js", "MongoDB", "Express", "Redux"],
  members: [
    { id: "1", name: "John Doe", role: "Owner", avatar: "/placeholder-user.jpg" },
    { id: "2", name: "Jane Smith", role: "Developer", avatar: "/placeholder-user.jpg" },
    { id: "3", name: "Alex Johnson", role: "Designer", avatar: "/placeholder-user.jpg" },
    { id: "4", name: "Sam Wilson", role: "Developer", avatar: "/placeholder-user.jpg" },
  ],
  tasks: [
    { id: "1", title: "Set up authentication", status: "completed", assignee: "John Doe" },
    { id: "2", title: "Design product page", status: "in-progress", assignee: "Alex Johnson" },
    { id: "3", title: "Implement shopping cart", status: "in-progress", assignee: "Jane Smith" },
    { id: "4", title: "Set up payment gateway", status: "pending", assignee: "Unassigned" },
    { id: "5", title: "Create admin dashboard", status: "pending", assignee: "Unassigned" },
  ],
  discussions: [
    {
      id: "1",
      title: "API Structure Discussion",
      author: "John Doe",
      date: "2 days ago",
      replies: 5,
      lastActivity: "3 hours ago",
    },
    {
      id: "2",
      title: "UI Component Library",
      author: "Alex Johnson",
      date: "4 days ago",
      replies: 8,
      lastActivity: "1 day ago",
    },
    {
      id: "3",
      title: "Database Schema Review",
      author: "Jane Smith",
      date: "1 week ago",
      replies: 12,
      lastActivity: "2 days ago",
    },
  ],
  repositories: [
    {
      id: "1",
      name: "frontend",
      description: "React frontend for the e-commerce platform",
      language: "TypeScript",
      lastUpdated: "1 day ago",
    },
    {
      id: "2",
      name: "backend",
      description: "Node.js backend API",
      language: "JavaScript",
      lastUpdated: "3 days ago",
    },
  ],
  createdAt: "2 weeks ago",
  lastUpdated: "2 days ago",
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [project, setProject] = useState(sampleProject)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(storedUser))

    // In a real app, you would fetch the project data based on the ID
    // For demo purposes, we're using the sample data
  }, [router, params.id])

  const handleShare = () => {
    // In a real app, you would generate a shareable link
    navigator.clipboard.writeText(`https://collabsync.app/projects/${params.id}`)
    toast({
      title: "Link copied",
      description: "Project link has been copied to clipboard",
    })
  }

  if (!user || !project) {
    return null // Loading state
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} />

      <main className="flex-1 container py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">{project.title}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <span>Created {project.createdAt}</span>
              <span>•</span>
              <span>Last updated {project.lastUpdated}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button size="sm">
              <Github className="mr-2 h-4 w-4" />
              Connect Repository
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="tasks">
              <TabsList className="mb-4">
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
                <TabsTrigger value="repositories">Repositories</TabsTrigger>
              </TabsList>

              <TabsContent value="tasks">
                <Card>
                  <CardHeader className="flex flex-row items-center">
                    <div>
                      <CardTitle>Tasks</CardTitle>
                      <CardDescription>Track and manage project tasks</CardDescription>
                    </div>
                    <Button size="sm" className="ml-auto">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Task
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  task.status === "completed"
                                    ? "bg-green-500"
                                    : task.status === "in-progress"
                                      ? "bg-blue-500"
                                      : "bg-gray-500"
                                }`}
                              />
                              <p className="font-medium">{task.title}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">Assigned to: {task.assignee}</p>
                          </div>
                          <Badge
                            variant={
                              task.status === "completed"
                                ? "default"
                                : task.status === "in-progress"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {task.status === "completed"
                              ? "Completed"
                              : task.status === "in-progress"
                                ? "In Progress"
                                : "Pending"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="discussions">
                <Card>
                  <CardHeader className="flex flex-row items-center">
                    <div>
                      <CardTitle>Discussions</CardTitle>
                      <CardDescription>Collaborate and discuss project details</CardDescription>
                    </div>
                    <Button size="sm" className="ml-auto">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      New Discussion
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.discussions.map((discussion) => (
                        <div
                          key={discussion.id}
                          className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                        >
                          <div>
                            <p className="font-medium">{discussion.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Started by {discussion.author} • {discussion.date}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{discussion.replies} replies</p>
                            <p className="text-xs text-muted-foreground">Last activity: {discussion.lastActivity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="repositories">
                <Card>
                  <CardHeader className="flex flex-row items-center">
                    <div>
                      <CardTitle>Repositories</CardTitle>
                      <CardDescription>Connected code repositories</CardDescription>
                    </div>
                    <Button size="sm" className="ml-auto">
                      <Github className="mr-2 h-4 w-4" />
                      Connect Repository
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.repositories.map((repo) => (
                        <div
                          key={repo.id}
                          className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <Code className="h-4 w-4 text-muted-foreground" />
                              <p className="font-medium">{repo.name}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">{repo.description}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">{repo.language}</Badge>
                            <p className="text-xs text-muted-foreground mt-1">Updated {repo.lastUpdated}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>
                  {project.members.length} member{project.members.length !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Users className="mr-2 h-4 w-4" />
                  Invite Members
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">John Doe</span> completed task{" "}
                        <span className="font-medium">Set up authentication</span>
                      </p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>AJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">Alex Johnson</span> started working on{" "}
                        <span className="font-medium">Design product page</span>
                      </p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">Jane Smith</span> joined the project
                      </p>
                      <p className="text-xs text-muted-foreground">1 week ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

