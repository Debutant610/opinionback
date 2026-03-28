"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, Mail, CheckCircle, AlertCircle, ShieldAlert } from "lucide-react"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    // Envoi d'email instantané
    setLoading(false)
    setSent(true)
    toast.success("Email envoyé !", {
      description: "Si un compte existe, vous recevrez un lien de réinitialisation.",
      icon: <CheckCircle className="w-4 h-4 text-green-500" />
    })
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[#020617] relative overflow-hidden py-12 selection:bg-primary/30 selection:text-white">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[160px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-8 left-8 z-20"
      >
        <Button variant="ghost" asChild className="text-muted-foreground hover:text-white hover:bg-white/5 transition-all group rounded-full px-6">
          <Link href="/login"><ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform"/> Retour</Link>
        </Button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md mx-auto relative z-10 px-4"
      >
        <div className="p-8 md:p-10 rounded-[2.5rem] bg-[#0f172a]/40 border border-white/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] backdrop-blur-3xl relative overflow-hidden">
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20">
                <ShieldAlert className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-outfit text-3xl font-extrabold tracking-tighter text-white mb-3">Récupération</h1>
              <p className="text-sm text-slate-400 font-medium">Vous recevrez un lien de réinitialisation sécurisé par email.</p>
            </motion.div>
          </div>

          {!sent ? (
            <motion.form 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300 ml-1 text-xs font-bold uppercase tracking-widest">Email professionnel</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="votre@email.com" 
                    required 
                    className="bg-white/5 border-white/5 h-13 pl-12 rounded-2xl hover:bg-white/10 focus:bg-white/10 focus:border-primary/50 transition-all text-white"
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full mt-4 shadow-lg shadow-primary/20 rounded-2xl h-14 text-lg font-bold transition-all hover:shadow-primary/40 hover:-translate-y-0.5">
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Envoyer le lien"}
              </Button>
            </motion.form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <h2 className="text-white font-bold mb-2">Vérifiez votre boîte mail</h2>
              <p className="text-slate-400 text-sm mb-8">Nous avons envoyé un lien de récupération à votre adresse email.</p>
              <Button variant="ghost" className="text-primary hover:text-primary/80" onClick={() => setSent(false)}>
                Réessayer avec un autre email
              </Button>
            </motion.div>
          )}

          <div className="mt-10 text-center text-sm">
            <Link href="/login" className="text-slate-400 hover:text-white font-bold transition-all underline-offset-4 hover:underline">
              Retour à la connexion
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
