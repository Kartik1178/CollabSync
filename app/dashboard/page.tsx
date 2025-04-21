"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import NewProjectPage from "../projects/new/page"

// Sample data for projects and invites
const sampleProjects = [
  { id: "1", title: "E-Commerce Platform", description: "A React & Node app", tags: ["React", "Node.js"], members: 4, lastUpdated: "2 days ago", isOwner: true },
  { id: "2", title: "Task App", description: "Collab task manager", tags: ["TypeScript", "Next.js"], members: 2, lastUpdated: "5 hours ago", isOwner: true },
  { id: "3", title: "Weather Dashboard", description: "Real-time weather", tags: ["React", "D3.js"], members: 3, lastUpdated: "1 week ago", isOwner: false },
]

const sampleInvites = [
  { id: "1", projectTitle: "AI Image Generator", from: "Sarah", date: "1 day ago" },
  { id: "2", projectTitle: "Blockchain Explorer", from: "Mike", date: "3 days ago" },
]

export default function DashboardPage() {
  const [invites, setInvites] = useState(sampleInvites)
  const [myProjects, setMyProjects] = useState(sampleProjects.filter(p => p.isOwner))
  const [collaborations, setCollaborations] = useState(sampleProjects.filter(p => !p.isOwner))
  const [activeTab, setActiveTab] = useState("my-projects")
  const [showNewProjectForm, setShowNewProjectForm] = useState(false)

  // Handle Invite Accept/Decline
  const handleAcceptInvite = (id: string) => setInvites(invites.filter(i => i.id !== id))
  const handleDeclineInvite = (id: string) => setInvites(invites.filter(i => i.id !== id))

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
        <Button className="bg-primary" size="sm" onClick={() => setShowNewProjectForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      {/* Conditional rendering using ternary operator */}
      {showNewProjectForm ? (
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <NewProjectPage />
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setShowNewProjectForm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Invites */}
          {invites.length > 0 && (
            <div className="mb-6 border border-[#2a2a2a] bg-[#121212] p-4 rounded">
              <h2 className="text-primary mb-2">Collaboration Invites ({invites.length})</h2>
              {invites.map(inv => (
                <div key={inv.id} className="flex justify-between items-center mb-2 border-b border-[#2a2a2a] pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{inv.projectTitle}</p>
                    <p className="text-sm text-gray-400">From {inv.from} • {inv.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-green-600" onClick={() => handleAcceptInvite(inv.id)}>Accept</Button>
                    <Button size="sm" variant="outline" className="border-[#2a2a2a]" onClick={() => handleDeclineInvite(inv.id)}>Decline</Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tabs */}
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList className="border border-[#2a2a2a] bg-[#121212] p-1 rounded">
              <TabsTrigger value="my-projects">My Projects</TabsTrigger>
              <TabsTrigger value="collaborations">Collaborations</TabsTrigger>
            </TabsList>
            <TabsContent value="my-projects">
              {myProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myProjects.map(p => (
                    <div key={p.id} className="border border-[#2a2a2a] bg-[#1a1a1a] p-4 rounded">
                      <h3 className="font-semibold mb-2">{p.title}</h3>
                      <p className="text-gray-400 mb-2">{p.description}</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {p.tags.map(tag => <span key={tag} className="text-xs bg-gray-700 px-2 py-1 rounded">{tag}</span>)}
                      </div>
                      <div className="text-sm text-gray-500">Members: {p.members} • Last updated: {p.lastUpdated}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 text-gray-400">No projects yet. Create your first project!</div>
              )}
            </TabsContent>
            <TabsContent value="collaborations">
              {collaborations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {collaborations.map(p => (
                    <div key={p.id} className="border border-[#2a2a2a] bg-[#1a1a1a] p-4 rounded">
                      <h3 className="font-semibold mb-2">{p.title}</h3>
                      <p className="text-gray-400 mb-2">{p.description}</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {p.tags.map(tag => <span key={tag} className="text-xs bg-gray-700 px-2 py-1 rounded">{tag}</span>)}
                      </div>
                      <div className="text-sm text-gray-500">Members: {p.members} • Last updated: {p.lastUpdated}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 text-gray-400">No collaborations yet. Join or create projects!</div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
