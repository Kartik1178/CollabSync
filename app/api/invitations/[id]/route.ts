import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// Update invitation status (accept/decline)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const invitationId = params.id
    const { status } = await req.json()

    if (!status || !["accepted", "declined"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Find invitation
    const invitation = await prisma.projectInvitation.findUnique({
      where: {
        id: invitationId,
      },
    })

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 })
    }

    // Check if invitation belongs to the user
    if (invitation.userId !== session.user.id) {
      return NextResponse.json({ error: "You don't have permission to update this invitation" }, { status: 403 })
    }

    // Update invitation status
    const updatedInvitation = await prisma.projectInvitation.update({
      where: {
        id: invitationId,
      },
      data: {
        status,
      },
    })

    // If accepted, add user as a project member
    if (status === "accepted") {
      await prisma.projectMember.create({
        data: {
          projectId: invitation.projectId,
          userId: invitation.userId,
          role: "member",
        },
      })
    }

    return NextResponse.json(updatedInvitation)
  } catch (error) {
    console.error("Error updating invitation:", error)
    return NextResponse.json({ error: "An error occurred while updating the invitation" }, { status: 500 })
  }
}

