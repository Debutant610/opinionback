import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
  }

  const { firstName, lastName, country, paymentMethod } = await req.json()

  const user = await db.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ message: "Utilisateur introuvable." }, { status: 404 })

  const profile = await db.profile.upsert({
    where: { userId: user.id },
    update: { firstName, lastName, country, paymentMethod },
    create: { userId: user.id, firstName, lastName, country, paymentMethod },
  })

  return NextResponse.json(profile)
}
