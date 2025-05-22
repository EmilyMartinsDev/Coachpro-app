import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useAuth } from "@/hooks/useAuth"
import type { Aluno, Coach } from "@/lib/types"
import { AlunoService } from "@/lib/services"

interface CoachContextType {
  aluno: Aluno | null
  loading: boolean
  error: string | null
  reload: () => void
}

const AlunoContext = createContext<CoachContextType>({
  aluno: null,
  loading: true,
  error: null,
  reload: () => {},
})

export const useAlunoContext = () => useContext(AlunoContext)

export const AlunoProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const [aluno, setAluno] = useState<Aluno | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAluno = async () => {
    if (!user?.id) return
    setLoading(true)
    setError(null)
    try {
      const data = await AlunoService.getAlunoById(user.id)
      setAluno(data)
    } catch (err) {
      setError("Erro ao carregar dados do coach.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAluno()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  return (
    <AlunoContext.Provider value={{ aluno, loading, error, reload: fetchAluno }}>
      {children}
    </AlunoContext.Provider>
  )
}
