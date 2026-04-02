"use client"
import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, RefreshCcw, Activity } from "lucide-react"

type Ticker = {
  symbol: string
  lastPrice: string
  priceChangePercent: string
  volume: string
}

export function MarketOverview() {
  const [tickers, setTickers] = useState<Ticker[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMarkets = async () => {
    try {
      // Using Binance Public API for real market data
      const res = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT","SOLUSDT","BNBUSDT"]')
      const data = await res.json()
      setTickers(data)
    } catch (error) {
      console.error("Failed to fetch market data", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMarkets()
    const interval = setInterval(fetchMarkets, 10000) // Update every 10s
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32 border-2 border-dashed border-border/50 rounded-[2rem]">
        <RefreshCcw className="w-6 h-6 animate-spin text-muted-foreground mr-3" />
        <span className="text-muted-foreground font-medium uppercase tracking-wider text-xs">Connexion au marché...</span>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {tickers.map(ticker => {
        const isPositive = parseFloat(ticker.priceChangePercent) >= 0
        const name = ticker.symbol.replace('USDT', '')
        
        return (
          <div key={ticker.symbol} className="p-5 rounded-3xl bg-card border border-border/50 shadow-lg hover:shadow-xl hover:border-primary/20 transition-all group">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-white">
                  {name.substring(0, 3)}
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-tight">{name}/USD</h4>
                  <p className="text-[10px] text-muted-foreground uppercase opacity-70">Volume: {parseFloat(ticker.volume).toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                </div>
              </div>
              <div className={`p-1.5 rounded-full ${isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <span className="text-xl font-bold font-mono tracking-tighter group-hover:text-primary transition-colors">
                ${parseFloat(ticker.lastPrice).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </span>
              <span className={`text-xs font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? '+' : ''}{parseFloat(ticker.priceChangePercent).toFixed(2)}%
              </span>
            </div>
            
            <div className="mt-3 h-1 w-full bg-muted rounded-full overflow-hidden">
               <div className={`h-full rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${Math.min(Math.abs(parseFloat(ticker.priceChangePercent)) * 20, 100)}%`}}></div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
