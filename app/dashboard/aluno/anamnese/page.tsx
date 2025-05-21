"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useAluno } from "@/hooks/useAluno"
import AnamneseService from "@/lib/services/anamnese-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"

export default function AnamnesePage() {
  const router = useRouter()
  const { user } = useAuth()
  const { aluno, loading, error } = useAluno(user?.id)
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    instagram: "",
    email: "",
    cpf: "",
    endereco: "",
    dataNascimento: "",
    dataPreenchimento: format(new Date(), "yyyy-MM-dd"),
    altura: "",
    peso: "",
    rotina: "",
    objetivos: "",
    tempoTreino: "",
    modalidade: "",
    divisaoTreino: "",
    cardio: "",
    alimentacaoDiaria: "",
    alimentosPreferidos: "",
    possuiExames: false,
    qtdRefeicoes: "",
    evolucaoRecente: "",
    dificuldades: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [localLoading, setLocalLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{ path: string; message: string }[]>([])

  // Pre-fill form with existing anamnese data if available
  useEffect(() => {
    if (aluno?.anamnese) {
      setFormData({
        nomeCompleto: aluno.anamnese.nomeCompleto || "",
        instagram: aluno.anamnese.instagram || "",
        email: aluno.anamnese.email || "",
        cpf: aluno.anamnese.cpf || "",
        endereco: aluno.anamnese.endereco || "",
        dataNascimento: aluno.anamnese.dataNascimento || "",
        dataPreenchimento: aluno.anamnese.dataPreenchimento || format(new Date(), "yyyy-MM-dd"),
        altura: aluno.anamnese.altura || "",
        peso: aluno.anamnese.peso || "",
        rotina: aluno.anamnese.rotina || "",
        objetivos: aluno.anamnese.objetivos || "",
        tempoTreino: aluno.anamnese.tempoTreino || "",
        modalidade: aluno.anamnese.modalidade || "",
        divisaoTreino: aluno.anamnese.divisaoTreino || "",
        cardio: aluno.anamnese.cardio || "",
        alimentacaoDiaria: aluno.anamnese.alimentacaoDiaria || "",
        alimentosPreferidos: aluno.anamnese.alimentosPreferidos || "",
        possuiExames: aluno.anamnese.possuiExames || false,
        qtdRefeicoes: aluno.anamnese.qtdRefeicoes || "",
        evolucaoRecente: aluno.anamnese.evolucaoRecente || "",
        dificuldades: aluno.anamnese.dificuldades || "",
      })
    } else if (user) {
      setFormData((prev) => ({
        ...prev,
        nomeCompleto: user.nome || "",
        email: user.email || "",
      }))
    }
  }, [aluno, user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, possuiExames: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setFormError(null)
    setValidationErrors([])
    setLocalLoading(true)
    try {
      if (!user?.id) {
        throw new Error("Usuário não identificado")
      }
      await AnamneseService.createAnamnese({
        ...formData,
        alunoId: user.id,
      })
      // Refetch aluno data after creating/updating anamnese
      window.location.reload() // Força reload para garantir atualização do estado global
    } catch (error: any) {
      if (error?.response?.status === 400 && error.response.data?.errors) {
        setValidationErrors(error.response.data.errors)
        setFormError(error.response.data.message || "Dados inválidos")
      } else {
        console.error("Error submitting anamnese:", error)
        setFormError("Erro ao enviar anamnese. Tente novamente.")
      }
    } finally {
      setSubmitting(false)
      setLocalLoading(false)
    }
  }

  if (loading || localLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-8">
          <Skeleton className="h-10 w-1/4" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Anamnese</h1>
        <p className="mt-2 text-gray-500">
          Preencha o formulário abaixo com suas informações para que possamos conhecer melhor seus objetivos e
          necessidades.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Preencha seus dados pessoais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nomeCompleto">Nome Completo</Label>
                <Input
                  id="nomeCompleto"
                  name="nomeCompleto"
                  value={formData.nomeCompleto}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input id="instagram" name="instagram" value={formData.instagram} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input id="endereco" name="endereco" value={formData.endereco} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <Input
                  id="dataNascimento"
                  name="dataNascimento"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Informações Físicas e Objetivos</CardTitle>
            <CardDescription>Conte-nos sobre seus objetivos e condição física</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="altura">Altura (cm)</Label>
                <Input id="altura" name="altura" value={formData.altura} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="peso">Peso (kg)</Label>
                <Input id="peso" name="peso" value={formData.peso} onChange={handleChange} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="objetivos">Quais são seus objetivos?</Label>
              <Textarea id="objetivos" name="objetivos" value={formData.objetivos} onChange={handleChange} rows={3} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rotina">Descreva sua rotina diária</Label>
              <Textarea id="rotina" name="rotina" value={formData.rotina} onChange={handleChange} rows={3} />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Informações de Treino</CardTitle>
            <CardDescription>Conte-nos sobre sua experiência com treinos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tempoTreino">Há quanto tempo treina?</Label>
                <Input id="tempoTreino" name="tempoTreino" value={formData.tempoTreino} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modalidade">Modalidade de treino</Label>
                <Input id="modalidade" name="modalidade" value={formData.modalidade} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="divisaoTreino">Divisão de treino atual</Label>
                <Input id="divisaoTreino" name="divisaoTreino" value={formData.divisaoTreino} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardio">Faz cardio? Qual frequência?</Label>
                <Input id="cardio" name="cardio" value={formData.cardio} onChange={handleChange} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Informações Alimentares</CardTitle>
            <CardDescription>Conte-nos sobre sua alimentação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="alimentacaoDiaria">Como é sua alimentação diária?</Label>
              <Textarea
                id="alimentacaoDiaria"
                name="alimentacaoDiaria"
                value={formData.alimentacaoDiaria}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alimentosPreferidos">Quais são seus alimentos preferidos?</Label>
              <Textarea
                id="alimentosPreferidos"
                name="alimentosPreferidos"
                value={formData.alimentosPreferidos}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="qtdRefeicoes">Quantas refeições você faz por dia?</Label>
              <Input id="qtdRefeicoes" name="qtdRefeicoes" value={formData.qtdRefeicoes} onChange={handleChange} />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="possuiExames" checked={formData.possuiExames} onCheckedChange={handleCheckboxChange} />
              <Label htmlFor="possuiExames">Possui exames recentes?</Label>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Informações Adicionais</CardTitle>
            <CardDescription>Outras informações relevantes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="evolucaoRecente">Como tem sido sua evolução recente?</Label>
              <Textarea
                id="evolucaoRecente"
                name="evolucaoRecente"
                value={formData.evolucaoRecente}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dificuldades">Quais são suas maiores dificuldades?</Label>
              <Textarea
                id="dificuldades"
                name="dificuldades"
                value={formData.dificuldades}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Enviando..." : aluno?.anamnese ? "Atualizar Anamnese" : "Enviar Anamnese"}
            </Button>
          </CardFooter>
        </Card>

        {formError && (
          <div className="mt-4 rounded-md bg-red-50 p-4 text-red-700">
            <p>{formError}</p>
            {validationErrors.length > 0 && (
              <ul className="mt-2 list-disc list-inside text-sm">
                {validationErrors.map((err, idx) => (
                  <li key={idx}><strong>{err.path}:</strong> {err.message}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </form>
    </div>
  )
}
