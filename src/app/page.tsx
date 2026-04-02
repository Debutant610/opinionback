"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, BarChart3, ShieldCheck, Wallet, Globe, Activity } from "lucide-react"

function TradingAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.15] z-0">
      <div className="w-full h-full relative">
        {/* 3D Grid Perspective */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] [mask-image:linear-gradient(to_bottom,transparent,black)] perspective-[1000px]">
           <div className="absolute inset-0 border-t border-primary/20 rotate-x-60 scale-150 origin-bottom 
              [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] 
              [background-size:4rem_4rem]">
           </div>
        </div>
        
        {/* Animated Trading Line */}
        <svg className="absolute bottom-10 left-0 w-full h-[60%] animate-draw-chart" preserveAspectRatio="none" viewBox="0 0 1000 300">
          <path d="M0 300 L50 280 L100 290 L150 250 L200 260 L250 200 L300 220 L350 150 L400 170 L450 100 L500 120 L550 50 L600 80 L650 30 L700 60 L750 10 L800 40 L850 0 L900 20 L950 0 L1000 10" 
            fill="none" 
            stroke="url(#chartGradient)" 
            strokeWidth="3"
            className="drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]"
            strokeDasharray="2000"
            strokeDashoffset="0"
          >
            <animate attributeName="stroke-dashoffset" from="2000" to="0" dur="8s" fill="freeze" />
          </path>
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  )
}

