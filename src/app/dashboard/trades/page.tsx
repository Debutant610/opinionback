import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { TrendingUp, TrendingDown, Circle } from "lucide-react"

export default async function TradesPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect("/login")

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    include: {
      accounts: {
        include: {
          trades: { orderBy: { openedAt: 'desc' } }
        }
      }
    }
  })
  if (!user || user.role === "ADMIN") redirect("/dashboard")

  const allTrades = user.accounts.flatMap(a => a.trades.map(t => ({ ...t, accountType: a.type })))
  const closedTrades = allTrades.filter(t => t.status === "CLOSED")
  const totalPnL = closedTrades.reduce((s, t) => s + (t.profitLoss ?? 0), 0)
  const wins = closedTrades.filter(t => (t.profitLoss ?? 0) > 0).length
  const winRate = closedTrades.length > 0 ? Math.round((wins / closedTrades.length) * 100) : 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-outfit font-bold tracking-tight">Historique des Trades</h1>
        <p className="text-muted-foreground mt-2 text-lg">Analysez vos performances sur tous vos comptes.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="p-6 rounded-3xl bg-card border border-border/50 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground mb-2">P&L Total</div>
          <div className={`text-3xl font-bold font-outfit tracking-tight ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {totalPnL >= 0 ? '+' : ''}{totalPnL.toFixed(2)} €
          </div>
        </div>
        <div className="p-6 rounded-3xl bg-card border border-border/50 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground mb-2">Taux de Réussite</div>
          <div className="text-3xl font-bold font-outfit tracking-tight">{winRate}%</div>
        </div>
        <div className="p-6 rounded-3xl bg-card border border-border/50 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground mb-2">Trades Clôturés</div>
          <div className="text-3xl font-bold font-outfit tracking-tight">{closedTrades.length}</div>
        </div>
        <div className="p-6 rounded-3xl bg-card border border-border/50 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground mb-2">Trades Ouverts</div>
          <div className="text-3xl font-bold font-outfit tracking-tight text-primary">{allTrades.filter(t => t.status === 'OPEN').length}</div>
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-[2rem] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-border/50 bg-muted/20">
                <th className="p-5 font-medium text-muted-foreground text-sm uppercase tracking-wider">Actif</th>
                <th className="p-5 font-medium text-muted-foreground text-sm uppercase tracking-wider">Compte</th>
                <th className="p-5 font-medium text-muted-foreground text-sm uppercase tracking-wider">Entrée</th>
                <th className="p-5 font-medium text-muted-foreground text-sm uppercase tracking-wider">Sortie</th>
                <th className="p-5 font-medium text-muted-foreground text-sm uppercase tracking-wider">P&L</th>
                <th className="p-5 font-medium text-muted-foreground text-sm uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {allTrades.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">Aucun trade enregistré pour le moment.</td>
                </tr>
              ) : (
                allTrades.map(t => (
                  <tr key={t.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-5 font-bold text-foreground">{t.asset}</td>
                    <td className="p-5">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${t.accountType === 'FUNDED' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        {t.accountType}
                      </span>
                    </td>
                    <td className="p-5 font-mono text-sm">{t.entryPrice.toFixed(4)}</td>
                    <td className="p-5 font-mono text-sm">{t.exitPrice ? t.exitPrice.toFixed(4) : <span className="text-muted-foreground">—</span>}</td>
                    <td className="p-5">
                      {t.profitLoss !== null ? (
                        <div className={`flex items-center gap-1 font-bold font-outfit ${t.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {t.profitLoss >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          {t.profitLoss >= 0 ? '+' : ''}{t.profitLoss.toFixed(2)} €
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="p-5">
                      <span className={`flex items-center gap-1.5 text-xs font-bold ${t.status === 'OPEN' ? 'text-primary' : 'text-muted-foreground'}`}>
                        <Circle className={`w-2 h-2 fill-current ${t.status === 'OPEN' ? 'animate-pulse' : ''}`} />
                        {t.status === 'OPEN' ? 'Ouvert' : 'Clôturé'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
