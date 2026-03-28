import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import crypto from "crypto"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  // @ts-ignore
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
  }

  const { email, expiresInDays = 7 } = await req.json()

  // Générer un token sécurisé aléatoire
  const token = crypto.randomBytes(16).toString("hex").toUpperCase().slice(0, 16)
  const formattedToken = `${token.slice(0, 4)}-${token.slice(4, 8)}-${token.slice(8, 12)}-${token.slice(12, 16)}`

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + expiresInDays)

  const invitation = await db.invitation.create({
    data: {
      email: email || `open-${Date.now()}@opinback.io`, // Email fictif pour liens ouverts
      token: formattedToken,
      expiresAt,
    },
  })

  return NextResponse.json(invitation, { status: 201 })
}
