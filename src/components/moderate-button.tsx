"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldBan, ShieldCheck, Loader2, AlertTriangle } from "lucide-react"

interface ModerateButtonProps {
  traderId: string
  traderName: string
  currentStatus: string
}

export function ModerateButton({ traderId, traderName, currentStatus }: ModerateButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [reason, setReason] = useState("")
  const [suspendDays, setSuspendDays] = useState("7")

  async function moderate(action: string) {
    setLoading(true)
    await fetch(`/api/admin/users/${traderId}/moderate`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        reason: reason || (action === "BAN" ? "Utilisation de robot (EA/Bot)" : "Suspension temporaire"),
        suspendedUntil: action === "SUSPEND"
          ? new Date(Date.now() + parseInt(suspendDays) * 86400000).toISOString()
          : undefined
      })
    })
    setLoading(false)
    setOpen(false)
    router.refresh()
  }

  if (!open) {
    return (
      <Button
        variant="ghost" size="icon"
        className="h-8 w-8 text-red-500 hover:bg-red-500/10"
        onClick={() => setOpen(true)}
        title="Bannir ou Suspendre"
      >
        <ShieldBan className="w-4 h-4" />
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-card border border-border/80 rounded-[2rem] shadow-2xl p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-red-500/15 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <h2 className="text-xl font-outfit font-bold">Modération Anti-Bot</h2>
        </div>
        <p className="text-muted-foreground text-sm mb-6">Trader : <span className="font-bold text-foreground">{traderName}</span></p>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Raison de la sanction</Label>
            <Input value={reason} onChange={e => setReason(e.target.value)} placeholder="Utilisation de robot (EA/Bot)" className="h-11 bg-background" />
          </div>
          {currentStatus !== "BANNED" && currentStatus !== "SUSPENDED" && (
            <div className="space-y-2">
              <Label>Durée de suspension (jours)</Label>
              <Input type="number" value={suspendDays} onChange={e => setSuspendDays(e.target.value)} placeholder="7" min="1" className="h-11 bg-background" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2">
            {(currentStatus === "BANNED" || currentStatus === "SUSPENDED") ? (
              <Button onClick={() => moderate("RESTORE")} disabled={loading} className="col-span-2 h-11 rounded-xl bg-green-600 hover:bg-green-700 font-medium text-white">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <ShieldCheck className="w-4 h-4 mr-2"/>}
                Réhabiliter ce Trader
              </Button>
            ) : (
              <>
                <Button onClick={() => moderate("SUSPEND")} disabled={loading} variant="outline" className="h-11 rounded-xl border-amber-500/30 text-amber-500 hover:bg-amber-500/10">
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : null}
                  Suspendre
                </Button>
                <Button onClick={() => moderate("BAN")} disabled={loading} className="h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium">
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <ShieldBan className="w-4 h-4 mr-2"/>}
                  Bannir définitivement
                </Button>
              </>
            )}
          </div>
          <Button variant="ghost" className="w-full text-muted-foreground mt-1" onClick={() => setOpen(false)}>Annuler</Button>
        </div>
      </div>
    </div>
  )
}
