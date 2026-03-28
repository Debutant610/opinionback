import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  // @ts-ignore
  if (!session || session.user.role !== "TRADER") {
    return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
  }

  const { amount } = await req.json()

  if (!amount || amount < 50) {
    return NextResponse.json(
      { message: "Le montant minimum est de 50€." },
      { status: 400 }
    )
  }

  // @ts-ignore
  const user = await db.user.findUnique({ where: { email: session.user.email }, include: { accounts: true } })
  if (!user) return NextResponse.json({ message: "Utilisateur introuvable." }, { status: 404 })

  const totalFundedBalance = user.accounts
    .filter(a => a.type === "FUNDED")
    .reduce((acc, curr) => acc + curr.balance, 0)

  if (amount > totalFundedBalance) {
    return NextResponse.json(
      { message: "Le montant dépasse votre solde disponible." },
      { status: 400 }
    )
  }

  const withdrawal = await db.withdrawal.create({
    data: { userId: user.id, amount: parseFloat(amount) },
  })

  return NextResponse.json(withdrawal, { status: 201 })
}
