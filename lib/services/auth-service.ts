import api from "../api"
import type { User } from "../types"

export interface LoginRequest {
  email: string
  senha: string
  role: "COACH" | "ALUNO"
}

export interface RegisterCoachRequest {
  nome: string
  email: string
  senha: string
  telefone: string
  dataNascimento: string
}

export interface RegisterAlunoRequest {
  nome: string
  email: string
  senha: string
  telefone: string
  dataNascimento: string
  coachId: string
}

export interface AuthResponse {
  data:{
  token: string
  user: User
  }
}

const AuthService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/api/auth/login", data)
    return response.data
  },

  registerCoach: async (data: RegisterCoachRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/api/auth/coach/register", data)
    return response.data
  },

  registerAluno: async (data: RegisterAlunoRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/api/auth/aluno/register", data)
    return response.data
  },

  logout: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
  },

  getCurrentUser: (): User | null => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user")
      return user ? JSON?.parse(user) : null
    }
    return null
  },

  saveAuthData: (data: AuthResponse): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", data.data.token)
      localStorage.setItem("user", JSON.stringify(data.data.user))
    }
  },

  isAuthenticated: (): boolean => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("token")
    }
    return false
  },
}

export default AuthService
