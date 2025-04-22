"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Zap, Plus, Search, Code, Users, MessageSquare, Calendar, ArrowRight } from "lucide-react"
import TechnologySelector from "@/components/categoryselector"
interface Project {
  id: string
  title: string
  description: string
  techStack: string[]
  progress: number
  members: {
    id: string
    name: string
    avatar: string
    role: string
  }[]
  tasks: {
    id: string
    title: string
    status: "todo" | "in-progress" | "completed"
    assignee: string
  }[]
  lastUpdated: string
}

// Mock data - would be fetched from API in a real app
const mockProjects: Project[] = [
  {
    id: "1",
    title: "AI Image Generator",
    description: "A web application that uses machine learning to generate images from text descriptions.",
    techStack: ["React", "Python", "TensorFlow", "AWS"],
    progress: 65,
    members: [
      { id: "1", name: "Alex Johnson", avatar: "/placeholder.svg?height=40&width=40", role: "Lead Developer" },
      { id: "2", name: "Sarah Chen", avatar: "/placeholder.svg?height=40&width=40", role: "ML Engineer" },
      { id: "3", name: "Mike Davis", avatar: "/placeholder.svg?height=40&width=40", role: "UI Designer" },
    ],
    tasks: [
      { id: "t1", title: "Implement image generation API", status: "completed", assignee: "Sarah Chen" },
      { id: "t2", title: "Create responsive UI", status: "in-progress", assignee: "Mike Davis" },
      { id: "t3", title: "Optimize model performance", status: "todo", assignee: "Sarah Chen" },
      { id: "t4", title: "Add user authentication", status: "in-progress", assignee: "Alex Johnson" },
    ],
    lastUpdated: "2 days ago",
  },
  {
    id: "2",
    title: "Blockchain Voting System",
    description: "A secure voting system built on blockchain technology for transparent elections.",
    techStack: ["Solidity", "Ethereum", "React", "Node.js"],
    progress: 40,
    members: [
      { id: "1", name: "Alex Johnson", avatar: "/placeholder.svg?height=40&width=40", role: "Blockchain Developer" },
      { id: "4", name: "Lisa Wong", avatar: "/placeholder.svg?height=40&width=40", role: "Backend Developer" },
    ],
    tasks: [
      { id: "t1", title: "Design smart contract", status: "completed", assignee: "Alex Johnson" },
      { id: "t2", title: "Implement voting logic", status: "in-progress", assignee: "Alex Johnson" },
      { id: "t3", title: "Create admin dashboard", status: "todo", assignee: "Lisa Wong" },
      { id: "t4", title: "Security audit", status: "todo", assignee: "External" },
    ],
    lastUpdated: "5 days ago",
  },
  {
    id: "3",
    title: "IoT Home Automation",
    description: "A system to control and monitor home devices using IoT sensors and cloud infrastructure.",
    techStack: ["Python", "MQTT", "AWS IoT", "React Native"],
    progress: 80,
    members: [
      { id: "5", name: "James Wilson", avatar: "/placeholder.svg?height=40&width=40", role: "IoT Specialist" },
      { id: "1", name: "Alex Johnson", avatar: "/placeholder.svg?height=40&width=40", role: "Mobile Developer" },
    ],
    tasks: [
      { id: "t1", title: "Set up MQTT broker", status: "completed", assignee: "James Wilson" },
      { id: "t2", title: "Develop mobile app", status: "in-progress", assignee: "Alex Johnson" },
      { id: "t3", title: "Configure cloud services", status: "completed", assignee: "James Wilson" },
      { id: "t4", title: "Test with real devices", status: "in-progress", assignee: "Both" },
    ],
    lastUpdated: "Yesterday",
  },
]

