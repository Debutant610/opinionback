"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, Loader2, Plus, AlertCircle } from "lucide-react"

interface FundAccountFormProps {
  userId: string
  traderName: string
}

export function FundAccountForm({ userId, traderName }: FundAccountFormProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [accountType, setAccountType] = useState<"DEMO"|"FUNDED">("FUNDED")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const form = e.currentTarget
    const data = {
      userId,
      type: accountType,
      balance: (form.elements.namedItem('balance') as HTMLInputElement).value,
      maxDrawdown: (form.elements.namedItem('maxDrawdown') as HTMLInputElement).value,
      profitTarget: (form.elements.namedItem('profitTarget') as HTMLInputElement).value,
    }

    const res = await fetch('/api/admin/accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    setLoading(false)
    if (res.ok) {
      setSuccess(true)
      setTimeout(() => { setSuccess(false); setOpen(false); router.refresh() }, 2000)
    } else {
      const body = await res.json()
      setError(body.message || "Une erreur est survenue.")
    }
  }

  if (!open) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="h-8 rounded-lg text-xs font-medium border-green-500/20 text-green-500 hover:bg-green-500/10 hover:text-green-600 transition-colors"
        onClick={() => setOpen(true)}
      >
        <Plus className="w-3 h-3 mr-1" /> Attribuer un compte
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-card border border-border/80 rounded-[2rem] shadow-2xl p-8">
        <h2 className="text-2xl font-outfit font-bold mb-2">Attribuer un Compte</h2>
        <p className="text-muted-foreground text-sm mb-6">À : <span className="font-bold text-foreground">{traderName}</span></p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2 p-1 bg-muted rounded-xl">
            <button type="button" onClick={() => setAccountType("FUNDED")} className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${accountType === "FUNDED" ? 'bg-primary text-white shadow' : 'text-muted-foreground'}`}>Compte Financé</button>
            <button type="button" onClick={() => setAccountType("DEMO")} className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${accountType === "DEMO" ? 'bg-primary text-white shadow' : 'text-muted-foreground'}`}>Compte Démo</button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="balance">Capital alloué (€)</Label>
            <Input id="balance" name="balance" type="number" placeholder="10000" required className="h-11 bg-background" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="maxDrawdown">Drawdown Max (%)</Label>
              <Input id="maxDrawdown" name="maxDrawdown" type="number" placeholder="10" className="h-11 bg-background" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profitTarget">Objectif Profit (€)</Label>
              <Input id="profitTarget" name="profitTarget" type="number" placeholder="1000" className="h-11 bg-background" />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1 h-11 rounded-xl" onClick={() => setOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={loading || success} className="flex-1 h-11 rounded-xl shadow-lg shadow-primary/20">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : success ? <Check className="w-4 h-4 mr-2 text-green-400" /> : null}
              {loading ? "Création..." : success ? "Créé !" : "Créer le compte"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
