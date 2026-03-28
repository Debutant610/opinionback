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

  const { action } = await req.json() // 'APPROVED' | 'REJECTED'

  const withdrawal = await db.withdrawal.update({
    where: { id: params.id },
    data: {
      status: action === "APPROVED" ? "APPROVED" : "REJECTED",
      processedAt: new Date(),
    },
  })

  return NextResponse.json(withdrawal)
}
