import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { LogoutButton } from "@/components/logout-button"
import { LayoutDashboard, Users, CreditCard, Send, Settings, ShieldAlert, BarChart3, TrendingUp, LifeBuoy } from "lucide-react"

import { Breadcrumbs } from "@/components/breadcrumbs"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // @ts-ignore
  const isAdmin = session.user.role === "ADMIN";

  return (
    <div className="flex min-h-screen bg-background font-inter selection:bg-primary/30 selection:text-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden lg:flex h-screen w-72 flex-col border-r border-border/50 bg-card/50 backdrop-blur-xl z-50">
        <div className="p-8 border-b border-border/40 flex flex-col items-center gap-4">
          <Link href="/dashboard" className="flex flex-col items-center gap-3 group">
            <img src="/logo.png" alt="Logo" className="h-12 w-auto group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
            <span className="font-outfit font-extrabold text-xl tracking-tighter text-foreground">OPINBACK</span>
          </Link>
        </div>
          <div className="flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border/50">
            {isAdmin ? <ShieldAlert className="w-3 h-3 text-primary" /> : <LayoutDashboard className="w-3 h-3 text-blue-500" />}
            <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
              {isAdmin ? "Espace Admin" : "Espace Trader"}
            </span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-primary/10 text-primary text-sm font-medium transition-colors shadow-sm">
            <LayoutDashboard className="w-4 h-4" /> Vue d'ensemble
          </Link>

          {!isAdmin && (
            <>
              <Link href="/dashboard/accounts" className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-muted/60 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground">
                <CreditCard className="w-4 h-4" /> Mes Comptes
              </Link>
              <Link href="/dashboard/trades" className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-muted/60 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground">
                <BarChart3 className="w-4 h-4" /> Mes Trades
              </Link>
              <Link href="/dashboard/withdrawals" className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-muted/60 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground">
                <Send className="w-4 h-4" /> Retraits
              </Link>
              <Link href="/dashboard/rules" className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-muted/60 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground">
                <ShieldAlert className="w-4 h-4" /> Règles
              </Link>
              <Link href="/dashboard/support" className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-muted/60 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground">
                <LifeBuoy className="w-4 h-4" /> Support
              </Link>
              <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-muted/60 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground">
                <Settings className="w-4 h-4" /> Mon Profil
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <Link href="/dashboard/admin/users" className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-muted/60 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground">
                <Users className="w-4 h-4" /> Annuaire Traders
              </Link>
              <Link href="/dashboard/admin/performance" className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-muted/60 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground">
                <TrendingUp className="w-4 h-4" /> Performances
              </Link>
              <Link href="/dashboard/admin/withdrawals" className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-muted/60 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground">
                <Send className="w-4 h-4" /> Valider Retraits
              </Link>
              <Link href="/dashboard/admin/invitations" className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-muted/60 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground">
                <Settings className="w-4 h-4" /> Invitations
              </Link>
              <Link href="/dashboard/admin/settings" className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-muted/60 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground">
                <Settings className="w-4 h-4" /> Paramètres
              </Link>
            </>
          )}
        </nav>

        <div className="p-6 border-t border-border/40">
          <div className="text-xs font-medium mb-4 truncate text-center text-muted-foreground/80 px-2">
             {session.user.email}
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden relative">
         <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full point-events-none -z-10" />
        <div className="container mx-auto p-4 md:p-8 lg:p-10 xl:max-w-6xl animate-fade-in-up">
          {children}
        </div>
      </main>
    </div>
  )
}
