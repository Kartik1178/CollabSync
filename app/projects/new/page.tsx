"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardHeader } from "@/components/dashboard-header"
import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"

type Project = {
  id: string
  title: string
  description: string
  visibility: string
  tags: string[]
  createdAt: string
}

type User = {
  name: string
  email: string
}

// Modal to show project details after creation
function ProjectDetailsModal({
  project,
  onClose,
}: {
  project: Project
  onClose: () => void
}) {
  if (!project) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
        <p className="mb-4 text-muted-foreground">{project.description}</p>
        <div className="mb-4">
          <span className="font-semibold">Visibility:</span> {project.visibility}
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span key={tag} className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm">
              {tag}
            </span>
          ))}
        </div>
        <div className="text-xs text-muted-foreground mb-4">
          Created at: {new Date(project.createdAt).toLocaleString()}
        </div>
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  )
}

export default function NewProjectPage() {
  const [user, setUser] = useState<User | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [visibility, setVisibility] = useState("public")
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [createdProject, setCreatedProject] = useState<Project | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      window.location.href = "/login"
      return
    }
    setUser(JSON.parse(storedUser))
  }, [])

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentTag.trim() !== "") {
      e.preventDefault()
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()])
      }
      setCurrentTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  // Save project to localStorage
  const saveProject = (project: Project) => {
    const existing = localStorage.getItem("projects")
    const projects: Project[] = existing ? JSON.parse(existing) : []
    projects.push(project)
    localStorage.setItem("projects", JSON.stringify(projects))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your project.",
        variant: "destructive",
      })
      return
    }
    setIsLoading(true)
    try {
      const newProject: Project = {
        id: Date.now().toString(),
        title,
        description,
        visibility,
        tags,
        createdAt: new Date().toISOString(),
      }
      saveProject(newProject)
      setCreatedProject(newProject)
      setShowModal(true)
      toast({
        title: "Project created",
        description: `${title} has been created and saved locally.`,
      })
      // Optionally, reset form fields here
      setTitle("")
      setDescription("")
      setVisibility("public")
      setTags([])
      setCurrentTag("")
    } catch (error) {
      toast({
        title: "Failed to create project",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return null // Loading state or redirect handled by useEffect
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} />
      <main className="flex-1 container py-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Create New Project</h1>
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>
                  Provide information about your project to help others understand and collaborate.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter project title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your project"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select value={visibility} onValueChange={setVisibility}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="team">Team Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    {visibility === "public"
                      ? "Anyone can find and view this project"
                      : visibility === "private"
                        ? "Only you and collaborators can access this project"
                        : "Only team members can access this project"}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-primary hover:text-primary/80"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <Input
                    id="tags"
                    placeholder="Add tags (press Enter)"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={handleAddTag}
                  />
                  <p className="text-sm text-muted-foreground">
                    Add relevant technologies and skills to help others find your project
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Project"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
      {showModal && createdProject && (
        <ProjectDetailsModal
          project={createdProject}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
