import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageSquare, Mail, Send, LifeBuoy } from "lucide-react"

export default async function SupportPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect("/login")

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-primary/10 text-primary">
          <LifeBuoy className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-outfit font-bold tracking-tight">Support & Aide</h1>
          <p className="text-muted-foreground mt-1 text-lg">Une question ? Notre équipe est là pour vous aider.</p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Contact info */}
        <div className="md:col-span-1 space-y-6">
          <div className="p-6 rounded-[2rem] bg-card border border-border/50 shadow-sm">
            <Mail className="w-5 h-5 text-primary mb-3" />
            <h4 className="font-bold mb-1 font-outfit">Email</h4>
            <p className="text-sm text-muted-foreground">support@opinback.com</p>
          </div>
          <div className="p-6 rounded-[2rem] bg-card border border-border/50 shadow-sm">
            <MessageSquare className="w-5 h-5 text-primary mb-3" />
            <h4 className="font-bold mb-1 font-outfit">Chat en direct</h4>
            <p className="text-sm text-muted-foreground">Disponible de 9h à 18h (CET)</p>
          </div>
        </div>

        {/* Support Form */}
        <div className="md:col-span-2 p-8 rounded-[2rem] bg-card border border-border/50 shadow-sm">
          <h3 className="text-xl font-bold mb-6 font-outfit">Envoyez-nous un message</h3>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label>Sujet</Label>
              <Input placeholder="Problème avec mon compte..." className="h-11 bg-background" />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <textarea 
                className="flex min-h-[150px] w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Décrivez votre demande en détail..."
              ></textarea>
            </div>
            <Button className="w-full h-12 rounded-xl shadow-lg shadow-primary/20">
              <Send className="w-4 h-4 mr-2" /> Envoyer le message
            </Button>
          </form>
        </div>
      </div>

      {/* FAQ Placeholder */}
      <div className="p-8 rounded-[2rem] bg-muted/30 border border-border/50">
        <h3 className="text-xl font-bold mb-4 font-outfit text-center">Questions Fréquentes</h3>
        <div className="grid gap-4">
          {[
            "Comment puis-je retirer mes profits ?",
            "Quels sont les jours de trading minimum ?",
            "Puis-je utiliser un VPN ?",
          ].map((q, i) => (
            <div key={i} className="flex justify-between items-center p-4 bg-card rounded-2xl border border-border/50 hover:border-primary/30 transition-colors cursor-pointer group">
              <span className="text-sm font-medium">{q}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

import { ChevronRight } from "lucide-react"
