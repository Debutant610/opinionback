import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { Input } from "@/components/ui/input"
import { ShieldBan, Search } from "lucide-react"
import { FundAccountForm } from "@/components/fund-account-form"
import { ModerateButton } from "@/components/moderate-button"

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect("/login")
  // @ts-ignore
  if (session.user.role !== "ADMIN") redirect("/dashboard")

  const traders = await db.user.findMany({
    where: { role: "TRADER" },
    include: { profile: true, accounts: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-outfit font-bold tracking-tight">Annuaire des Traders</h1>
          <p className="text-muted-foreground mt-2 text-lg">Gérez les utilisateurs, octroyez du capital et appliquez les sanctions anti-bots.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Rechercher un trader..." className="pl-10 h-11 w-[250px] rounded-full bg-card border-border/50" />
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-[2rem] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-border/50 bg-muted/20">
                <th className="p-5 font-medium text-muted-foreground text-sm uppercase tracking-wider">Trader</th>
                <th className="p-5 font-medium text-muted-foreground text-sm uppercase tracking-wider">Comptes</th>
                <th className="p-5 font-medium text-muted-foreground text-sm uppercase tracking-wider">Statut</th>
                <th className="p-5 font-medium text-muted-foreground text-sm uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {traders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">Aucun trader inscrit.</td>
                </tr>
              ) : (
                traders.map(trader => {
                  const traderName = trader.profile?.firstName
                    ? `${trader.profile.firstName} ${trader.profile.lastName}`
                    : trader.email
                  return (
                    <tr key={trader.id} className="hover:bg-muted/10 transition-colors group">
                      <td className="p-5">
                        <div className="font-bold text-base">{traderName}</div>
                        <div className="text-sm text-muted-foreground">{trader.email}</div>
                      </td>
                      <td className="p-5">
                        <span className="text-lg font-bold">{trader.accounts.length}</span>
                        <span className="text-muted-foreground text-sm ml-1">compte(s)</span>
                      </td>
                      <td className="p-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                          trader.status === 'FUNDED' ? 'bg-green-500/15 text-green-500 border border-green-500/20' :
                          trader.status === 'BANNED' ? 'bg-red-500/15 text-red-500 border border-red-500/20' :
                          trader.status === 'SUSPENDED' ? 'bg-amber-500/15 text-amber-500 border border-amber-500/20' :
                          trader.status === 'DEMO' ? 'bg-blue-500/15 text-blue-500 border border-blue-500/20' :
                          'bg-muted text-muted-foreground border border-border/50'
                        }`}>
                          {trader.status}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <FundAccountForm userId={trader.id} traderName={traderName} />
                          <ModerateButton traderId={trader.id} traderName={traderName} currentStatus={trader.status} />
                        </div>
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
