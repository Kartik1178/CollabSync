"use client"

import { useState } from "react"
import Link from "next/link"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import MessageButton from "../../components/MessageButton";
import AddTaskDialog from "@/components/AddTaskDialog"
import RemoveMemberButton from "@/components/RemoveMemberButton"
import DeleteProjectButton from "@/components/RemoveProject"
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
  technologies: string[]
  progress: number
  members: {
    user:{
    id: string
    name: string
    avatar: string
    role: string}
  }[]
  tasks: {
    id: string
    title: string
    status: "todo" | "in-progress" | "completed"
    assignee: string
  }[]
  lastUpdated: string
}
// types.ts or in the same file above the component
interface DeleteProjectButtonProps {
  projectId: string
  onDelete: (id: string) => void  // <-- Accepts an ID argument
}

type User = {
  _id: string;
  name: string;
  image?: string;
};

type Message = {
  _id: string;
  project: string;
  sender: User;
  text: string;
  createdAt: string;
};

type ChatTabProps = {
  projectId: string;
  currentUser: User;
};

// Mock data - would be fetched from API in a real app
const mockProjects: Project[] = [
  {
    id: "1",
    title: "AI Image Generator",
    description: "A web application that uses machine learning to generate images from text descriptions.",
    technologies: ["React", "Python", "TensorFlow", "AWS"],
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




export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("my-projects")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)
  const [newProjectDialogOpen,setNewProjectDialogOpen]=useState(false)
  const [refreshTasks, setRefreshTasks] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies:[] as string[], // This will be an array of ObjectIds or technology names depending on your flow
  })
  const [tasks, setTasks] = useState<Project["tasks"]>([])

  const [recommendedProjects, setRecommendedProjects] = useState<Project[]>([])
  const [projects, setProjects] = useState<Project[]>([])
const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
const [requestedProjectIds, setRequestedProjectIds] = useState<string[]>([]);
const [text, setText] = useState<string>('');
const initialMessages: Message[] = [
  {
    _id: "1",
    project: "your-project-id", // Add project ID
    sender: { _id: "2", name: "System", image: "/placeholder.svg" },
    text: "Start chatting",
    createdAt: new Date().toISOString(),
  },
];
const [messages, setMessages] = useState<Message[]>([
  {
    _id: "1",
    project: "default-project-id",
    sender: { _id: "system", name: "System", image: "/placeholder.svg" },
    text: "Chat started",
    createdAt: new Date().toISOString(),
  },
])
;





const currentUser: User = {
  _id: "user-1",
  name: "Alex Johnson",
  image: "/placeholder.svg"
};

