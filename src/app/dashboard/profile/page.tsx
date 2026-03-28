"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, Loader2 } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const form = e.currentTarget
    const data = {
      firstName: (form.elements.namedItem('firstName') as HTMLInputElement).value,
      lastName: (form.elements.namedItem('lastName') as HTMLInputElement).value,
      country: (form.elements.namedItem('country') as HTMLInputElement).value,
      paymentMethod: (form.elements.namedItem('paymentMethod') as HTMLInputElement).value,
    }
    await fetch('/api/profile', { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) })
    setSaving(false)
    setSaved(true)
    setTimeout(() => { setSaved(false); router.refresh() }, 2000)
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-outfit font-bold tracking-tight">Mon Profil</h1>
        <p className="text-muted-foreground mt-2 text-lg">Complétez vos informations personnelles pour accéder aux retraits.</p>
      </div>

      <div className="p-8 rounded-[2rem] bg-card border border-border/50 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input id="firstName" name="firstName" placeholder="Jean" required className="h-11 bg-background/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input id="lastName" name="lastName" placeholder="Dupont" required className="h-11 bg-background/50" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Pays</Label>
            <Input id="country" name="country" placeholder="France" className="h-11 bg-background/50" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Moyen de paiement (IBAN / Crypto)</Label>
            <Input id="paymentMethod" name="paymentMethod" placeholder="FR76 1234 5678 9101..." className="h-11 bg-background/50" />
            <p className="text-xs text-muted-foreground">Ces informations sont sécurisées et uniquement utilisées pour vos paiements.</p>
          </div>
          <div className="pt-2">
            <Button type="submit" disabled={saving || saved} className="h-12 px-8 rounded-xl text-base font-medium shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : saved ? <Check className="w-4 h-4 mr-2" /> : null}
              {saving ? "Enregistrement..." : saved ? "Enregistré !" : "Enregistrer les modifications"}
            </Button>
          </div>
        </form>
      </div>

      <div className="p-8 rounded-[2rem] bg-card border border-border/50 shadow-sm space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" /> Sécurité
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Mot de passe actuel</Label>
            <Input type="password" placeholder="••••••••" className="h-11 bg-background/50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nouveau mot de passe</Label>
              <Input type="password" placeholder="••••••••" className="h-11 bg-background/50" />
            </div>
            <div className="space-y-2">
              <Label>Confirmer le mot de passe</Label>
              <Input type="password" placeholder="••••••••" className="h-11 bg-background/50" />
            </div>
          </div>
          <Button variant="outline" className="h-11 rounded-xl">Mettre à jour le mot de passe</Button>
        </div>
      </div>
    </div>
  )
}

import { Shield } from "lucide-react"
