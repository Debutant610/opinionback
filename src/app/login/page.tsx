"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        toast.error("Identifiants invalides ou erreur de serveur.")
      } else {
        toast.success("Connexion réussie !")
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error) {
      toast.error("Une erreur inattendue est survenue.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="absolute top-8 left-8 z-10">
        <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground transition-colors group">
          <Link href="/"><ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform"/> Retour</Link>
        </Button>
      </div>

      <div className="w-full max-w-md p-8 rounded-[2rem] bg-card/80 border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative z-10 backdrop-blur-2xl animate-fade-in-up">
        <div className="text-center mb-10">
          <img src="/logo.png" alt="Logo" className="h-16 w-auto mx-auto mb-6 drop-shadow-2xl" />
          <h1 className="font-outfit text-3xl font-bold tracking-tight mb-2">Bon retour</h1>
          <p className="text-sm text-muted-foreground">Accédez à votre espace de trading propriétaire.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Adresse e-mail</Label>
            <Input id="email" name="email" type="email" placeholder="nom@exemple.com" required className="bg-background/50 h-11" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
              <Link href="#" className="text-xs font-medium text-primary hover:text-primary/80 hover:underline transition-colors">Oublié ?</Link>
            </div>
            <Input id="password" name="password" type="password" required className="bg-background/50 h-11" />
          </div>
          
          <Button type="submit" disabled={loading} className="w-full mt-8 shadow-lg shadow-primary/20 rounded-xl h-12 text-base font-medium transition-all hover:shadow-primary/40 hover:scale-[1.02]">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Se connecter
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Pas encore de compte ?{" "}
          <Link href="/register" className="text-primary hover:underline font-medium hover:text-primary/80 transition-colors">Créer un compte</Link>
        </div>
      </div>
    </div>
  )
}
