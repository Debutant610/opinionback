import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { ShieldCheck, AlertCircle, Info, Timer, Target, TrendingDown } from "lucide-react"

export default async function RulesPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect("/login")

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    include: { accounts: true }
  })

  const hasFunded = user?.accounts.some(a => a.type === "FUNDED")

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-outfit font-bold tracking-tight">Règles de Trading</h1>
        <p className="text-muted-foreground mt-2 text-lg">Veuillez respecter ces consignes pour conserver l'éligibilité de votre compte.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-8 rounded-[2rem] bg-card border border-border/50 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <TrendingDown className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold">Drawdown Maximum</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            La perte maximale autorisée est de **10%** du capital initial. Si votre solde descend en dessous de ce seuil, votre compte sera automatiquement suspendu.
          </p>
          <div className="pt-2 flex items-center gap-2 text-xs font-medium text-amber-500">
            <AlertCircle className="w-4 h-4" /> Calculé sur l'équité totale (Equity).
          </div>
        </div>

        <div className="p-8 rounded-[2rem] bg-card border border-border/50 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold">Objectif de Profit</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Pour passer d'un compte Démo à un compte Financé, vous devez atteindre un objectif de profit de **10%** sans enfreindre les règles de drawdown.
          </p>
          <div className="pt-2 flex items-center gap-2 text-xs font-medium text-green-500">
            <ShieldCheck className="w-4 h-4" /> Aucun délai de temps imposé.
          </div>
        </div>

        <div className="p-8 rounded-[2rem] bg-card border border-border/50 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Timer className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold">Jours de Trading Minimum</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Un minimum de **5 jours de trading actifs** est requis avant de pouvoir solliciter un passage en compte réel ou un retrait de bénéfices.
          </p>
        </div>

        <div className="p-8 rounded-[2rem] bg-card border border-border/50 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Info className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold">Restrictions de Bots</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            L'utilisation d'Expert Advisors (EA) ou de bots automatisés est **strictement interdite** sauf accord préalable de l'administration.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-[2rem] bg-amber-500/5 border border-amber-500/10">
        <h4 className="font-bold text-amber-500 mb-2 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" /> Important
        </h4>
        <p className="text-sm text-muted-foreground">
          Toute tentative de manipulation des prix ou d'utilisation de failles techniques entraînera un bannissement définitif immédiat sans remboursement des frais d'inscription éventuels.
        </p>
      </div>
    </div>
  )
}
