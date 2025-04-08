import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// Get all projects (with filtering)
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const query = searchParams.get("query") || ""
    const tags = searchParams.get("tags")?.split(",") || []
    const visibility = searchParams.get("visibility") || "public"

    // Build filter conditions
    const whereConditions: any = {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    }

    // Add tag filtering if tags are provided
    if (tags.length > 0) {
      whereConditions.tags = {
        some: {
          name: {
            in: tags,
          },
        },
      }
    }

    // For public projects or user's own projects
    if (visibility === "public") {
      whereConditions.visibility = "public"
    } else if (visibility === "own") {
      whereConditions.ownerId = session.user.id
    } else if (visibility === "member") {
      whereConditions.OR = [{ ownerId: session.user.id }, { members: { some: { userId: session.user.id } } }]
    }

    const projects = await prisma.project.findMany({
      where: whereConditions,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        members: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            role: true,
          },
        },
        tags: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            members: true,
            tasks: true,
            discussions: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    // Transform the data for the frontend
    const transformedProjects = projects.map((project) => ({
      id: project.id,
      title: project.title,
      description: project.description,
      visibility: project.visibility,
      owner: project.owner,
      isOwner: project.ownerId === session.user.id,
      members: project._count.members,
      tags: project.tags.map((tag) => tag.name),
      tasks: project._count.tasks,
      discussions: project._count.discussions,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }))

    return NextResponse.json(transformedProjects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "An error occurred while fetching projects" }, { status: 500 })
  }
}

// Create a new project
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, visibility, tags } = await req.json()

    // Validate input
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    // Create project with tags
    const project = await prisma.project.create({
      data: {
        title,
        description,
        visibility: visibility || "public",
        owner: {
          connect: {
            id: session.user.id,
          },
        },
        // Add the owner as a member with role "owner"
        members: {
          create: {
            userId: session.user.id,
            role: "owner",
          },
        },
        // Create tags if provided
        tags:
          tags && tags.length > 0
            ? {
                create: tags.map((tag: string) => ({
                  name: tag,
                })),
              }
            : undefined,
      },
      include: {
        tags: true,
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "An error occurred while creating the project" }, { status: 500 })
  }
}

