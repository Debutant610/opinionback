"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"

const data = [
  { day: "Lun", pnl: 0 },
  { day: "Mar", pnl: 400 },
  { day: "Mer", pnl: 300 },
  { day: "Jeu", pnl: 800 },
  { day: "Ven", pnl: 600 },
  { day: "Sam", pnl: 950 },
  { day: "Dim", pnl: 1200 },
]

export function PerformanceChart() {
  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#888", fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            hide 
            domain={['dataMin - 100', 'dataMax + 100']}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-xl border border-border/50 bg-card p-3 shadow-xl backdrop-blur-md">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Profit</div>
                    <div className="text-lg font-bold text-primary">{payload[0].value} €</div>
                  </div>
                )
              }
              return null
            }}
          />
          <Line
            type="monotone"
            dataKey="pnl"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0, fill: "#3b82f6" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
