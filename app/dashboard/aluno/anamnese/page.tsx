"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { useAnamneseAluno } from "@/hooks/aluno/useAnamneseAluno"

export default function AnamnesePage() {
  const router = useRouter()
  const { user } = useAuth()
  const { createAnamnese } = useAnamneseAluno()

  const [formData, setFormData] = useState({
    nomeCompleto: user?.nome || "",
    instagram: "",
    email: user?.email || "",
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
    dificuldades: ""
  })

  const [photos, setPhotos] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, possuiExames: checked }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setFormError(null)
    try {
      if (!user?.id) throw new Error("Usuário não autenticado")

      await createAnamnese({ ...formData, alunoId: user.id }, photos)

      router.refresh()
      router.push("/dashboard/aluno")
    } catch (error: any) {
      console.error("Erro ao enviar anamnese:", error)
      setFormError("Erro ao enviar anamnese. Tente novamente.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-4">Anamnese</h1>
      <p className="mb-6 text-gray-500">Preencha o formulário com informações importantes para o seu acompanhamento.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Essas informações ajudam na sua identificação e contato.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField id="nomeCompleto" label="Nome Completo" value={formData.nomeCompleto} onChange={handleChange} required />
            <FormField id="instagram" label="Instagram (com @)" value={formData.instagram} onChange={handleChange} />
            <FormField id="email" label="Email" value={formData.email} onChange={handleChange} required type="email" />
            <FormField id="cpf" label="CPF" value={formData.cpf} onChange={handleChange} required />
            <FormField id="endereco" label="Endereço completo" value={formData.endereco} onChange={handleChange} required />
            <FormField id="dataNascimento" label="Data de Nascimento" value={formData.dataNascimento} onChange={handleChange} type="date" required />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações Físicas e Treino</CardTitle>
            <CardDescription>Dados sobre seu físico atual e rotina de exercícios.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField id="altura" label="Altura (em cm)" value={formData.altura} onChange={handleChange} />
            <FormField id="peso" label="Peso (em kg)" value={formData.peso} onChange={handleChange} />
            <FormField id="tempoTreino" label="Tempo de treino (anos/meses)" value={formData.tempoTreino} onChange={handleChange} />
            <FormField id="modalidade" label="Modalidade de treino" value={formData.modalidade} onChange={handleChange} />
            <FormField id="divisaoTreino" label="Divisão de treino atual" value={formData.divisaoTreino} onChange={handleChange} />
            <FormField id="cardio" label="Faz cardio? Frequência" value={formData.cardio} onChange={handleChange} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hábitos Alimentares</CardTitle>
            <CardDescription>Essencial para adequação nutricional.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <TextAreaField id="alimentacaoDiaria" label="Como é sua alimentação diária?" value={formData.alimentacaoDiaria} onChange={handleChange} />
            <TextAreaField id="alimentosPreferidos" label="Alimentos que você mais gosta" value={formData.alimentosPreferidos} onChange={handleChange} />
            <FormField id="qtdRefeicoes" label="Quantidade de refeições por dia" value={formData.qtdRefeicoes} onChange={handleChange} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Objetivos e Dificuldades</CardTitle>
            <CardDescription>Para entender melhor suas metas e obstáculos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <TextAreaField id="objetivos" label="Quais são seus principais objetivos?" value={formData.objetivos} onChange={handleChange} />
            <TextAreaField id="rotina" label="Descreva sua rotina diária" value={formData.rotina} onChange={handleChange} />
            <TextAreaField id="evolucaoRecente" label="Como tem sido sua evolução recente?" value={formData.evolucaoRecente} onChange={handleChange} />
            <TextAreaField id="dificuldades" label="Principais dificuldades enfrentadas" value={formData.dificuldades} onChange={handleChange} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exames e Fotos</CardTitle>
            <CardDescription>Informações complementares importantes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="possuiExames" checked={formData.possuiExames} onCheckedChange={handleCheckboxChange} />
              <Label htmlFor="possuiExames">Possui exames médicos recentes?</Label>
            </div>
            <div>
              <Label htmlFor="photos">Fotos de progresso</Label>
              <Input id="photos" type="file" multiple accept="image/*" onChange={handleFileChange} />
              <p className="text-xs text-gray-500">Você pode enviar múltiplas fotos.</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Enviando..." : "Enviar Anamnese"}
            </Button>
          </CardFooter>
        </Card>

        {formError && <p className="text-red-600">{formError}</p>}
      </form>
    </div>
  )
}

function FormField({ id, label, value, onChange, type = "text", required = false }: any) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} type={type} value={value} onChange={onChange} required={required} />
    </div>
  )
}

function TextAreaField({ id, label, value, onChange }: any) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Textarea id={id} name={id} value={value} onChange={onChange} rows={3} />
    </div>
  )
}
