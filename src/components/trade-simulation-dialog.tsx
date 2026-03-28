"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, TrendingUp } from "lucide-react"

export function TradeSimulationDialog({ accounts }: { accounts: any[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const data = {
      accountId: (form.elements.namedItem('accountId') as HTMLInputElement).value,
      asset: (form.elements.namedItem('asset') as HTMLInputElement).value,
      entryPrice: (form.elements.namedItem('entryPrice') as HTMLInputElement).value,
      exitPrice: (form.elements.namedItem('exitPrice') as HTMLInputElement).value || null,
      profitLoss: (form.elements.namedItem('profitLoss') as HTMLInputElement).value || null,
    }

    const res = await fetch('/api/trades', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })

    setLoading(false)
    if (res.ok) {
      setOpen(false)
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full shadow-lg shadow-primary/20">
          <TrendingUp className="mr-2 w-4 h-4" /> Simuler un Trade
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-border/50 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-outfit">Simuler un Trade</DialogTitle>
          <DialogDescription>
            Enregistrez un trade manuellement pour tester votre dashboard.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="accountId">Compte</Label>
            <Select name="accountId" required>
              <SelectTrigger className="h-11 bg-background/50">
                <SelectValue placeholder="Choisir un compte" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map(acc => (
                  <SelectItem key={acc.id} value={acc.id}>
                    {acc.type} - {acc.balance.toFixed(0)}€
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="asset">Actif (ex: EUR/USD, BTC)</Label>
            <Input id="asset" name="asset" defaultValue="EUR/USD" required className="h-11 bg-background/50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entryPrice">Prix Entrée</Label>
              <Input id="entryPrice" name="entryPrice" type="number" step="0.0001" defaultValue="1.0850" required className="h-11 bg-background/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exitPrice">Prix Sortie (Optionnel)</Label>
              <Input id="exitPrice" name="exitPrice" type="number" step="0.0001" className="h-11 bg-background/50" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="profitLoss">Profit / Perte (€)</Label>
            <Input id="profitLoss" name="profitLoss" type="number" step="0.01" placeholder="Ex: 150.00" className="h-11 bg-background/50" />
          </div>
          <DialogFooter className="pt-4">
            <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl text-base shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enregistrer le Trade
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
