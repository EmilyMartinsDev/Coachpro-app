"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, Dumbbell, MessageSquare, CreditCard, Settings, LogOut, Menu, X } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

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
    user?.tipo === "coach"
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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar para desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r">
        <div className="p-4 border-b">
          <Link href="/" className="flex items-center">
            <h1 className="text-xl font-bold text-emerald-600">CoachPro</h1>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                pathname === link.href ? "bg-emerald-50 text-emerald-600" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {link.icon}
              <span className="ml-3">{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t space-y-1">
          <Link
            href={`/dashboard/${user.tipo}/configuracoes`}
            className="flex items-center px-4 py-3 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Settings className="h-5 w-5" />
            <span className="ml-3">Configurações</span>
          </Link>
          <Button
            variant="ghost"
            className="flex items-center w-full px-4 py-3 rounded-md text-gray-600 hover:bg-gray-100 transition-colors justify-start"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3">Sair</span>
          </Button>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header para mobile */}
        <header className="bg-white border-b md:hidden">
          <div className="flex items-center justify-between p-4">
            <Link href="/" className="flex items-center">
              <h1 className="text-xl font-bold text-emerald-600">CoachPro</h1>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Menu mobile */}
          {mobileMenuOpen && (
            <nav className="p-4 space-y-1 border-t">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                    pathname === link.href ? "bg-emerald-50 text-emerald-600" : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.icon}
                  <span className="ml-3">{link.label}</span>
                </Link>
              ))}
              <Link
                href={`/dashboard/${user.tipo}/configuracoes`}
                className="flex items-center px-4 py-3 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="h-5 w-5" />
                <span className="ml-3">Configurações</span>
              </Link>
              <Button
                variant="ghost"
                className="flex items-center w-full px-4 py-3 rounded-md text-gray-600 hover:bg-gray-100 transition-colors justify-start"
                onClick={() => {
                  handleLogout()
                  setMobileMenuOpen(false)
                }}
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-3">Sair</span>
              </Button>
            </nav>
          )}
        </header>

        {/* Conteúdo da página */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
