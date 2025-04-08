import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// Get project members
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projectId = params.id

    // Check if project exists and user has access
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
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
    const members = project.members.map((member) => ({
      id: member.user.id,
      name: member.user.name,
      email: member.user.email,
      image: member.user.image,
      role: member.role,
      joinedAt: member.joinedAt,
    }))

    return NextResponse.json(members)
  } catch (error) {
    console.error("Error fetching project members:", error)
    return NextResponse.json({ error: "An error occurred while fetching project members" }, { status: 500 })
  }
}

// Add a member to the project
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projectId = params.id
    const { userId, role } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
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

    // Check if user has permission to add members
    if (project.members.length === 0) {
      return NextResponse.json({ error: "You don't have permission to add members to this project" }, { status: 403 })
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
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
          userId,
        },
      },
    })

    if (existingMember) {
      return NextResponse.json({ error: "User is already a member of this project" }, { status: 409 })
    }

    // Add user as a member
    const member = await prisma.projectMember.create({
      data: {
        projectId,
        userId,
        role: role || "member",
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
    })

    return NextResponse.json(member, { status: 201 })
  } catch (error) {
    console.error("Error adding project member:", error)
    return NextResponse.json({ error: "An error occurred while adding the project member" }, { status: 500 })
  }
}

