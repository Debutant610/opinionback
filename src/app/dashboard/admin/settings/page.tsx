"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { KeyRound, ShieldCheck, Globe, Save, Loader2, RefreshCcw } from "lucide-react"
import { toast } from "sonner"

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [settings, setSettings] = useState({
    brokerApiKey: "",
    brokerPassword: "",
    brokerUrl: ""
  })

  const fetchSettings = async () => {
    try {
      setFetching(true)
      const res = await fetch("/api/admin/settings")
      if (res.ok) {
        const data = await res.json()
        setSettings({
          brokerApiKey: data.brokerApiKey || "",
          brokerPassword: data.brokerPassword || "",
          brokerUrl: data.brokerUrl || ""
        })
      }
    } catch (error) {
      toast.error("Impossible de charger les paramètres")
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      })

      if (res.ok) {
        toast.success("Paramètres mis à jour avec succès")
      } else {
        toast.error("Échec de la mise à jour")
      }
    } catch (error) {
      toast.error("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-outfit font-bold tracking-tight mb-1 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Paramètres Système</h1>
          <p className="text-muted-foreground">Configurez la connexion avec votre broker et l'infrastructure.</p>
        </div>
        <Button variant="outline" size="icon" onClick={fetchSettings} disabled={fetching}>
          <RefreshCcw className={`w-4 h-4 ${fetching ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="grid gap-6">
        <Card className="bg-card/50 backdrop-blur-md border-border/50 shadow-xl overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary/40 group-hover:bg-primary transition-colors duration-300" />
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="font-outfit">Configuration du Broker</CardTitle>
            </div>
            <CardDescription>Entrez vos clés API et mot de passe broker pour synchroniser les trades.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="apiKey" className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-muted-foreground" />
                    Broker API Key
                  </Label>
                  <Input 
                    id="apiKey"
                    value={settings.brokerApiKey}
                    onChange={(e) => setSettings({...settings, brokerApiKey: e.target.value})}
                    placeholder="Entrez votre clé API..."
                    className="bg-muted/40 border-border/40 focus:ring-primary/40 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiPassword">Mot de passe API (Optionnel)</Label>
                  <Input 
                    id="apiPassword"
                    type="password"
                    value={settings.brokerPassword}
                    onChange={(e) => setSettings({...settings, brokerPassword: e.target.value})}
                    placeholder="••••••••"
                    className="bg-muted/40 border-border/40 focus:ring-primary/40 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brokerUrl" className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  URL du Broker / API Endpoint
                </Label>
                <Input 
                  id="brokerUrl"
                  value={settings.brokerUrl}
                  onChange={(e) => setSettings({...settings, brokerUrl: e.target.value})}
                  placeholder="https://api.votrebroker.com/v1"
                  className="bg-muted/40 border-border/40 focus:ring-primary/40 transition-all"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={loading} className="px-8 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Sauvegarder les modifications
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Security Info Card */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex gap-4 items-start">
          <ShieldCheck className="w-6 h-6 text-primary shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-primary mb-1">Sécurité des Clés API</h4>
            <p className="text-sm text-primary/80 leading-relaxed">
              Vos informations de connexion broker sont stockées de manière sécurisée dans votre base de données principale. Ne partagez jamais ces clés avec des tiers non autorisés.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
