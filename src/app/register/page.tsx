"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (res.ok) {
        toast.success("Compte créé avec succès ! Connectez-vous maintenant.")
        router.push("/login")
      } else {
        toast.error(result.message || "Une erreur est survenue.")
      }
    } catch (error) {
      toast.error("Erreur de connexion au serveur.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background relative overflow-hidden py-12">
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="absolute top-8 left-8 z-10">
        <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground transition-colors group">
          <Link href="/"><ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform"/> Retour</Link>
        </Button>
      </div>

      <div className="w-full max-w-md p-8 rounded-[2rem] bg-card/80 border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative z-10 backdrop-blur-2xl animate-fade-in-up">
        <div className="text-center mb-10">
          <img src="/logo.png" alt="Logo" className="h-16 w-auto mx-auto mb-6 drop-shadow-2xl" />
          <h1 className="font-outfit text-3xl font-bold tracking-tight mb-2">Créer un compte</h1>
          <p className="text-sm text-muted-foreground">Rejoignez l'élite du trading financé.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input id="firstName" name="firstName" placeholder="Jean" required className="bg-background/50 h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input id="lastName" name="lastName" placeholder="Dupont" required className="bg-background/50 h-11" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Adresse e-mail</Label>
            <Input id="email" name="email" type="email" placeholder="nom@exemple.com" required className="bg-background/50 h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" name="password" type="password" required className="bg-background/50 h-11" />
          </div>
          <div className="space-y-2 mt-2 pt-2 border-t border-border/40">
            <Label htmlFor="token" className="text-primary/80">Code d'invitation (Optionnel)</Label>
            <Input id="token" name="token" type="text" placeholder="XXXX-XXXX-XXXX" className="bg-background/50 h-11 border-primary/20 focus-visible:ring-primary/40" />
            <p className="text-[11px] text-muted-foreground mt-1 text-center">Requis uniquement si vous êtes invité par l'administrateur.</p>
          </div>
          
          <Button type="submit" disabled={loading} className="w-full mt-8 shadow-lg shadow-primary/20 rounded-xl h-12 text-base font-medium transition-all hover:shadow-primary/40 hover:scale-[1.02]">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Créer mon compte
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Vous avez déjà un compte ?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium hover:text-primary/80 transition-colors">Se connecter</Link>
        </div>
      </div>
    </div>
  )
}
