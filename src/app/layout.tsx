import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
  title: 'OPINBACK - Financement et Évaluation de Traders',
  description: 'Identifiez votre potentiel, tradez, obtenez du capital.',
}

import { Toaster } from "sonner"
import { Providers } from "@/components/providers"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.variable} ${outfit.variable} font-inter antialiased`}>
        <Providers>
          {children}
          <Toaster position="top-right" richColors theme="dark" closeButton />
        </Providers>
      </body>
    </html>
  )
}
