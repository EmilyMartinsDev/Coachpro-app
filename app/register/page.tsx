"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const { registerCoach, registerAluno, error, isLoading } = useAuth()
  const [userType, setUserType] = useState<"coach" | "aluno">("coach")

  // Common fields
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [telefone, setTelefone] = useState("")
  const [dataNascimento, setDataNascimento] = useState("")

  // Aluno specific fields
  const [coachId, setCoachId] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (userType === "coach") {
      await registerCoach({
        nome,
        email,
        senha,
        telefone,
        dataNascimento,
      })
    } else {
      await registerAluno({
        nome,
        email,
        senha,
        telefone,
        dataNascimento,
        coachId,
      })
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Criar conta</CardTitle>
          <CardDescription>Preencha os dados para criar sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="coach" onValueChange={(value) => setUserType(value as "coach" | "aluno")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="coach">Coach</TabsTrigger>
              <TabsTrigger value="aluno">Aluno</TabsTrigger>
            </TabsList>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome completo</Label>
                <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <Input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  required
                />
              </div>

              {userType === "aluno" && (
                <div className="space-y-2">
                  <Label htmlFor="coachId">ID do Coach</Label>
                  <Input id="coachId" value={coachId} onChange={(e) => setCoachId(e.target.value)} required />
                </div>
              )}

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Registrando..." : "Registrar"}
              </Button>
            </form>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-gray-500">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Faça login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
