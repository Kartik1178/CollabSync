"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

enum RegisterStep {
  INITIAL = 1,
  RESUME = 2,
  TECHNOLOGIES = 3
}

const TECHNOLOGY_CATEGORIES: Record<string, string[]> = {
  "Programming Languages": [
    "C", "C++", "Java", "Python", "R", "SQL"
  ],
  "Cloud Platforms": [
    "AWS", "Azure", "Google Cloud", "IBM Watson"
  ],
  "Machine Learning & AI": [
    "AI", "Machine Learning", "Deep Learning", "NLP", "Scikit-learn", "TensorFlow", "PyTorch", "Cognitive Services"
  ],
  "Data & Analytics": [
    "Data Mining", "Data Visualization", "Spark", "Hadoop"
  ],
  "Cybersecurity": [
    "Cryptography", "Ethical Hacking", "Penetration Testing", "Firewalls", "Network Security"
  ],
  "DevOps & Infrastructure": [
    "DevOps", "Docker", "Kubernetes", "Terraform", "System Administration", "Linux", "System Design"
  ],
  "Blockchain & Web3": [
    "Blockchain", "Ethereum", "Smart Contracts", "Solidity"
  ],
  "Game Development & 3D": [
    "Unity", "Unreal Engine", "Game Design", "3D Modelling"
  ],
  "Software Development Practices": [
    "Agile", "Git", "Software Testing"
  ],
  "Other Tech Roles": [
    "IT Support", "Networking"
  ]
}

interface FormData {
  name: string
  email: string
  password: string
  age: string
  resume: File | null
  technologies: string[]
}

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState<RegisterStep>(RegisterStep.INITIAL)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    age: "",
    resume: null,
    technologies: []
  })
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      switch (currentStep) {
        case RegisterStep.INITIAL:
          await handleInitialRegistration()
          setCurrentStep(RegisterStep.RESUME)
          break

        case RegisterStep.RESUME:
          await handleResumeUpload()
          setCurrentStep(RegisterStep.TECHNOLOGIES)
          break

        case RegisterStep.TECHNOLOGIES:
          await handleTechnologySelection()
          router.push("/dashboard")
          break
      }
    } catch (error) {
      toast({
        title: "Registration error",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInitialRegistration = async () => {
    const response = await fetch("http://localhost:5000/api/auth/register/initial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        age: Number(formData.age)
      }),
      credentials: "include"
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message)
    }
  }

  const handleResumeUpload = async () => {
    if (!formData.resume) throw new Error("Resume required")

    const form = new FormData()
    form.append("resume", formData.resume)

    const response = await fetch("http://localhost:5000/api/auth/register/resume", {
      method: "PUT",
      body: form,
      credentials: "include"
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message)
    }
  }

  const handleTechnologySelection = async () => {
    const response = await fetch("http://localhost:5000/api/auth/register/technologies", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ technologies: formData.technologies }),
      credentials: "include"
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case RegisterStep.INITIAL:
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                required
              />
            </div>
          </>
        )

      case RegisterStep.RESUME:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Upload Resume (PDF/DOCX)</Label>
              <Input
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => setFormData({
                  ...formData,
                  resume: e.target.files?.[0] || null
                })}
                required
              />
            </div>
          </div>
        )

      case RegisterStep.TECHNOLOGIES:
        return (
          <div className="space-y-4">
            <Label>Select Technologies</Label>
            {/* Category Buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.keys(TECHNOLOGY_CATEGORIES).map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
            {/* Technology Buttons for selected category */}
            {selectedCategory && (
              <>
                <Label className="mb-2 block">{selectedCategory}</Label>
                <div className="grid grid-cols-2 gap-2">
                  {TECHNOLOGY_CATEGORIES[selectedCategory].map((tech) => (
                    <Button
                      key={tech}
                      variant={formData.technologies.includes(tech) ? "default" : "outline"}
                      type="button"
                      onClick={() => {
                        const technologies = formData.technologies.includes(tech)
                          ? formData.technologies.filter(t => t !== tech)
                          : [...formData.technologies, tech]
                        setFormData({ ...formData, technologies })
                      }}
                    >
                      {tech}
                    </Button>
                  ))}
                </div>
              </>
            )}
          </div>
        )
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#0a0a0a] cyber-grid">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 font-bold text-xl">
        <Zap className="h-6 w-6 text-primary animate-pulse" />
        <span className="gradient-text">COLLABSYNC</span>
      </Link>

      <Card className="w-full max-w-md border-[#2a2a2a] bg-[#121212] neon-border">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold gradient-text">
            {currentStep === RegisterStep.INITIAL && "Create Account"}
            {currentStep === RegisterStep.RESUME && "Upload Resume"}
            {currentStep === RegisterStep.TECHNOLOGIES && "Select Technologies"}
          </CardTitle>
          <CardDescription className="text-gray-400">
            Step {currentStep} of 3
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {renderStepContent()}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/80 glow"
              disabled={isLoading || (currentStep === RegisterStep.TECHNOLOGIES && formData.technologies.length === 0)}
            >
              {isLoading ? "Processing..." :
                currentStep === RegisterStep.TECHNOLOGIES ? "Complete Registration" : "Continue"}
            </Button>
            {currentStep === RegisterStep.INITIAL && (
              <div className="text-center text-sm text-gray-400">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:text-primary/80">
                  Login
                </Link>
              </div>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
