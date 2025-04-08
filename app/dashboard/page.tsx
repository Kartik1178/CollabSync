"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileCode, Plus, Users } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { ProjectCard } from "@/components/project-card"
import { EmptyState } from "@/components/empty-state"

// Sample project data
const sampleProjects = [
  {
    id: "1",
    title: "E-Commerce Platform",
    description: "A modern e-commerce platform with React and Node.js",
    tags: ["React", "Node.js", "MongoDB"],
    members: 4,
    lastUpdated: "2 days ago",
    isOwner: true,
  },
  {
    id: "2",
    title: "Task Management App",
    description: "A collaborative task management application",
    tags: ["TypeScript", "Next.js", "Prisma"],
    members: 2,
    lastUpdated: "5 hours ago",
    isOwner: true,
  },
  {
    id: "3",
    title: "Weather Dashboard",
    description: "Real-time weather dashboard with data visualization",
    tags: ["React", "D3.js", "API"],
    members: 3,
    lastUpdated: "1 week ago",
    isOwner: false,
  },
]

// Sample collaboration invites
const sampleInvites = [
  {
    id: "1",
    projectTitle: "AI Image Generator",
    from: "Sarah Johnson",
    date: "1 day ago",
  },
  {
    id: "2",
    projectTitle: "Blockchain Explorer",
    from: "Michael Chen",
    date: "3 days ago",
  },
]

export default function DashboardPage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [myProjects, setMyProjects] = useState(sampleProjects.filter((p) => p.isOwner))
  const [collaborations, setCollaborations] = useState(sampleProjects.filter((p) => !p.isOwner))
  const [invites, setInvites] = useState(sampleInvites)
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

  const handleAcceptInvite = (inviteId: string) => {
    // In a real app, you would make an API call to accept the invite
    // For demo purposes, we'll just remove it from the list
    setInvites(invites.filter((invite) => invite.id !== inviteId))
  }

  const handleDeclineInvite = (inviteId: string) => {
    // In a real app, you would make an API call to decline the invite
    // For demo purposes, we'll just remove it from the list
    setInvites(invites.filter((invite) => invite.id !== inviteId))
  }

  if (!user) {
    return null // Loading state or redirect handled by useEffect
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] cyber-grid">
      <DashboardHeader user={user} />

      <main className="flex-1 container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
          <Link href="/projects/new">
            <Button className="bg-primary hover:bg-primary/80 glow">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </Link>
        </div>

        {invites.length > 0 && (
          <Card className="mb-6 border-[#2a2a2a] bg-[#121212]">
            <CardHeader className="border-b border-[#2a2a2a]">
              <CardTitle className="text-primary">Collaboration Invites</CardTitle>
              <CardDescription className="text-gray-400">
                You have {invites.length} pending invitation{invites.length > 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 pt-4">
                {invites.map((invite) => (
                  <div
                    key={invite.id}
                    className="flex items-center justify-between border-b border-[#2a2a2a] pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium text-gray-200">{invite.projectTitle}</p>
                      <p className="text-sm text-gray-400">
                        From {invite.from} • {invite.date}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/80 glow-secondary"
                        onClick={() => handleAcceptInvite(invite.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#2a2a2a] hover:bg-[#1a1a1a] hover:text-gray-200"
                        onClick={() => handleDeclineInvite(invite.id)}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="my-projects">
          <TabsList className="mb-4 bg-[#121212] border border-[#2a2a2a] p-1">
            <TabsTrigger value="my-projects" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              My Projects
            </TabsTrigger>
            <TabsTrigger
              value="collaborations"
              className="data-[state=active]:bg-secondary data-[state=active]:text-white"
            >
              Collaborations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-projects">
            {myProjects.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {myProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<FileCode className="h-10 w-10 text-primary" />}
                title="No projects yet"
                description="Create your first project to get started"
                action={
                  <Link href="/projects/new">
                    <Button className="bg-primary hover:bg-primary/80 glow">
                      <Plus className="mr-2 h-4 w-4" />
                      New Project
                    </Button>
                  </Link>
                }
              />
            )}
          </TabsContent>

          <TabsContent value="collaborations">
            {collaborations.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {collaborations.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Users className="h-10 w-10 text-secondary" />}
                title="No collaborations yet"
                description="Join projects or accept invitations to collaborate"
                action={
                  <Link href="/explore">
                    <Button className="bg-secondary hover:bg-secondary/80 glow-secondary">Explore Projects</Button>
                  </Link>
                }
              />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

