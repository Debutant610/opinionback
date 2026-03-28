import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Copy } from "lucide-react"

export default async function AccountsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect("/login");

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    include: { accounts: true }
  })
  if (!user) return null;

  // Sécurité: Si admin, ne devrait pas être ici (redirigé ou géré autrement)
  if (user.role === "ADMIN") redirect("/dashboard");

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-outfit font-bold tracking-tight">Mes Comptes de Trading</h1>
          <p className="text-muted-foreground mt-2 text-lg">Gérez vos comptes d'évaluation et financés.</p>
        </div>
        {user.accounts.length === 0 && (
          <Button className="rounded-full shadow-lg shadow-primary/20 h-11 px-6 transition-transform hover:scale-[1.02]">
            Demander un compte Démo
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {user.accounts.length === 0 ? (
          <div className="col-span-full p-12 text-center border border-dashed border-border/60 rounded-[2rem] bg-card/10">
            <h3 className="text-lg font-medium text-foreground mb-2">Aucun compte actif</h3>
            <p className="text-muted-foreground">Vous n'avez pas encore de compte de trading associé à votre profil.</p>
          </div>
        ) : (
          user.accounts.map(acc => (
            <div key={acc.id} className="p-6 rounded-[2rem] bg-gradient-to-b from-card to-background border border-border/50 shadow-md hover:shadow-lg transition-all relative group">
              <div className="flex justify-between items-start mb-6">
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${acc.type === 'FUNDED' ? 'bg-primary/20 text-primary border border-primary/20' : 'bg-muted text-muted-foreground border border-border'}`}>
                  {acc.type === 'FUNDED' ? 'Financé' : 'Évaluation'}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Solde Actuel</div>
                  <div className="text-4xl font-bold font-outfit tracking-tight">{acc.balance.toFixed(2)} €</div>
                </div>
                <div className="flex justify-between items-center text-sm pt-4 border-t border-border/40">
                  <span className="text-muted-foreground">Objectif de profit</span>
                  <span className="font-medium text-foreground">{acc.profitTarget > 0 ? `${acc.profitTarget.toFixed(2)} €` : 'Illimité'}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2">
                  <span className="text-muted-foreground">Drawdown Max</span>
                  <span className="font-medium text-foreground">{acc.maxDrawdown > 0 ? `${acc.maxDrawdown.toFixed(2)} €` : 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2">
                  <span className="text-muted-foreground">Statut</span>
                  <span className="font-medium text-green-500">{acc.status === 'ACTIVE' ? 'Actif' : acc.status}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
