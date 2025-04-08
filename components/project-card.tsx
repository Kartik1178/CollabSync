import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Users } from "lucide-react"

interface ProjectCardProps {
  project: {
    id: string
    title: string
    description: string
    tags: string[]
    members: number
    lastUpdated: string
    isOwner?: boolean
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="h-full overflow-hidden border-[#2a2a2a] bg-[#121212] hover:border-primary/50 transition-all hover:shadow-md hover:shadow-primary/20">
        <CardHeader className="pb-2 border-b border-[#2a2a2a]">
          <CardTitle className="flex items-center justify-between">
            <span className="text-gray-200">{project.title}</span>
            {project.isOwner && (
              <Badge variant="outline" className="ml-2 border-primary/50 text-primary">
                Owner
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-sm text-gray-400 line-clamp-2 h-10">{project.description}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {project.tags.slice(0, 3).map((tag, index) => {
              // Alternate colors for tags
              const colors = [
                "bg-primary/10 text-primary",
                "bg-secondary/10 text-secondary",
                "bg-accent/10 text-accent",
              ]
              const colorClass = colors[index % colors.length]

              return (
                <Badge key={tag} variant="secondary" className={`text-xs ${colorClass}`}>
                  {tag}
                </Badge>
              )
            })}
            {project.tags.length > 3 && (
              <Badge variant="outline" className="text-xs border-[#2a2a2a] text-gray-400">
                +{project.tags.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="text-xs text-gray-500 border-t border-[#2a2a2a] pt-4 flex justify-between">
          <div className="flex items-center">
            <Users className="h-3.5 w-3.5 mr-1 text-primary" />
            <span>
              {project.members} member{project.members !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1 text-secondary" />
            <span>Updated {project.lastUpdated}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

