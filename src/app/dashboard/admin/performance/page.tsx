import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Users, Wallet } from "lucide-react"

export default async function AdminPerformancePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect("/login")
  // @ts-ignore
  if (session.user.role !== "ADMIN") redirect("/dashboard")

  const traders = await db.user.findMany({
    where: { role: "TRADER" },
    include: {
      profile: true,
      accounts: { include: { trades: { where: { status: "CLOSED" } } } }
    },
    orderBy: { createdAt: 'desc' }
  })

  const totalCapital = traders.flatMap(t => t.accounts).reduce((sum, a) => sum + a.balance, 0)
  const globalPnL = traders.flatMap(t => t.accounts.flatMap(a => a.trades)).reduce((sum, t) => sum + (t.profitLoss ?? 0), 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-outfit font-bold tracking-tight">Performances Globales</h1>
        <p className="text-muted-foreground mt-2 text-lg">Suivez en temps réel les performances de tous les traders.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 rounded-3xl bg-primary/10 border border-primary/20 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-primary mb-2"><Users className="w-4 h-4"/>Traders Actifs</div>
          <div className="text-4xl font-bold tracking-tight text-primary">{traders.length}</div>
        </div>
        <div className="p-6 rounded-3xl bg-card border border-border/50 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2"><Wallet className="w-4 h-4"/>Capital Alloué</div>
          <div className="text-4xl font-bold tracking-tight">{totalCapital.toFixed(0)} €</div>
        </div>
        <div className="p-6 rounded-3xl bg-card border border-border/50 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2"><TrendingUp className="w-4 h-4"/>P&L Global</div>
          <div className={`text-4xl font-bold tracking-tight ${globalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {globalPnL >= 0 ? '+' : ''}{globalPnL.toFixed(2)} €
          </div>
        </div>
        <div className="p-6 rounded-3xl bg-card border border-border/50 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground mb-2">Traders Financés</div>
          <div className="text-4xl font-bold tracking-tight">{traders.filter(t => t.status === 'FUNDED').length}</div>
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-[2rem] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-border/50 bg-muted/20">
                <th className="p-5 font-medium text-muted-foreground text-sm uppercase tracking-wider">Trader</th>
                <th className="p-5 font-medium text-muted-foreground text-sm uppercase tracking-wider">Capital</th>
                <th className="p-5 font-medium text-muted-foreground text-sm uppercase tracking-wider">P&L Réalisé</th>
                <th className="p-5 font-medium text-muted-foreground text-sm uppercase tracking-wider">Trades</th>
                <th className="p-5 font-medium text-muted-foreground text-sm uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {traders.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Aucun trader inscrit.</td></tr>
              ) : (
                traders.map(trader => {
                  const capital = trader.accounts.reduce((s, a) => s + a.balance, 0)
                  const pnl = trader.accounts.flatMap(a => a.trades).reduce((s, t) => s + (t.profitLoss ?? 0), 0)
                  const trades = trader.accounts.flatMap(a => a.trades).length
                  return (
                    <tr key={trader.id} className="hover:bg-muted/10 transition-colors group">
                      <td className="p-5">
                        <div className="font-bold">{trader.profile?.firstName ?? "—"} {trader.profile?.lastName ?? ""}</div>
                        <div className="text-xs text-muted-foreground">{trader.email}</div>
                      </td>
                      <td className="p-5 font-bold font-outfit">{capital.toFixed(2)} €</td>
                      <td className="p-5">
                        <span className={`flex items-center gap-1 font-bold font-outfit ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {pnl >= 0 ? <TrendingUp className="w-4 h-4"/> : <TrendingDown className="w-4 h-4"/>}
                          {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)} €
                        </span>
                      </td>
                      <td className="p-5 font-medium">{trades}</td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                          trader.status === 'FUNDED' ? 'bg-green-500/15 text-green-500 border border-green-500/20' :
                          trader.status === 'BANNED' ? 'bg-red-500/15 text-red-500 border border-red-500/20' :
                          trader.status === 'SUSPENDED' ? 'bg-amber-500/15 text-amber-500 border border-amber-500/20' :
                          trader.status === 'DEMO' ? 'bg-blue-500/15 text-blue-500 border border-blue-500/20' :
                          'bg-muted text-muted-foreground border border-border/50'
                        }`}>{trader.status}</span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
