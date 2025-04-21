import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

// Define the shape of your formData prop
interface FormData {
  technologies: string[]
  // add other fields if needed
}

interface TechnologySelectorProps {
  formData: FormData
  setFormData: (data: FormData) => void
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

export default function TechnologySelector({ formData, setFormData }: TechnologySelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <Label>Select Technologies</Label>
      {/* Category List */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.keys(TECHNOLOGY_CATEGORIES).map((category) => (
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

      {/* Technologies for the selected category */}
      {selectedCategory && (
        <div>
          <Label className="mb-2 block">{selectedCategory}</Label>
          <div className="grid grid-cols-2 gap-2">
            {TECHNOLOGY_CATEGORIES[selectedCategory].map((tech) => (
              <Button
                key={tech}
                variant={formData.technologies.includes(tech) ? "default" : "outline"}
                type="button"
                onClick={() => {
                  const isSelected = formData.technologies.includes(tech)
                  const updatedTechnologies = isSelected
                    ? formData.technologies.filter((t) => t !== tech)
                    : [...formData.technologies, tech]
                  setFormData({ ...formData, technologies: updatedTechnologies })
                }}
              >
                {tech}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
