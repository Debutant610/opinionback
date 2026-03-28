import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Clock, ArrowRightLeft } from "lucide-react"

export default async function AdminWithdrawalsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect("/login");

  // @ts-ignore
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const withdrawals = await db.withdrawal.findMany({
    include: {
      user: {
        include: { profile: true }
      }
    },
    orderBy: { requestedAt: 'desc' }
  })

  const pendingCount = withdrawals.filter(w => w.status === 'PENDING').length;
  const pendingAmount = withdrawals.filter(w => w.status === 'PENDING').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-outfit font-bold tracking-tight">Validation des Retraits</h1>
          <p className="text-muted-foreground mt-2 text-lg">Approuvez ou rejetez les demandes de paiements des traders.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="p-6 rounded-3xl bg-card border border-border/50 shadow-sm relative overflow-hidden">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Demandes En Attente</h3>
          <div className="text-4xl font-bold tracking-tight text-amber-500">{pendingCount}</div>
        </div>
        <div className="p-6 rounded-3xl bg-card border border-border/50 shadow-sm relative overflow-hidden">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Montant à Payer</h3>
          <div className="text-4xl font-bold tracking-tight text-foreground">{pendingAmount.toFixed(2)} €</div>
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-[2rem] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-border/50 bg-muted/20">
                <th className="p-5 font-medium text-muted-foreground text-sm uppercase tracking-wider">Date</th>
                <th className="p-5 font-medium text-muted-foreground text-sm uppercase tracking-wider">Trader</th>
                <th className="p-5 font-medium text-muted-foreground text-sm uppercase tracking-wider">Moyen de paiement</th>
                <th className="p-5 font-medium text-muted-foreground text-sm uppercase tracking-wider">Montant</th>
                <th className="p-5 font-medium text-muted-foreground text-sm uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {withdrawals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">Aucune demande de retrait trouvée.</td>
                </tr>
              ) : (
                withdrawals.map(w => (
                  <tr key={w.id} className="hover:bg-muted/10 transition-colors group">
                    <td className="p-5">
                      <div className="text-sm font-medium text-foreground">{new Date(w.requestedAt).toLocaleDateString("fr-FR")}</div>
                      <div className="text-xs text-muted-foreground">{new Date(w.requestedAt).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td className="p-5">
                      <div className="font-bold text-foreground text-base">
                        {w.user.profile?.firstName} {w.user.profile?.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">{w.user.email}</div>
                    </td>
                    <td className="p-5">
                      <div className="text-sm text-foreground flex items-center gap-2">
                        <ArrowRightLeft className="w-4 h-4 text-muted-foreground"/>
                        {w.user.profile?.paymentMethod || "Non renseigné"}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="text-xl font-bold font-outfit tracking-tight text-foreground">{w.amount.toFixed(2)} €</div>
                    </td>
                    <td className="p-5 text-right">
                      {w.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs font-medium border-green-500/20 text-green-500 hover:bg-green-500/10 hover:text-green-600 transition-colors">
                             <CheckCircle2 className="w-4 h-4 mr-1" /> Approuver
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs font-medium border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-colors">
                             <XCircle className="w-4 h-4 mr-1" /> Rejeter
                          </Button>
                        </div>
                      ) : (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                          w.status === 'APPROVED' ? 'bg-green-500/15 text-green-500 border border-green-500/20' : 'bg-red-500/15 text-red-500 border border-red-500/20'
                        }`}>
                          {w.status === 'APPROVED' ? 'APPROUVÉ' : 'REJETÉ'}
                        </span>
                      )}
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
