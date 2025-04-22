"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, FileText, User, Calendar, Mail, Edit } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

interface UserProfile {
  id: string
  name: string
  email: string
  age: number
  avatar?: string
  resume: string
  technologies: string[]
  bio?: string
  completedProjects?: number
  activeProjects?: number
  experienceLevel?: string
  skills?: {
    category: string
    items: {
      name: string
      level: number
    }[]
  }[]
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        })

        const user = res.data.user
        const transformed: UserProfile = {
          id: user.id,
          name: user.name,
          email: user.email,
          age: user.age,
          resume: user.resume,
          avatar: "/placeholder.svg",
          technologies: user.technologies,
          bio: "Enthusiastic learner and aspiring developer!",
          experienceLevel: "Junior Developer",
          completedProjects: 2,
          activeProjects: 1,
          skills: [
            {
              category: "Technologies",
              items: user.technologies.map((tech: string) => ({
                name: tech,
                level: 60,
              })),
            },
          ],
        }

        setProfile(transformed)
      } catch (err) {
        console.error("Error fetching profile:", err)
        router.push("/login")
      }
    }

    fetchProfile()
  }, [router])

  if (!profile) {
    return <div className="text-center text-white mt-20">Loading profile...</div>
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] cyber-grid p-4 md:p-8">
      <Link href="/dashboard" className="absolute top-8 left-8 flex items-center gap-2 font-bold text-xl">
        <Zap className="h-6 w-6 text-primary animate-pulse" />
        <span className="gradient-text">COLLABSYNC</span>
      </Link>

      <div className="max-w-6xl mx-auto mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-[#2a2a2a] bg-[#121212] neon-border md:col-span-1">
            <CardHeader className="flex flex-col items-center">
              <div className="relative mb-4">
                <Avatar className="h-24 w-24 border-2 border-primary animate-pulse-glow">
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback className="bg-[#1a1a1a] text-primary text-xl">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full bg-[#1a1a1a] border-primary"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="h-4 w-4 text-primary" />
                </Button>
              </div>
              <CardTitle className="text-2xl font-bold gradient-text">{profile.name}</CardTitle>
              <CardDescription className="text-gray-400">{profile.experienceLevel}</CardDescription>
              <div className="flex gap-2 mt-2">
                {profile.technologies.slice(0, 3).map((tech) => (
                  <Badge key={tech} variant="outline" className="border-primary text-primary">
                    {tech}
                  </Badge>
                ))}
                {profile.technologies.length > 3 && (
                  <Badge variant="outline" className="border-primary text-primary">
                    +{profile.technologies.length - 3}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <User className="h-4 w-4" />
                  <span>Age: {profile.age}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail className="h-4 w-4" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Projects: {profile.activeProjects} active, {profile.completedProjects} completed
                  </span>
                </div>
              </div>
              <div className="pt-2">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Bio</h4>
                <p className="text-sm text-gray-400">{profile.bio}</p>
              </div>
              <Button
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/10"
                onClick={() => window.open(profile.resume, "_blank")}
              >
                <FileText className="mr-2 h-4 w-4" />
                Download Resume
              </Button>
            </CardContent>
          </Card>

          <Card className="border-[#2a2a2a] bg-[#121212] neon-border md:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl font-bold gradient-text">Technical Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={profile.skills?.[0].category ?? "Technologies"}>
                <TabsList className="grid grid-cols-1 sm:grid-cols-3 mb-4">
                  {profile.skills?.map((skillGroup) => (
                    <TabsTrigger
                      key={skillGroup.category}
                      value={skillGroup.category}
                      className="data-[state=active]:bg-primary data-[state=active]:text-white"
                    >
                      {skillGroup.category}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {profile.skills?.map((skillGroup) => (
                  <TabsContent key={skillGroup.category} value={skillGroup.category} className="space-y-4">
                    {skillGroup.items.map((skill) => (
                      <div key={skill.name} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-300">{skill.name}</span>
                          <span className="text-sm text-gray-400">{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} className="h-2 bg-[#2a2a2a]" />
                      </div>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                variant="default"
                className="bg-primary hover:bg-primary/80 glow"
                onClick={() => router.push("/dashboard")}
              >
                View Projects
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
