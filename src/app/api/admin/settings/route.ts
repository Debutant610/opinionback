import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  // @ts-ignore
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  try {
    const settings = await db.settings.findUnique({
      where: { id: "global" }
    });
    
    return NextResponse.json(settings || {});
  } catch (error) {
    return NextResponse.json({ message: "Erreur lors de la récupération des paramètres" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  // @ts-ignore
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const { brokerApiKey, brokerPassword, brokerUrl } = data;

    const settings = await db.settings.upsert({
      where: { id: "global" },
      update: { brokerApiKey, brokerPassword, brokerUrl },
      create: { id: "global", brokerApiKey, brokerPassword, brokerUrl }
    });

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ message: "Erreur lors de la mise à jour des paramètres" }, { status: 500 });
  }
}
