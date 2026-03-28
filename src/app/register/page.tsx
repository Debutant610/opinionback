"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, User, Mail, Lock, ShieldCheck, CheckCircle2, Sparkles, AlertCircle } from "lucide-react"
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
        toast.success("Bienvenue dans l'élite !", {
          description: "Votre compte OPINBACK a été créé avec succès. Connectez-vous maintenant.",
          icon: <Sparkles className="w-4 h-4 text-primary" />
        })
        router.push("/login")
      } else {
        toast.error(result.message || "Impossible de créer le compte.", {
          icon: <AlertCircle className="w-4 h-4 text-red-500" />
        })
      }
    } catch (error) {
      toast.error("Erreur de communication avec le serveur.", {
         description: "Vérifiez votre connexion internet et réessayez."
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[#020617] relative overflow-hidden py-12 selection:bg-primary/30 selection:text-white">
      {/* Immersive Background Effects */}
      <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-blue-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-primary/10 blur-[140px] rounded-full pointer-events-none" />
      
      {/* Stars/Dust background */}
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.05] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-8 left-8 z-20"
      >
        <Button variant="ghost" asChild className="text-muted-foreground hover:text-white hover:bg-white/5 transition-all group rounded-full px-6">
          <Link href="/"><ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform"/> Retour</Link>
        </Button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg mx-auto relative z-10 px-4"
      >
        <div className="p-8 md:p-12 rounded-[2.5rem] bg-[#0f172a]/40 border border-white/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] backdrop-blur-3xl relative overflow-hidden">
          {/* Subtle line decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <img src="/logo.png" alt="Logo" className="h-16 w-auto mx-auto mb-4 drop-shadow-[0_0_15px_rgba(var(--primary),0.4)] brightness-150 invert mix-blend-screen" />
              <h1 className="font-outfit text-3xl font-extrabold tracking-tighter text-white mb-2">Nous rejoindre</h1>
              <p className="text-sm text-slate-400 font-medium">Bénéficiez des capitaux de l'élite pour trader.</p>
            </motion.div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-slate-300 ml-1 text-xs font-bold uppercase tracking-widest opacity-70">Prénom</Label>
                <div className="relative group">
                   <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                   <Input id="firstName" name="firstName" placeholder="Jean" required className="bg-white/5 border-white/10 h-12 pl-12 rounded-2xl hover:bg-white/10 focus:bg-white/10 focus:border-primary/50 transition-all text-white placeholder:text-slate-600 focus-visible:ring-0 focus-visible:ring-offset-0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-slate-400 ml-1 text-xs font-bold uppercase tracking-widest opacity-70">Nom</Label>
                <div className="relative group">
                   <Input id="lastName" name="lastName" placeholder="Dupont" required className="bg-white/5 border-white/10 h-12 pl-4 rounded-2xl hover:bg-white/10 focus:bg-white/10 focus:border-primary/50 transition-all text-white placeholder:text-slate-600 focus-visible:ring-0 focus-visible:ring-offset-0" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 ml-1 text-xs font-bold uppercase tracking-widest opacity-70">Email professionnel</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                <Input id="email" name="email" type="email" placeholder="votre@email.com" required className="bg-white/5 border-white/10 h-12 pl-12 rounded-2xl hover:bg-white/10 focus:bg-white/10 focus:border-primary/50 transition-all text-white placeholder:text-slate-600 focus-visible:ring-0 focus-visible:ring-offset-0" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300 ml-1 text-xs font-bold uppercase tracking-widest opacity-70">Mot de passe de sécurité</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                <Input id="password" name="password" type="password" placeholder="••••••••" required className="bg-white/5 border-white/10 h-12 pl-12 rounded-2xl hover:bg-white/10 focus:bg-white/10 focus:border-primary/50 transition-all text-white placeholder:text-slate-600 focus-visible:ring-0 focus-visible:ring-offset-0" />
              </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="space-y-2 mt-2 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between gap-2 mb-2">
                 <Label htmlFor="token" className="text-primary text-xs font-bold uppercase tracking-widest">Invitation privilège</Label>
                 <span className="text-[9px] text-muted-foreground bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10 tracking-[0.1em] font-medium uppercase">Optionnel</span>
              </div>
              <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-50 group-focus-within:opacity-100 transition-opacity" />
                <Input id="token" name="token" type="text" placeholder="OPNBK-INVITE-CODE" className="bg-primary/5 border-primary/20 h-12 pl-12 rounded-2xl hover:bg-primary/10 focus:bg-primary/10 focus:border-primary/50 transition-all text-white placeholder:text-primary/30" />
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
              <Button type="submit" disabled={loading} className="w-full mt-6 shadow-[0_12px_24px_rgba(var(--primary),0.2)] rounded-2xl h-14 text-lg font-bold transition-all hover:shadow-[0_16px_32px_rgba(var(--primary),0.35)] hover:-translate-y-1">
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Créer mon dossier de trader"}
              </Button>
            </motion.div>
          </form>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-10 text-center text-sm">
            <span className="text-slate-400">Déjà initié ?</span>{" "}
            <Link href="/login" className="text-white hover:text-primary font-bold transition-all underline-offset-4 hover:underline">
              Se connecter
            </Link>
          </motion.div>
        </div>

        {/* Legal Mentions / Security Icons */}
        <div className="mt-10 grid grid-cols-3 gap-4 opacity-50 grayscale scale-90">
           <div className="flex flex-col items-center gap-1.5 text-center">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 mb-1">
                 <CheckCircle2 className="w-4 h-4 text-primary" />
              </div>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">RGPD</span>
           </div>
           <div className="flex flex-col items-center gap-1.5 text-center">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 mb-1">
                 <CheckCircle2 className="w-4 h-4 text-primary" />
              </div>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">AES-256</span>
           </div>
           <div className="flex flex-col items-center gap-1.5 text-center">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 mb-1">
                 <CheckCircle2 className="w-4 h-4 text-primary" />
              </div>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">ISO 27001</span>
           </div>
        </div>
      </motion.div>
    </div>
  )
}
