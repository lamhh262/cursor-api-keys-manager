"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" className="flex-1 hover:bg-accent">
        <div className="flex items-center gap-2">
          <Sun className="h-4 w-4" />
          <span className="text-sm">Theme</span>
        </div>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      className="flex-1 hover:bg-accent"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <div className="flex items-center gap-2">
        {theme === "dark" ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
        <span className="text-sm">Theme</span>
      </div>
    </Button>
  )
}
