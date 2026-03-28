import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// POST — Enregistrer un trade sur un compte
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
  }

  const { accountId, asset, entryPrice, exitPrice, profitLoss } = await req.json()

  if (!accountId || !asset || !entryPrice) {
    return NextResponse.json({ message: "accountId, asset et entryPrice sont requis." }, { status: 400 })
  }

  // Vérifier que le compte appartient à l'utilisateur
  const user = await db.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ message: "Utilisateur introuvable." }, { status: 404 })

  const account = await db.account.findFirst({ where: { id: accountId, userId: user.id } })
  if (!account) return NextResponse.json({ message: "Compte non trouvé." }, { status: 404 })

  const status = exitPrice ? "CLOSED" : "OPEN"

  const trade = await db.trade.create({
    data: {
      accountId,
      asset,
      entryPrice: parseFloat(entryPrice),
      exitPrice: exitPrice ? parseFloat(exitPrice) : null,
      profitLoss: profitLoss ? parseFloat(profitLoss) : null,
      status,
      closedAt: exitPrice ? new Date() : null,
    }
  })

  // Si le trade est fermé, vérifier le drawdown
  if (status === "CLOSED" && profitLoss && parseFloat(profitLoss) < 0) {
    const newBalance = account.balance + parseFloat(profitLoss)
    await db.account.update({
      where: { id: accountId },
      data: {
        balance: newBalance,
        status: account.maxDrawdown > 0 && newBalance < (account.balance * (1 - account.maxDrawdown / 100))
          ? "LIQUIDATED"
          : "ACTIVE"
      }
    })
  }

  return NextResponse.json(trade, { status: 201 })
}
