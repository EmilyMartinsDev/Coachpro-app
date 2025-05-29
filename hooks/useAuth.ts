"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/lib/services"
import type { LoginRequest, RegisterCoachRequest, RegisterAlunoRequest } from "@/lib/services"
import type { User } from "@/lib/types"

export function useAuth() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = AuthService.isAuthenticated()
      setIsAuthenticated(isAuth)
      setUser(AuthService.getCurrentUser())
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (data: LoginRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await AuthService.login(data)
      AuthService.saveAuthData(response)
      setIsAuthenticated(true)
      setUser(response.data.user)

      // Redirect based on user type
      if (response?.data?.user?.role === "COACH") {
        router.push("/dashboard/coach")
      } else {
        router.push("/dashboard/aluno")
      }

      return true
    } catch (err) {
      console.error("Login error:", err)
      setError("Email ou senha inválidos")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const registerCoach = async (data: RegisterCoachRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await AuthService.registerCoach(data)
      AuthService.saveAuthData(response)
      setIsAuthenticated(true)
      setUser(response.data.user)
      router.push("/dashboard/coach")
      return true
    } catch (err) {
      console.error("Register error:", err)
      setError("Erro ao cadastrar. Tente novamente.")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const registerAluno = async (data: RegisterAlunoRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await AuthService.registerAluno(data)
      AuthService.saveAuthData(response)
      setIsAuthenticated(true)
      setUser(response.data.user)
      router.push("/dashboard/aluno")
      return true
    } catch (err) {
      console.error("Register error:", err)
      setError("Erro ao cadastrar. Tente novamente.")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    AuthService.logout()
    setIsAuthenticated(false)
    setUser(null)
    router.push("/login")
  }

  return {
    isLoading,
    isAuthenticated,
    user,
    error,
    login,
    registerCoach,
    registerAluno,
    logout,
  }
}