const recommendedProjects: Project[] = [
  {
    id: "4",
    title: "AR Navigation App",
    description: "Augmented reality app for indoor and outdoor navigation with real-time guidance.",
    techStack: ["Unity", "ARKit", "ARCore", "C#"],
    progress: 30,
    members: [
      { id: "6", name: "Emma Roberts", avatar: "/placeholder.svg?height=40&width=40", role: "AR Developer" },
      { id: "7", name: "David Kim", avatar: "/placeholder.svg?height=40&width=40", role: "3D Artist" },
    ],
    tasks: [
      { id: "t1", title: "Implement AR tracking", status: "in-progress", assignee: "Emma Roberts" },
      { id: "t2", title: "Create 3D assets", status: "in-progress", assignee: "David Kim" },
      { id: "t3", title: "Develop routing algorithm", status: "todo", assignee: "Emma Roberts" },
    ],
    lastUpdated: "1 week ago",
  },
  {
    id: "5",
    title: "Quantum Computing Simulator",
    description: "Educational platform to simulate and visualize quantum computing concepts.",
    techStack: ["Python", "Qiskit", "React", "D3.js"],
    progress: 55,
    members: [
      { id: "8", name: "Ryan Patel", avatar: "/placeholder.svg?height=40&width=40", role: "Quantum Researcher" },
      { id: "9", name: "Julia Lee", avatar: "/placeholder.svg?height=40&width=40", role: "Frontend Developer" },
    ],
    tasks: [
      { id: "t1", title: "Implement quantum gates", status: "completed", assignee: "Ryan Patel" },
      { id: "t2", title: "Create interactive visualizations", status: "in-progress", assignee: "Julia Lee" },
      { id: "t3", title: "Add tutorial system", status: "todo", assignee: "Both" },
    ],
    lastUpdated: "3 days ago",
  },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("my-projects")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies:[] as string[], // This will be an array of ObjectIds or technology names depending on your flow
  })
  const setTechnologies = (technologies: string[]) => {
    setFormData((prev) => ({
      ...prev,
      technologies,
    }));
  };
  const filteredProjects = mockProjects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.techStack.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const filteredRecommended = recommendedProjects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.techStack.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase())),
  )
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    try {
      const res = await fetch("http://localhost:5000/projects/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials:"include",
        body: JSON.stringify(formData)
      })
  
      if (!res.ok) {
        const error = await res.text()
        throw new Error(error)
      }
  
      const result = await res.json()
      console.log("Project Created ✅", result)
      setIsProjectDialogOpen(false);
      // reset or redirect if needed
    } catch (err: any) {
      console.error("Error creating project:", err.message)
    }
  }
  
  return (
    <div className="min-h-screen bg-[#0a0a0a] cyber-grid p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Zap className="h-6 w-6 text-primary animate-pulse" />
          <span className="gradient-text">COLLABSYNC</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/profile">
            <Avatar className="h-10 w-10 border border-primary">
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Profile" />
              <AvatarFallback className="bg-[#1a1a1a] text-primary">AJ</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold gradient-text">Project Dashboard</h1>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search projects..."
                className="pl-10 bg-[#1a1a1a] border-[#2a2a2a] text-gray-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/80 glow">
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#121212] border-[#2a2a2a]">
                <DialogHeader>
                  <DialogTitle className="text-xl gradient-text">Create New Project</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Fill in the details to start a new collaboration.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
  <div className="grid gap-2">
    <label htmlFor="name" className="text-sm text-gray-300">Project Name</label>
    <Input
      id="name"
      value={formData.title}
      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      placeholder="Enter project name"
      className="bg-[#1a1a1a] border-[#2a2a2a]"
    />
  </div>

  <div className="grid gap-2">
    <label htmlFor="description" className="text-sm text-gray-300">Description</label>
    <Input
      id="description"
      value={formData.description}
      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      placeholder="Brief project description"
      className="bg-[#1a1a1a] border-[#2a2a2a]"
    />
  </div>

  <div className="grid gap-2">
    <label className="text-sm text-gray-300">Tech Stack</label>
    <TechnologySelector   formData={formData}
  setFormData={(data) =>
    setFormData((prev) => ({
      ...prev,
      technologies: data.technologies,
    }))
  } />
  </div>

  <Button type="submit">Create Project</Button>
</form>

                <DialogFooter>
                  <Button className="bg-primary hover:bg-primary/80 glow" onClick={() => setIsProjectDialogOpen(false)}>
                    Create Project
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="my-projects" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              My Projects
            </TabsTrigger>
            <TabsTrigger value="explore" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Explore
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-projects" className="space-y-6">
            {filteredProjects.length === 0 ? (
              <Card className="border-[#2a2a2a] bg-[#121212] neon-border">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-gray-400 mb-4">No projects found matching your search.</p>
                  <Button variant="outline" className="border-primary text-primary" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <Card
                    key={project.id}
                    className="border-[#2a2a2a] bg-[#121212] hover:border-primary transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      setSelectedProject(project)
                      setIsProjectDialogOpen(true)
                    }}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl font-bold text-white">{project.title}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {project.description.length > 100
                          ? `${project.description.substring(0, 100)}...`
                          : project.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map((tech) => (
                          <Badge key={tech} variant="outline" className="border-primary text-primary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {project.members.slice(0, 3).map((member) => (
                            <Avatar key={member.id} className="border-2 border-[#121212] h-8 w-8">
                              <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                              <AvatarFallback className="bg-[#1a1a1a] text-primary text-xs">
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {project.members.length > 3 && (
                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#1a1a1a] border-2 border-[#121212] text-xs text-primary">
                              +{project.members.length - 3}
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-400 ml-2">{project.members.length} members</div>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Updated {project.lastUpdated}</span>
                        </div>
                        <div>Progress: {project.progress}%</div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" className="w-full text-primary hover:text-primary hover:bg-primary/10">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="explore" className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">Recommended Projects</h2>
            {filteredRecommended.length === 0 ? (
              <Card className="border-[#2a2a2a] bg-[#121212] neon-border">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-gray-400 mb-4">No recommended projects found matching your search.</p>
                  <Button variant="outline" className="border-primary text-primary" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecommended.map((project) => (
                  <Card
                    key={project.id}
                    className="border-[#2a2a2a] bg-[#121212] hover:border-primary transition-all duration-300 cursor-pointer"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl font-bold text-white">{project.title}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {project.description.length > 100
                          ? `${project.description.substring(0, 100)}...`
                          : project.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map((tech) => (
                          <Badge key={tech} variant="outline" className="border-primary text-primary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {project.members.slice(0, 3).map((member) => (
                            <Avatar key={member.id} className="border-2 border-[#121212] h-8 w-8">
                              <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                              <AvatarFallback className="bg-[#1a1a1a] text-primary text-xs">
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <div className="text-sm text-gray-400 ml-2">{project.members.length} members</div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" className="w-full text-primary hover:text-primary hover:bg-primary/10">
                        Join Project
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Project Details Dialog */}
      {selectedProject && (
        <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
          <DialogContent className="bg-[#121212] border-[#2a2a2a] max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl gradient-text">{selectedProject.title}</DialogTitle>
              <DialogDescription className="text-gray-400">{selectedProject.description}</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="tasks" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="tasks" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Code className="mr-2 h-4 w-4" />
                  Tasks
                </TabsTrigger>
                <TabsTrigger value="team" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Users className="mr-2 h-4 w-4" />
                  Team
                </TabsTrigger>
                <TabsTrigger value="chat" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat
                </TabsTrigger>
              </TabsList>

              <TabsContent value="tasks" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-[#2a2a2a] bg-[#1a1a1a]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-gray-300">To Do</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {selectedProject.tasks
                        .filter((task) => task.status === "todo")
                        .map((task) => (
                          <div key={task.id} className="p-3 bg-[#121212] rounded-md border border-[#2a2a2a]">
                            <h4 className="font-medium text-gray-200">{task.title}</h4>
                            <p className="text-xs text-gray-400">Assigned to: {task.assignee}</p>
                          </div>
                        ))}
                    </CardContent>
                  </Card>

                  <Card className="border-[#2a2a2a] bg-[#1a1a1a]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-gray-300">In Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {selectedProject.tasks
                        .filter((task) => task.status === "in-progress")
                        .map((task) => (
                          <div key={task.id} className="p-3 bg-[#121212] rounded-md border border-[#2a2a2a]">
                            <h4 className="font-medium text-gray-200">{task.title}</h4>
                            <p className="text-xs text-gray-400">Assigned to: {task.assignee}</p>
                          </div>
                        ))}
                    </CardContent>
                  </Card>

                  <Card className="border-[#2a2a2a] bg-[#1a1a1a]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-gray-300">Completed</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {selectedProject.tasks
                        .filter((task) => task.status === "completed")
                        .map((task) => (
                          <div key={task.id} className="p-3 bg-[#121212] rounded-md border border-[#2a2a2a]">
                            <h4 className="font-medium text-gray-200">{task.title}</h4>
                            <p className="text-xs text-gray-400">Assigned to: {task.assignee}</p>
                          </div>
                        ))}
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-primary hover:bg-primary/80 glow">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="team" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedProject.members.map((member) => (
                    <Card key={member.id} className="border-[#2a2a2a] bg-[#1a1a1a]">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 border border-primary">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback className="bg-[#121212] text-primary">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-gray-200">{member.name}</h4>
                            <p className="text-xs text-gray-400">{member.role}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="ghost"
                          className="w-full text-primary hover:text-primary hover:bg-primary/10"
                          onClick={() => (window.location.href = "/profile")}
                        >
                          View Profile
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button className="bg-primary hover:bg-primary/80 glow">
                    <Plus className="mr-2 h-4 w-4" />
                    Invite Member
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="chat" className="space-y-4">
                <Card className="border-[#2a2a2a] bg-[#1a1a1a] h-[300px] flex flex-col">
                  <CardContent className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Sarah Chen" />
                          <AvatarFallback className="bg-[#121212] text-primary text-xs">SC</AvatarFallback>
                        </Avatar>
                        <div className="bg-[#121212] p-3 rounded-lg rounded-tl-none max-w-[80%]">
                          <p className="text-xs text-gray-400 mb-1">Sarah Chen</p>
                          <p className="text-sm text-gray-200">
                            I've completed the image generation API. It's working well in testing.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 justify-end">
                        <div className="bg-primary/20 p-3 rounded-lg rounded-tr-none max-w-[80%]">
                          <p className="text-xs text-gray-400 mb-1">You</p>
                          <p className="text-sm text-gray-200">
                            Great work! I'm still working on the authentication system. Should be done by tomorrow.
                          </p>
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="You" />
                          <AvatarFallback className="bg-[#121212] text-primary text-xs">AJ</AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Mike Davis" />
                          <AvatarFallback className="bg-[#121212] text-primary text-xs">MD</AvatarFallback>
                        </Avatar>
                        <div className="bg-[#121212] p-3 rounded-lg rounded-tl-none max-w-[80%]">
                          <p className="text-xs text-gray-400 mb-1">Mike Davis</p>
                          <p className="text-sm text-gray-200">
                            The UI is coming along nicely. I'll share some screenshots later today for feedback.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-[#2a2a2a] p-4">
                    <div className="flex w-full gap-2">
                      <Input placeholder="Type your message..." className="flex-1 bg-[#121212] border-[#2a2a2a]" />
                      <Button className="bg-primary hover:bg-primary/80">Send</Button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>

            <DialogFooter className="flex justify-between items-center">
              <div className="flex gap-2">
                {selectedProject.techStack.map((tech) => (
                  <Badge key={tech} variant="outline" className="border-primary text-primary">
                    {tech}
                  </Badge>
                ))}
              </div>
              <Button className="bg-primary hover:bg-primary/80 glow">Project Settings</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
