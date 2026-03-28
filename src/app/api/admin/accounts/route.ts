import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// POST /api/admin/accounts — Créer ou mettre à jour un compte (capital, drawdown, objectif)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  // @ts-ignore
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
  }

  const { userId, type, balance, maxDrawdown, profitTarget } = await req.json()

  if (!userId || !type) {
    return NextResponse.json({ message: "userId et type sont requis." }, { status: 400 })
  }

  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) return NextResponse.json({ message: "Trader introuvable." }, { status: 404 })

  const account = await db.account.create({
    data: {
      userId,
      type,
      balance: parseFloat(balance) || 0,
      maxDrawdown: parseFloat(maxDrawdown) || 0,
      profitTarget: parseFloat(profitTarget) || 0,
      status: "ACTIVE",
    }
  })

  // Si c'est un compte FUNDED, mettre à jour le statut du trader
  if (type === "FUNDED") {
    await db.user.update({
      where: { id: userId },
      data: { status: "FUNDED" }
    })
  } else if (type === "DEMO" && user.status === "PENDING") {
    await db.user.update({
      where: { id: userId },
      data: { status: "DEMO" }
    })
  }

  return NextResponse.json(account, { status: 201 })
}
