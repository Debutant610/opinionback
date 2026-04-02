"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, Mail, Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
        toast.error("Identifiants invalides ou erreur de serveur.", {
          icon: <AlertCircle className="w-4 h-4 text-red-500" />
        })
      } else {
        toast.success("Heureux de vous revoir !", {
          icon: <CheckCircle2 className="w-4 h-4 text-green-500" />
        })
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
    <div className="flex flex-col min-h-screen items-center justify-center bg-[#020617] relative overflow-hidden selection:bg-primary/30 selection:text-white">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[160px] rounded-full animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[160px] rounded-full animate-pulse delay-700 pointer-events-none" />
      
      {/* Floating Particles Simulation */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

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
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-md mx-auto relative z-10 px-4"
      >
        <div className="p-8 md:p-10 rounded-[2.5rem] bg-[#0f172a]/40 border border-white/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] backdrop-blur-3xl relative overflow-hidden">
          {/* Subtle line decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative isolate"
            >
              <div className="absolute inset-0 bg-primary/20 blur-[30px] rounded-full scale-50 -z-10 mx-auto" style={{ width: '80px', height: '80px' }} />
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="h-20 w-auto mx-auto mb-4 invert contrast-[1000%] mix-blend-screen brightness-125" 
              />
              <h1 className="font-outfit text-4xl font-extrabold tracking-tighter text-white mb-2">Connexion</h1>
              <p className="text-sm text-slate-400 font-medium font-outfit uppercase tracking-widest opacity-60">L'excellence du trading propriétaire.</p>
            </motion.div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-400 ml-1 text-xs font-bold uppercase tracking-widest opacity-60">Email professionnel</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="votre@email.com" 
                  required 
                  className="bg-black/60 border-white/5 h-13 pl-12 rounded-2xl hover:bg-black/80 focus:bg-black/80 focus:border-primary/40 transition-all text-white placeholder:text-slate-700 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <Label htmlFor="password" className="text-slate-400 text-xs font-bold uppercase tracking-widest opacity-60">Mot de passe</Label>
                <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:text-primary/80 transition-all">Oublié ?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                <Input 
                  id="password" 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  required 
                  className="bg-black/60 border-white/5 h-13 pl-12 pr-12 rounded-2xl hover:bg-black/80 focus:bg-black/80 focus:border-primary/40 transition-all text-white placeholder:text-slate-700 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading} 
                className="relative w-full h-14 rounded-2xl text-base font-bold tracking-wide overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 transition-all duration-300 group-hover:from-blue-500 group-hover:via-indigo-500 group-hover:to-purple-600" />
                {/* Glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-400/20 to-purple-600/20 blur-xl" />
                {/* Shimmer */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full" />
                {/* Border glow */}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-blue-400/30 group-hover:ring-blue-300/50 transition-all" />
                {/* Content */}
                <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                  {loading 
                    ? <><Loader2 className="h-5 w-5 animate-spin" /><span>Connexion...</span></>
                    : <><span>Se connecter</span><span className="opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span></>
                  }
                </span>
              </button>
            </div>
          </form>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-10 text-center text-sm"
          >
            <span className="text-slate-400">Pas encore parmi l'élite ?</span>{" "}
            <Link href="/register" className="text-white hover:text-primary font-bold transition-all underline-offset-4 hover:underline">
              Rejoindre OPINBACK
            </Link>
          </motion.div>
        </div>
        
        {/* Decorative elements below the card */}
        <div className="mt-8 flex justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
            <CheckCircle2 className="w-3 h-3 text-primary" /> Sécurité SSL
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
            <CheckCircle2 className="w-3 h-3 text-primary" /> Données Chiffrées
          </div>
        </div>
      </motion.div>
    </div>
  )
}
