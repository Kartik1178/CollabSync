import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// Get project invitations
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projectId = params.id

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
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Check if user has permission to view invitations
    if (project.members.length === 0) {
      return NextResponse.json(
        { error: "You don't have permission to view invitations for this project" },
        { status: 403 },
      )
    }

    // Get invitations
    const invitations = await prisma.projectInvitation.findMany({
      where: {
        projectId,
      },
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
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(invitations)
  } catch (error) {
    console.error("Error fetching project invitations:", error)
    return NextResponse.json({ error: "An error occurred while fetching project invitations" }, { status: 500 })
  }
}

// Create a new invitation
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projectId = params.id
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
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
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Check if user has permission to send invitations
    if (project.members.length === 0) {
      return NextResponse.json(
        { error: "You don't have permission to send invitations for this project" },
        { status: 403 },
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
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
      return NextResponse.json({ error: "User is already a member of this project" }, { status: 409 })
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

    if (existingInvitation) {
      return NextResponse.json({ error: "Invitation already sent to this user" }, { status: 409 })
    }

    // Create invitation
    const invitation = await prisma.projectInvitation.create({
      data: {
        projectId,
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        project: {
          select: {
            title: true,
          },
        },
      },
    })

    // In a real app, you would send an email notification here

    return NextResponse.json(invitation, { status: 201 })
  } catch (error) {
    console.error("Error creating project invitation:", error)
    return NextResponse.json({ error: "An error occurred while creating the project invitation" }, { status: 500 })
  }
}

