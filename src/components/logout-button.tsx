"use client"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  return (
    <Button 
      variant="outline" 
      className="w-full justify-start rounded-xl text-muted-foreground hover:text-red-500 hover:bg-destructive/10 hover:border-destructive/30 transition-colors"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      <LogOut className="mr-2 w-4 h-4" />
      Déconnexion
    </Button>
  )
}