const handleSend = () => {
  if (text.trim() === "") return;
  
  const newMessage: Message = {
    _id: Date.now().toString(),
    project: selectedProject?.id || "default-project-id",
    sender: currentUser,
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };

  setMessages(prev => [...prev, newMessage]);
  setText("");
};



  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://localhost:5000/projects/find", {
          method: "GET",
          credentials: "include", // if your backend needs cookies/auth
          headers: {
            "Content-Type": "application/json",
          },
        })
    
        if (!res.ok) {
          const error = await res.text()
          throw new Error(error)
        }
    
        const data = await res.json()
        setProjects(data.projects)
        setFilteredProjects(data.projects)
      } catch (err: any) {
        console.error("Failed to fetch your projects", err.message)
      }
    }
    
    fetchProjects()
  }, [])
  const handleJoinRequest = async (projectId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/projects/${projectId}/request`, {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await res.json();
  
      if (res.ok) {
        setRequestedProjectIds((prev) => [...prev, projectId]);
      } else {
        console.error("Failed to send join request", data);
      }
    } catch (err) {
      console.log(err);
    }
  };



const handleTaskCreated = () => {
  setRefreshTasks(prev => !prev)
  
}

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await fetch("http://localhost:5000/projects/fetchAll")
        if (!res.ok) throw new Error("Failed to fetch recommended projects")
  
        const data = await res.json()
        setRecommendedProjects(data)
      } catch (error) {
        console.error("Error fetching recommended projects:", error)
      }
    }
  
    fetchRecommended()
  }, [])
  const setTechnologies = (technologies: string[]) => {
    setFormData((prev) => ({
      ...prev,
      technologies,
    }));
  };


  const filteredRecommended = recommendedProjects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase())),
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
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const res = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include", // includes the cookie
      })

      if (res.ok) {
         window.location.href = "/login"
      } else {
        alert("Logout failed. Please try again.")
      }
    } catch (error) {
      alert("An error occurred while logging out.")
    } finally {
      setIsLoggingOut(false)
    }
  }
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/projects/${id}`, {
        method: 'DELETE',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete project');
      }
  
      console.log('✅', data.message);
      setFilteredProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('❌ Delete error:', error);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#0a0a0a] cyber-grid p-4 md:p-8">
     <div className="flex justify-between items-center mb-8">
    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
      <Zap className="h-6 w-6 text-primary animate-pulse" />
      <span className="gradient-text">COLLABSYNC</span>
    </Link>
    <div className="flex items-center gap-4">
    <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {isLoggingOut ? "Logging out..." : "Log out"}
            </Button>
    </div>
    <div className="flex items-center gap-4">
      <MessageButton/>
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
            <Dialog open={newProjectDialogOpen}  onOpenChange={setNewProjectDialogOpen}>
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

  <Button onClick={() => setIsProjectDialogOpen(false)} type="submit">Create Project</Button>
</form>
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
                        {project.technologies.map((tech) => (
                          <Badge key={tech} variant="outline" className="border-primary text-primary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
  <div className="flex -space-x-2">
    {project.members.slice(0, 3).map((member) => (
      <Avatar key={member.user.id} className="border-2 border-[#121212] h-8 w-8">
        <AvatarImage 
          src={member.user.avatar || "/placeholder.svg"} 
          alt={member.user.name || "User Avatar"} // Default alt text
        />
        <AvatarFallback className="bg-[#1a1a1a] text-primary text-xs">
          {member.user.name 
            ? member.user.name.split(" ").map((n) => n[0]).join("") 
            : "?"} {/* Default initials if name is missing */}
        </AvatarFallback>
      </Avatar>
    ))}
    {project.members.length > 3 && (
      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#1a1a1a] border-2 border-[#121212] text-xs text-primary">
        +{project.members.length - 3}
      </div>
    )}
  </div>
  <div className="text-sm text-gray-400 ml-2">
    {project.members.length} member{project.members.length !== 1 ? "s" : ""}
  </div>
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
                      <Button onClick={() => {
                      setSelectedProject(project)
                      setIsProjectDialogOpen(true)
                    }} variant="ghost" className="w-full text-primary hover:text-primary hover:bg-primary/10">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button variant="destructive" onClick={() => handleDelete(project.id)}>
  Delete
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
                        {project.technologies.map((tech) => (
                          <Badge key={tech} variant="outline" className="border-primary text-primary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                        {project.members.slice(0, 3).map((member) => (
  <Avatar key={member.user.id} className="border-2 border-[#121212] h-8 w-8">
    <AvatarImage src={member.user.avatar || "/placeholder.svg"} alt={member.user.name || "User"} />
    <AvatarFallback className="bg-[#1a1a1a] text-primary text-xs">
      {(member?.user.name?.split(" ")?.map((n) => n[0])?.join("") ?? "U N")}
    </AvatarFallback>
  </Avatar>
))}

                        </div>
                        <div className="text-sm text-gray-400 ml-2">{project.members.length} members</div>
                      </div>
                    </CardContent>
                    <CardFooter>
  {requestedProjectIds.includes(project.id) ? (
    <Button
      variant="ghost"
      disabled
      className="w-full text-gray-400 bg-transparent cursor-not-allowed"
    >
      Requested
    </Button>
  ) : (
    <Button
      variant="ghost"
      className="w-full text-primary hover:text-primary hover:bg-primary/10"
      onClick={() => handleJoinRequest(project.id)}
    >
      Join Project
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  )}
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
                <AddTaskDialog
  projectId={selectedProject.id}
  members={selectedProject.members}
  onTaskCreated={handleTaskCreated}
/>

                </div>
              </TabsContent>

              <TabsContent value="team" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedProject?.members?.map((member) => (
                    <Card key={member.user.id} className="border-[#2a2a2a] bg-[#1a1a1a]">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 border border-primary">
                            <AvatarImage src={member.user.avatar || "/placeholder.svg"} alt={member.user.name} />
                            <AvatarFallback className="bg-[#121212] text-primary">
  {member?.user.name
    ? member.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "?"} {/* Fallback if name is undefined */}
</AvatarFallback>

                          </Avatar>
                          <div>
                            <h4 className="font-medium text-gray-200">{member.user.name}</h4>
                            <p className="text-xs text-gray-400">{member.user.role}</p>
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
                        <RemoveMemberButton
        memberId={member.user.id}
        projectId={selectedProject.id}
        onRemove={(userId) => {
          setSelectedProject((prev) =>
            prev
              ? {
                  ...prev,
                  members: prev.members.filter((m) => m.user.id !== userId),
                }
              : prev
          );
        }}
      />
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button className="bg-primary hover:bg-primary/80 glow">
                    <Plus className="mr-2 h-4 w-4" />
                    Accept Members
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="chat" className="space-y-4">
  <Card className="border-[#2a2a2a] bg-[#1a1a1a] h-[300px] flex flex-col">
    <CardContent className="flex-1 p-4 overflow-y-auto">
      <div className="space-y-4">
        {messages.map((message) => {
          const isCurrentUser = message.sender._id === currentUser._id;
          return (
            <div 
              key={message._id}
              className={`flex items-start gap-3 ${isCurrentUser ? "justify-end" : ""}`}
            >
              {!isCurrentUser && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.sender.image} alt={message.sender.name} />
                  <AvatarFallback className="bg-[#121212] text-primary text-xs">
                    {message.sender.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className={`p-3 rounded-lg max-w-[80%] ${
                isCurrentUser 
                  ? "bg-primary/20 rounded-tr-none" 
                  : "bg-[#121212] rounded-tl-none"
              }`}>
                <p className="text-xs text-gray-400 mb-1">
                  {isCurrentUser ? "You" : message.sender.name}
                </p>
                <p className="text-sm text-gray-200">{message.text}</p>
              </div>
              {isCurrentUser && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.image} alt="You" />
                  <AvatarFallback className="bg-[#121212] text-primary text-xs">
                    {currentUser.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          );
        })}
      </div>
    </CardContent>
    <CardFooter className="border-t border-[#2a2a2a] p-4">
      <div className="flex w-full gap-2">
        <Input
          placeholder="Type your message..."
          className="flex-1 bg-[#121212] border-[#2a2a2a]"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button 
          className="bg-primary hover:bg-primary/80"
          onClick={handleSend}
        >
          Send
        </Button>
      </div>
    </CardFooter>
  </Card>
</TabsContent>
            </Tabs>

            <DialogFooter className="flex justify-between items-center">
              <div className="flex gap-2">
                {selectedProject.technologies.map((tech) => (
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
