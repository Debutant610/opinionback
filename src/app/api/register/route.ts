import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password, token } = await req.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { message: "Tous les champs (prénom, nom, email, mot de passe) sont requis." },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Un compte existe déjà avec cet e-mail." },
        { status: 409 }
      );
    }

    // Hashage du mot de passe
    const passwordHash = await bcrypt.hash(password, 10);

    // Vérification du token d'invitation (Optionnel)
    let role = "TRADER";
    // Pour l'instant, validation simple du token si fourni
    if (token) {
      const invitation = await db.invitation.findUnique({
        where: { token },
      });
      if (!invitation || invitation.isUsed || invitation.expiresAt < new Date()) {
        return NextResponse.json(
          { message: "Le code d'invitation est invalide ou expiré." },
          { status: 400 }
        );
      }
      
      // Marquer comme utilisé
      await db.invitation.update({
        where: { id: invitation.id },
        data: { isUsed: true }
      });
    }

    // Création du User + Profile
    const user = await db.user.create({
      data: {
        email,
        passwordHash,
        status: "PENDING", // En attente de complétion du profil ou de vérification
        profile: {
          create: {
            firstName,
            lastName,
          }
        }
      },
      include: {
        profile: true
      }
    });

    return NextResponse.json(
      { message: "Compte créé avec succès.", user: { email: user.email, id: user.id } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur Inscription:", error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de l'inscription." },
      { status: 500 }
    );
  }
}
