"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// Create a new project
export async function createProject(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return { error: "Unauthorized" }
    }

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const visibility = formData.get("visibility") as string
    const tagsString = formData.get("tags") as string

    if (!title) {
      return { error: "Title is required" }
    }

    // Parse tags
    const tags = tagsString
      ? tagsString
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : []

    // Create project
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
          tags.length > 0
            ? {
                create: tags.map((tag) => ({
                  name: tag,
                })),
              }
            : undefined,
      },
    })

    revalidatePath("/dashboard")

    return { success: true, projectId: project.id }
  } catch (error) {
    console.error("Error creating project:", error)
    return { error: "An error occurred while creating the project" }
  }
}

// Update a project
export async function updateProject(projectId: string, formData: FormData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return { error: "Unauthorized" }
    }

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const visibility = formData.get("visibility") as string
    const tagsString = formData.get("tags") as string

    if (!title) {
      return { error: "Title is required" }
    }

    // Check if project exists and user is an admin or owner
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        members: {
          where: {
            userId: session.user.id,
            role: {
              in: ["owner", "admin"],
            },
          },
        },
      },
    })

    if (!project) {
      return { error: "Project not found" }
    }

    // Check if user has permission to update the project
    if (project.members.length === 0) {
      return { error: "You don't have permission to update this project" }
    }

    // Parse tags
    const tags = tagsString
      ? tagsString
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : []

    // Update project
    await prisma.project.update({
      where: {
        id: projectId\
      },  : []
    
    // Update project
    await prisma.project.update({
      where: {
        id: projectId
      },
      data: {
        title,
        description,
        visibility
      }
    })

    // Update tags
    // First delete existing tags
    await prisma.projectTag.deleteMany({
      where: {
        projectId,
      },
    })

    // Then create new tags
    if (tags.length > 0) {
      await prisma.projectTag.createMany({
        data: tags.map((tag) => ({
          projectId,
          name: tag,
        })),
      })
    }

    revalidatePath(`/projects/${projectId}`)
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error updating project:", error)
    return { error: "An error occurred while updating the project" }
  }
}

// Create a new task
export async function createTask(projectId: string, formData: FormData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return { error: "Unauthorized" }
    }

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const assigneeId = (formData.get("assigneeId") as string) || null

    if (!title) {
      return { error: "Title is required" }
    }

    // Check if project exists and user is a member
    const projectMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: session.user.id,
        },
      },
    })

    if (!projectMember) {
      return { error: "You don't have permission to create tasks for this project" }
    }

    // Create task
    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId,
        assigneeId: assigneeId || null,
      },
    })

    revalidatePath(`/projects/${projectId}`)

    return { success: true, taskId: task.id }
  } catch (error) {
    console.error("Error creating task:", error)
    return { error: "An error occurred while creating the task" }
  }
}

// Accept an invitation
export async function acceptInvitation(invitationId: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return { error: "Unauthorized" }
    }

    // Find invitation
    const invitation = await prisma.projectInvitation.findUnique({
      where: {
        id: invitationId,
      },
    })

    if (!invitation) {
      return { error: "Invitation not found" }
    }

    // Check if invitation belongs to the user
    if (invitation.userId !== session.user.id) {
      return { error: "You don't have permission to accept this invitation" }
    }

    // Update invitation status
    await prisma.projectInvitation.update({
      where: {
        id: invitationId,
      },
      data: {
        status: "accepted",
      },
    })

    // Add user as a project member
    await prisma.projectMember.create({
      data: {
        projectId: invitation.projectId,
        userId: invitation.userId,
        role: "member",
      },
    })

    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error accepting invitation:", error)
    return { error: "An error occurred while accepting the invitation" }
  }
}

// Decline an invitation
export async function declineInvitation(invitationId: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return { error: "Unauthorized" }
    }

    // Find invitation
    const invitation = await prisma.projectInvitation.findUnique({
      where: {
        id: invitationId,
      },
    })

    if (!invitation) {
      return { error: "Invitation not found" }
    }

    // Check if invitation belongs to the user
    if (invitation.userId !== session.user.id) {
      return { error: "You don't have permission to decline this invitation" }
    }

    // Update invitation status
    await prisma.projectInvitation.update({
      where: {
        id: invitationId,
      },
      data: {
        status: "declined",
      },
    })

    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error declining invitation:", error)
    return { error: "An error occurred while declining the invitation" }
  }
}

// Invite a user to a project
export async function inviteUserToProject(projectId: string, formData: FormData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return { error: "Unauthorized" }
    }

    const email = formData.get("email") as string

    if (!email) {
      return { error: "Email is required" }
    }

    // Check if project exists and user is an admin or owner
    const projectMember = await prisma.projectMember.findFirst({
      where: {
        projectId,
        userId: session.user.id,
        role: {
          in: ["owner", "admin"],
        },
      },
    })

    if (!projectMember) {
      return { error: "You don't have permission to invite users to this project" }
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return { error: "User not found" }
    }

    // Check if user is already a member
    const existingMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: user.id,
        },
      },
    })

    if (existingMember) {
      return { error: "User is already a member of this project" }
    }

    // Check if invitation already exists
    const existingInvitation = await prisma.projectInvitation.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: user.id,
        },
      },
    })

    if (existingInvitation && existingInvitation.status === "pending") {
      return { error: "Invitation already sent to this user" }
    }

    // Create or update invitation
    await prisma.projectInvitation.upsert({
      where: {
        projectId_userId: {
          projectId,
          userId: user.id,
        },
      },
      update: {
        status: "pending",
      },
      create: {
        projectId,
        userId: user.id,
      },
    })

    revalidatePath(`/projects/${projectId}`)

    return { success: true }
  } catch (error) {
    console.error("Error inviting user:", error)
    return { error: "An error occurred while inviting the user" }
  }
}

// Get user's invitations
export async function getUserInvitations() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return { error: "Unauthorized" }
    }

    const invitations = await prisma.projectInvitation.findMany({
      where: {
        userId: session.user.id,
        status: "pending",
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            description: true,
            owner: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return { invitations }
  } catch (error) {
    console.error("Error fetching invitations:", error)
    return { error: "An error occurred while fetching invitations" }
  }
}

