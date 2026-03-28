import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, Copy } from "lucide-react"

export default async function AdminInvitationsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect("/login");

  // @ts-ignore
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const invitations = await db.invitation.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-outfit font-bold tracking-tight">Invitations (Système Sécurisé)</h1>
          <p className="text-muted-foreground mt-2 text-lg">Générez des jetons d'accès privés pour contrôler l'inscription.</p>
        </div>
        <Button className="rounded-full shadow-lg shadow-primary/20 h-11 px-6 transition-transform hover:scale-[1.02]">
          <Plus className="w-5 h-5 mr-2" />
          Créer un jeton
        </Button>
      </div>

      <div className="bg-card border border-border/50 rounded-[2rem] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-border/50 bg-muted/20">
                <th className="p-5 font-medium text-muted-foreground text-sm uppercase tracking-wider">Email Assigné (Optionnel)</th>
                <th className="p-5 font-medium text-muted-foreground text-sm uppercase tracking-wider">Token Code</th>
                <th className="p-5 font-medium text-muted-foreground text-sm uppercase tracking-wider">Expiration</th>
                <th className="p-5 font-medium text-muted-foreground text-sm uppercase tracking-wider">Statut</th>
                <th className="p-5 font-medium text-muted-foreground text-sm uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {invitations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">Aucune invitation n'a encore été générée.</td>
                </tr>
              ) : (
                invitations.map(inv => {
                  const isExpired = inv.expiresAt < new Date();
                  return (
                    <tr key={inv.id} className="hover:bg-muted/10 transition-colors group">
                      <td className="p-5 font-medium text-foreground">
                        {inv.email || <span className="text-muted-foreground italic bg-muted/50 px-2 py-1 rounded-md">Lien Universel (Ouvert)</span>}
                      </td>
                      <td className="p-5 font-mono text-sm">
                        <div className="flex items-center justify-between gap-4 bg-muted/30 px-3 py-1.5 rounded-lg w-fit border border-border/40">
                          <span className="font-bold tracking-widest">{inv.token}</span>
                        </div>
                      </td>
                      <td className="p-5 text-sm font-medium">
                        <div className={isExpired ? "text-red-500" : "text-foreground"}>
                          {new Date(inv.expiresAt).toLocaleDateString("fr-FR")}
                        </div>
                      </td>
                      <td className="p-5">
                         <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                          inv.isUsed ? 'bg-muted text-muted-foreground border border-border' :
                          isExpired ? 'bg-red-500/15 text-red-500 border border-red-500/20' :
                          'bg-green-500/15 text-green-500 border border-green-500/20'
                        }`}>
                          {inv.isUsed ? 'UTILISÉE' : isExpired ? 'EXPIRÉE' : 'VALIDE'}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                          <Copy className="w-4 h-4" />
                        </Button>
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
