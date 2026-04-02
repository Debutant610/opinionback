import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { PerformanceChart } from "@/components/performance-chart"
import { MarketOverview } from "@/components/market-overview"
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Target, 
  Zap,
  ArrowUpRight,
  History,
  Activity
} from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect("/login")

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    include: { 
      accounts: { include: { trades: true } },
      profile: true 
    }
  })

  // Redirection si admin (l'admin a une vue différente ou on peut la gérer ici)
  // @ts-ignore
  if (user?.role === "ADMIN") {
    // Vue Admin simplifiée ou redirection vers stats admin
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-outfit font-bold">Tableau de Bord Administrateur</h1>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="p-6 rounded-[2rem] bg-primary/10 border border-primary/20">
            <p className="text-sm font-medium text-primary mb-1">Total Utilisateurs</p>
            <p className="text-3xl font-bold">Connectez la BDD...</p>
          </div>
        </div>
      </div>
    )
  }

  const accounts = user?.accounts || []
  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0)
  const activeTrades = accounts.flatMap(a => a.trades.filter(t => t.status === "OPEN"))
  const recentTrades = accounts.flatMap(a => a.trades).sort((a, b) => b.openedAt.getTime() - a.openedAt.getTime()).slice(0, 5)

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-outfit font-bold tracking-tight">
            Bonjour, {user?.profile?.firstName || "Trader"} 👋
          </h1>
          <p className="text-muted-foreground mt-1">L'excellence du prop trading. Vos métriques en temps réel.</p>
        </div>
        
        <div className="w-full">
           <div className="flex items-center gap-2 mb-2 mt-4">
             <Activity className="w-4 h-4 text-primary" />
             <h3 className="font-bold uppercase tracking-wider text-muted-foreground text-xs">Aperçu du Marché en Direct</h3>
           </div>
           <MarketOverview />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="group p-6 rounded-[2rem] bg-card border border-border/50 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Solde Total</p>
              <p className="text-2xl font-bold font-outfit">{totalBalance.toFixed(2)} €</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-green-500">
            <ArrowUpRight className="w-3 h-3" /> +2.4% ce mois
          </div>
        </div>

        <div className="group p-6 rounded-[2rem] bg-card border border-border/50 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Comptes Actifs</p>
              <p className="text-2xl font-bold font-outfit">{accounts.length}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{accounts.filter(a => a.type === "FUNDED").length} Financés, {accounts.filter(a => a.type === "DEMO").length} Démo</p>
        </div>

        <div className="group p-6 rounded-[2rem] bg-card border border-border/50 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Trades Ouverts</p>
              <p className="text-2xl font-bold font-outfit">{activeTrades.length}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Volume total: --</p>
        </div>

        <div className="group p-6 rounded-[2rem] bg-card border border-border/50 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-green-500/10 text-green-500 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Objectif Profit</p>
              <p className="text-2xl font-bold font-outfit">85%</p>
            </div>
          </div>
          <div className="w-full bg-muted h-1.5 rounded-full mt-1">
            <div className="bg-green-500 h-1.5 rounded-full w-[85%] shadow-[0_0_10px_rgba(34,197,94,0.3)]"></div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Performance Chart */}
        <div className="lg:col-span-2 p-8 rounded-[2rem] bg-card border border-border/50 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-outfit font-bold">Courbe de Performance</h3>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 text-xs font-medium bg-muted px-3 py-1.5 rounded-full text-muted-foreground">7 derniers jours</div>
            </div>
          </div>
          <PerformanceChart />
        </div>

        {/* Recent Activity */}
        <div className="p-8 rounded-[2rem] bg-card border border-border/50 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-outfit font-bold">Activité Récente</h3>
            <Link href="/dashboard/trades" className="text-xs font-medium text-primary hover:underline">Voir tout</Link>
          </div>
          
          <div className="space-y-4">
            {recentTrades.length === 0 ? (
              <div className="py-8 text-center border-2 border-dashed border-border/50 rounded-3xl">
                <History className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Aucun trade récent</p>
              </div>
            ) : (
              recentTrades.map((trade, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${(trade.profitLoss || 0) >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {(trade.profitLoss || 0) >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{trade.asset}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">{new Date(trade.openedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${(trade.profitLoss || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {(trade.profitLoss || 0) >= 0 ? '+' : ''}{trade.profitLoss?.toFixed(2)}€
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase">{trade.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-4">
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
              <p className="text-xs font-medium text-primary mb-1">💡 Conseil Pro</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Maintenez un levier faible pour rester sous le drawdown maximum de 10% recommandé.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