export default function Home() {
  const [lang, setLang] = useState<'FR' | 'EN'>('FR')

  const changeLang = () => setLang(l => l === 'FR' ? 'EN' : 'FR')

  const t = {
    features: lang === 'FR' ? 'Fonctionnalités' : 'Features',
    rules: lang === 'FR' ? 'Règles' : 'Rules',
    faq: lang === 'FR' ? 'FAQ' : 'FAQ',
    login: lang === 'FR' ? 'Connexion' : 'Login',
    start: lang === 'FR' ? 'Commencer' : 'Start now',
    heroTag: lang === 'FR' ? 'La nouvelle norme du Prop Trading Européen' : 'The New Standard of European Prop Trading',
    heroTitle1: lang === 'FR' ? 'Tradez notre capital.' : 'Trade our capital.',
    heroTitle2: lang === 'FR' ? 'Gardez 90% des profits.' : 'Keep 90% of profits.',
    heroDesc: lang === 'FR' ? "Une infrastructure technologique de pointe. Passez notre évaluation en toute transparence et obtenez un financement institutionnel jusqu'à 200 000€." : "State-of-the-art technology infrastructure. Pass our evaluation transparently and get institutional funding up to €200,000.",
    btnEval: lang === 'FR' ? "Démarrer une évaluation" : "Start Evaluation",
    feat1Title: lang === 'FR' ? 'Technologie Avancée' : 'Advanced Technology',
    feat1Desc: lang === 'FR' ? 'Exécution ultra-rapide, spread institutionnel nul et intégration API en temps réel pour des analyses pures et précises.' : 'Ultra-fast execution, zero institutional spread, and real-time API integration for pure and precise analysis.',
    feat2Title: lang === 'FR' ? 'Capital Garanti' : 'Guaranteed Capital',
    feat2Desc: lang === 'FR' ? 'Une fois certifié, nous mettons notre capital réel à votre disposition. Pas de perte pour vous, uniquement le partage des mérites.' : 'Once certified, we put our real capital at your disposal. No loss for you, only the sharing of merits.',
    feat3Title: lang === 'FR' ? 'Retraits Garantis 24h' : '24h Guaranteed Payouts',
    feat3Desc: lang === 'FR' ? 'Bénéficiez de paiements crypto et IBAN traités dans un délai sécurisé et mondialement reconnu.' : 'Enjoy crypto and IBAN payouts processed within a globally recognized secure timeframe.'
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#050510] relative overflow-hidden font-sans text-white">
      {/* 3D Background Lighting Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 blur-[150px] rounded-full pointer-events-none animate-pulse duration-1000" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none animate-pulse duration-[3000ms]" />
      
      <TradingAnimation />

      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#050510]/60 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <img src="/logo.png" alt="Logo" className="h-10 w-auto group-hover:scale-105 transition-transform duration-300 brightness-150 invert mix-blend-screen" />
              <span className="font-outfit font-extrabold text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">OPINBACK</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link href="#features" className="hover:text-white transition-colors">{t.features}</Link>
            <Link href="#rules" className="hover:text-white transition-colors">{t.rules}</Link>
            <Link href="#faq" className="hover:text-white transition-colors">{t.faq}</Link>
          </nav>
          <div className="flex items-center gap-6">
            {/* Language Switch */}
            <div onClick={changeLang} className="hidden md:flex items-center gap-1.5 text-slate-400 hover:text-white cursor-pointer transition-colors text-xs font-bold bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10 select-none">
               <Globe className="w-3.5 h-3.5" />
               <span className={lang === 'FR' ? 'text-white' : ''}>FR</span>
               <span className="opacity-30">|</span>
               <span className={lang === 'EN' ? 'text-white' : ''}>EN</span>
            </div>
            
            <Link href="/login">
              <span className="text-sm font-bold text-slate-300 hover:text-white transition-colors cursor-pointer hidden md:inline-block">{t.login}</span>
            </Link>
            <Button asChild className="rounded-full shadow-[0_0_20px_rgba(59,130,246,0.4)] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border-0 h-11 px-6">
              <Link href="/register">{t.start} <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 relative z-10">
        <section className="container mx-auto px-4 pt-32 pb-32 text-center">
          <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-bold text-blue-400 mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.15)] opacity-0 animate-fade-in-up">
            <Activity className="w-4 h-4 mr-2 animate-pulse text-green-400" />
            {t.heroTag}
          </div>
          
          <h1 className="font-outfit text-6xl md:text-8xl font-black tracking-tighter mb-8 max-w-5xl mx-auto leading-[1.1] opacity-0 animate-fade-in-up drop-shadow-2xl" style={{animationDelay: '100ms', animationFillMode: 'forwards'}}>
             {t.heroTitle1}<br/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">{t.heroTitle2}</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 mb-14 max-w-3xl mx-auto leading-relaxed opacity-0 animate-fade-in-up font-medium" style={{animationDelay: '200ms', animationFillMode: 'forwards'}}>
            {t.heroDesc}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 opacity-0 animate-fade-in-up" style={{animationDelay: '300ms', animationFillMode: 'forwards'}}>
            <Button asChild size="lg" className="rounded-2xl h-16 px-10 text-lg font-bold shadow-[0_0_40px_rgba(59,130,246,0.5)] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border-0 group transition-all hover:-translate-y-1">
              <Link href="/register">
                {t.btnEval}
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Features Grid - 3D Glassmorphism */}
        <section id="features" className="container mx-auto px-4 py-24 relative z-20">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            <div className="p-10 rounded-[2.5rem] bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-blue-500/50 hover:bg-slate-900/60 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/10 flex items-center justify-center text-blue-400 mb-8 border border-white/5 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h3 className="font-outfit text-2xl font-bold mb-4 text-white">{t.feat1Title}</h3>
              <p className="text-slate-400 leading-relaxed text-lg">{t.feat1Desc}</p>
            </div>
            
            <div className="p-10 rounded-[2.5rem] bg-gradient-to-b from-blue-900/20 to-slate-900/40 backdrop-blur-xl border border-blue-500/20 shadow-[0_8px_32px_rgba(59,130,246,0.15)] relative overflow-hidden group hover:border-blue-400/60 transition-all duration-500 md:-translate-y-6">
              <div className="absolute top-0 right-0 p-4 opacity-5 mix-blend-screen">
                 <Wallet className="w-48 h-48" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white mb-8 shadow-[0_0_20px_rgba(59,130,246,0.5)] group-hover:scale-110 transition-transform duration-500">
                  <Wallet className="w-8 h-8" />
                </div>
                <h3 className="font-outfit text-2xl font-bold mb-4 text-white">{t.feat2Title}</h3>
                <p className="text-slate-300 leading-relaxed text-lg">{t.feat2Desc}</p>
              </div>
            </div>

            <div className="p-10 rounded-[2.5rem] bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-bl from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 flex items-center justify-center text-indigo-400 mb-8 border border-white/5 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="font-outfit text-2xl font-bold mb-4 text-white">{t.feat3Title}</h3>
              <p className="text-slate-400 leading-relaxed text-lg">{t.feat3Desc}</p>
            </div>
            
          </div>
        </section>
      </main>
    </div>
  )
}
