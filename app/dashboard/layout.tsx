"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, Dumbbell, MessageSquare, CreditCard, Settings, LogOut, Menu, X } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { CoachProvider } from "@/lib/CoachContext"
import { AlunoProvider } from "../AlunoContext"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  // Definir os links de navegação com base no tipo de usuário
  const navLinks =
    user?.role === "COACH"
      ? [
          { href: "/dashboard/coach", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
          { href: "/dashboard/coach/alunos", label: "Alunos", icon: <Users className="h-5 w-5" /> },
          { href: "/dashboard/coach/feedbacks", label: "Feedbacks", icon: <MessageSquare className="h-5 w-5" /> },
          { href: "/dashboard/coach/assinaturas", label: "Assinaturas", icon: <CreditCard className="h-5 w-5" /> },
          
        ]
      : [
          { href: "/dashboard/aluno", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
          { href: "/dashboard/aluno/planos", label: "Meus Planos", icon: <Dumbbell className="h-5 w-5" /> },
          { href: "/dashboard/aluno/assinaturas", label: "Assinaturas", icon: <CreditCard className="h-5 w-5" /> },
          { href: "/dashboard/aluno/feedback", label: "Enviar Feedback", icon: <MessageSquare className="h-5 w-5" /> },
        ]

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>
  }

  // Envolver children com CoachProvider apenas se for coach
  if (user?.role === "COACH") {
    return (

        <div className="flex min-h-screen">
          {/* Sidebar/Aside */}
          <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200 p-6">
            <div className="mb-8 flex items-center gap-2">
              <span className="font-bold text-lg text-emerald-700">CoachPro</span>
            </div>
            <nav className="flex-1 space-y-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-emerald-50 transition ${pathname === link.href ? 'bg-emerald-100 text-emerald-700 font-semibold' : 'text-gray-700'}`}>
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>
            <Button variant="ghost" className="mt-8 w-full flex items-center gap-2" onClick={handleLogout}>
              <LogOut className="h-5 w-5" /> Sair
            </Button>
          </aside>
          {/* Main content */}
          <main className="flex-1 bg-gray-50 min-h-screen">{children}</main>
        </div>
    )
  }

  // Layout padrão para aluno
  return (
    <div className="flex min-h-screen">
      {/* Sidebar/Aside */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200 p-6">
        <div className="mb-8 flex items-center gap-2">
          <span className="font-bold text-lg text-emerald-700">CoachPro</span>
        </div>
        <nav className="flex-1 space-y-2">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-emerald-50 transition ${pathname === link.href ? 'bg-emerald-100 text-emerald-700 font-semibold' : 'text-gray-700'}`}>
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
        <Button variant="ghost" className="mt-8 w-full flex items-center gap-2" onClick={handleLogout}>
          <LogOut className="h-5 w-5" /> Sair
        </Button>
      </aside>
      {/* Main content */}
      <main className="flex-1 bg-gray-50 min-h-screen">{children}</main>
    </div>
  )
}
