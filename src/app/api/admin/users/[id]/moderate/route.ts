import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  // @ts-ignore
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
  }

  const { action, reason, suspendedUntil } = await req.json()
  // action: 'BAN' | 'SUSPEND' | 'RESTORE'

  let updateData: any = {}

  if (action === "BAN") {
    updateData = {
      status: "BANNED",
      banReason: reason || "Utilisation de robot ou comportement interdit",
    }
  } else if (action === "SUSPEND") {
    updateData = {
      status: "SUSPENDED",
      banReason: reason || "Suspension temporaire",
      suspendedUntil: suspendedUntil ? new Date(suspendedUntil) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours par défaut
    }
  } else if (action === "RESTORE") {
    updateData = {
      status: "DEMO",
      banReason: null,
      suspendedUntil: null,
    }
  }

  const user = await db.user.update({
    where: { id: params.id },
    data: updateData,
  })

  return NextResponse.json({ id: user.id, status: user.status })
}
