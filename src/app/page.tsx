import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, BarChart3, ShieldCheck, Wallet } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <img src="/logo.png" alt="OPINBACK Logo" className="h-10 w-auto group-hover:scale-105 transition-transform duration-300" />
              <span className="font-outfit font-extrabold text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">OPINBACK</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Fonctionnalités</Link>
            <Link href="#rules" className="hover:text-foreground transition-colors">Règles</Link>
            <Link href="#faq" className="hover:text-foreground transition-colors">FAQ</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <span className="text-sm font-medium hover:text-primary transition-colors cursor-pointer dark:text-gray-300 hidden md:inline-block">Connexion</span>
            </Link>
            <Button asChild className="rounded-full shadow-lg shadow-primary/20">
              <Link href="/register">Commencer <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 relative z-10">
        <section className="container mx-auto px-4 pt-32 pb-24 text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-8 backdrop-blur-sm shadow-sm opacity-0 animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            Rejoignez la nouvelle ère du Prop Trading
          </div>
          <h1 className="font-outfit text-5xl md:text-7xl font-bold tracking-tight mb-8 max-w-5xl mx-auto leading-tight opacity-0 animate-fade-in-up" style={{animationDelay: '100ms', animationFillMode: 'forwards'}}>
            Prouvez vos compétences.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Obtenez du capital.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground/80 mb-12 max-w-2xl mx-auto leading-relaxed opacity-0 animate-fade-in-up" style={{animationDelay: '200ms', animationFillMode: 'forwards'}}>
            OPINBACK évalue vos performances de trading sur un compte de test. Respectez nos règles de gestion de risque et obtenez un financement réel allant jusqu'à 200 000€.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-up" style={{animationDelay: '300ms', animationFillMode: 'forwards'}}>
            <Button asChild size="lg" className="rounded-full h-14 px-8 text-base shadow-xl shadow-primary/25 hover:shadow-primary/40 group transition-all">
              <Link href="/register">
                Démarrer l'évaluation
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full h-14 px-8 text-base border-primary/20 hover:bg-primary/10 transition-all text-white hover:text-white">
              <Link href="#features">Voir les règles</Link>
            </Button>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="container mx-auto px-4 py-24 border-t border-border/20">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="p-8 rounded-[2rem] bg-gradient-to-b from-background to-muted/20 border border-border/50 shadow-lg relative overflow-hidden group hover:border-primary/50 hover:shadow-primary/5 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300 border border-primary/10">
                <BarChart3 className="w-7 h-7" />
              </div>
              <h3 className="font-outfit text-xl font-bold mb-3">Évaluation juste</h3>
              <p className="text-muted-foreground leading-relaxed">Prouvez votre rentabilité sur nos comptes de test avec des conditions de marché réelles et sans aucune pression temporelle.</p>
            </div>
            
            <div className="p-8 rounded-[2rem] bg-gradient-to-b from-background to-muted/20 border border-border/50 shadow-lg relative overflow-hidden group hover:border-blue-500/50 hover:shadow-blue-500/5 transition-all duration-300 md:-translate-y-4">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Wallet className="w-32 h-32" />
              </div>
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform duration-300 border border-blue-500/10">
                  <Wallet className="w-7 h-7" />
                </div>
                <h3 className="font-outfit text-xl font-bold mb-3">Capital garanti</h3>
                <p className="text-muted-foreground leading-relaxed">Une fois validé, tradez avec notre capital. Gardez jusqu'à 90% des profits générés avec une infrastructure robuste.</p>
              </div>
            </div>

            <div className="p-8 rounded-[2rem] bg-gradient-to-b from-background to-muted/20 border border-border/50 shadow-lg relative overflow-hidden group hover:border-primary/50 hover:shadow-primary/5 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300 border border-primary/10">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="font-outfit text-xl font-bold mb-3">Retraits rapides</h3>
              <p className="text-muted-foreground leading-relaxed">Demandez votre paiement à tout moment depuis votre tableau de bord et recevez-le en toute sécurité sous 24h.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
