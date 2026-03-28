import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Clock } from "lucide-react"

export default async function WithdrawalsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect("/login");

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    include: { withdrawals: true, accounts: true }
  })
  if (!user || user.role === "ADMIN") redirect("/dashboard");

  // On calcule le solde total disponible sur les comptes FUNDED
  const withdrawableBalance = user.accounts
    .filter(a => a.type === "FUNDED")
    .reduce((acc, curr) => acc + curr.balance, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-outfit font-bold tracking-tight">Retraits</h1>
          <p className="text-muted-foreground mt-2 text-lg">Gérez vos demandes de paiements.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="p-8 rounded-[2rem] bg-card border border-border/50 shadow-lg">
            <h2 className="text-xl font-bold font-outfit mb-6">Nouvelle Demande</h2>
            {withdrawableBalance <= 0 ? (
              <div className="p-6 rounded-2xl bg-muted/50 border border-border/50 text-center flex flex-col items-center justify-center space-y-3">
                <AlertCircle className="w-8 h-8 text-muted-foreground" />
                <p className="text-muted-foreground">Vous n'avez actuellement aucun compte financé avec un solde positif.</p>
              </div>
            ) : (
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Montant à retirer (€)</Label>
                  <Input id="amount" type="number" placeholder="Ex: 500" max={withdrawableBalance} min="50" className="h-12 text-lg" />
                  <p className="text-xs text-muted-foreground mt-1">Montant maximum retirable : <span className="font-bold text-foreground">{withdrawableBalance.toFixed(2)} €</span></p>
                </div>
                <Button type="submit" className="w-full h-12 text-base font-medium rounded-xl shadow-lg shadow-primary/20">Soumettre la demande</Button>
              </form>
            )}
          </div>

          <div className="p-8 rounded-[2rem] bg-card border border-border/50 shadow-lg">
            <h2 className="text-xl font-bold font-outfit mb-6">Historique des demandes</h2>
            {user.withdrawals.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Aucun retrait effectué pour le moment.</p>
            ) : (
              <div className="space-y-4">
                {user.withdrawals.map(w => (
                  <div key={w.id} className="flex justify-between items-center p-4 rounded-xl border border-border/40 hover:bg-muted/30 transition-colors">
                    <div>
                      <div className="font-bold text-lg">{w.amount.toFixed(2)} €</div>
                      <div className="text-xs text-muted-foreground">{new Date(w.requestedAt).toLocaleDateString("fr-FR")}</div>
                    </div>
                    <div>
                      {w.status === 'PENDING' && <span className="flex items-center text-amber-500 text-sm font-medium"><Clock className="w-4 h-4 mr-1"/> En attente</span>}
                      {w.status === 'APPROVED' && <span className="flex items-center text-green-500 text-sm font-medium"><CheckCircle2 className="w-4 h-4 mr-1"/> Approuvé</span>}
                      {w.status === 'REJECTED' && <span className="flex items-center text-red-500 text-sm font-medium"><AlertCircle className="w-4 h-4 mr-1"/> Rejeté</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-[2rem] bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <h3 className="font-bold mb-4 flex items-center"><AlertCircle className="w-5 h-5 mr-2 text-primary"/> Informations utiles</h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><strong className="text-foreground">Délai:</strong> Les demandes sont traitées sous 24 à 48 heures ouvrées.</li>
              <li><strong className="text-foreground">Moyen de paiement:</strong> Via RIB/IBAN ou Crypto. Veuillez compléter votre profil.</li>
              <li><strong className="text-foreground">Minimum:</strong> Le montant minimum par retrait est de 50€.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
