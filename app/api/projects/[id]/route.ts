import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// Get a specific project
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projectId = params.id

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        tags: true,
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        },
        discussions: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            _count: {
              select: {
                comments: true,
              },
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        },
        repositories: true,
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Check if user has access to the project
    const isMember = project.members.some((member) => member.user.id === session.user.id)
    const isPublic = project.visibility === "public"

    if (!isMember && !isPublic) {
      return NextResponse.json({ error: "You don't have access to this project" }, { status: 403 })
    }

    // Transform the data for the frontend
    const transformedProject = {
      id: project.id,
      title: project.title,
      description: project.description,
      visibility: project.visibility,
      owner: project.owner,
      isOwner: project.ownerId === session.user.id,
      isMember: isMember,
      members: project.members.map((member) => ({
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
        image: member.user.image,
        role: member.role,
      })),
      tags: project.tags.map((tag) => tag.name),
      tasks: project.tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        assignee: task.assignee,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      })),
      discussions: project.discussions.map((discussion) => ({
        id: discussion.id,
        title: discussion.title,
        content: discussion.content,
        author: discussion.author,
        comments: discussion._count.comments,
        createdAt: discussion.createdAt,
        updatedAt: discussion.updatedAt,
      })),
      repositories: project.repositories,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }

    return NextResponse.json(transformedProject)
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "An error occurred while fetching the project" }, { status: 500 })
  }
}

// Update a project
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projectId = params.id
    const { title, description, visibility, tags } = await req.json()

    // Check if project exists and user is the owner
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        members: true,
        tags: true,
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Check if user is the owner or an admin
    const userMembership = project.members.find(
      (member) => member.userId === session.user.id && (member.role === "owner" || member.role === "admin"),
    )

    if (!userMembership) {
      return NextResponse.json({ error: "You don't have permission to update this project" }, { status: 403 })
    }

    // Update project
    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        title: title || project.title,
        description: description !== undefined ? description : project.description,
        visibility: visibility || project.visibility,
      },
      include: {
        tags: true,
      },
    })

    // Update tags if provided
    if (tags && Array.isArray(tags)) {
      // Delete existing tags
      await prisma.projectTag.deleteMany({
        where: {
          projectId,
        },
      })

      // Create new tags
      if (tags.length > 0) {
        await prisma.projectTag.createMany({
          data: tags.map((tag) => ({
            projectId,
            name: tag,
          })),
        })
      }

      // Fetch updated project with new tags
      const projectWithTags = await prisma.project.findUnique({
        where: {
          id: projectId,
        },
        include: {
          tags: true,
        },
      })

      return NextResponse.json(projectWithTags)
    }

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "An error occurred while updating the project" }, { status: 500 })
  }
}

// Delete a project
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projectId = params.id

    // Check if project exists and user is the owner
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        members: {
          where: {
            userId: session.user.id,
            role: "owner",
          },
        },
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Check if user is the owner
    if (project.members.length === 0) {
      return NextResponse.json({ error: "You don't have permission to delete this project" }, { status: 403 })
    }

    // Delete project (cascade will delete related records)
    await prisma.project.delete({
      where: {
        id: projectId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "An error occurred while deleting the project" }, { status: 500 })
  }
}

