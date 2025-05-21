"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useFeedbacks } from "@/hooks/useFeedbacks"
import { format } from "date-fns"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"

type PhotoType = 'frente' | 'costas' | 'ladoDireito' | 'ladoEsquerdo'

export default function EnviarFeedbackPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { createFeedback } = useFeedbacks()
  
  // Form state
  const [formData, setFormData] = useState({
    peso: "",
    diaFeedback: format(new Date(), "yyyy-MM-dd"),
    seguiuPlano: "TOTALMENTE" as const,
    comeuAMais: "",
    refeicoesPerdidas: "",
    refeicaoLivre: "",
    digestaoIntestino: "",
    dificuldadeAlimentos: "",
    periodoMenstrual: false,
    horasSono: "",
    qualidadeSono: "BOA" as const,
    acordouCansado: false,
    manteveProtocolo: "TOTALMENTE" as const,
    efeitosColaterais: "",
    observacoes: "",
  })
  
  // Photo handling
  const [photos, setPhotos] = useState<Record<PhotoType, File | undefined>>({
    frente: undefined,
    costas: undefined,
    ladoDireito: undefined,
    ladoEsquerdo: undefined
  })
  
  const [photoPreviews, setPhotoPreviews] = useState<Record<PhotoType, string | undefined>>({
    frente: undefined,
    costas: undefined,
    ladoDireito: undefined,
    ladoEsquerdo: undefined
  })
  
  // UI state
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: checked }))
  }
  
  const handlePhotoChange = (type: PhotoType, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return
    
    const file = e.target.files[0]
    
    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione apenas imagens (JPEG, PNG)')
      return
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter menos de 5MB')
      return
    }
    
    // Update photos state
    setPhotos(prev => ({ ...prev, [type]: file }))
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (event) => {
      setPhotoPreviews(prev => ({ ...prev, [type]: event.target?.result as string }))
    }
    reader.readAsDataURL(file)
  }
  
  const removePhoto = (type: PhotoType) => {
    setPhotos(prev => ({ ...prev, [type]: undefined }))
    setPhotoPreviews(prev => ({ ...prev, [type]: undefined }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    
    try {
      if (!user?.id) throw new Error("Usuário não identificado")
      
      // Filter out undefined photos
      const photosToUpload = Object.fromEntries(
        Object.entries(photos).filter(([_, file]) => file)
      ) as Record<PhotoType, File>
      
      await createFeedback({
        ...formData,
        alunoId: user.id,
      }, Object.values(photosToUpload))
      
      router.push("/dashboard/aluno/feedbacks")
    } catch (err) {
      console.error("Error submitting feedback:", err)
      setError(err instanceof Error ? err.message : "Erro ao enviar feedback. Tente novamente.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary">Enviar Feedback</h1>
        <p className="mt-2 text-gray-500">Preencha o formulário abaixo com seu feedback para o coach.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Informações Gerais</CardTitle>
            <CardDescription>Informações básicas sobre seu progresso</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="peso">Peso Atual (kg)</Label>
              <Input 
                id="peso" 
                name="peso" 
                type="number"
                value={formData.peso}
                onChange={handleChange}
                placeholder="Ex: 70.5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="diaFeedback">Data do Feedback</Label>
              <Input 
                id="diaFeedback" 
                name="diaFeedback" 
                type="date" 
                value={formData.diaFeedback}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Meal Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Plano Alimentar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Você seguiu o plano alimentar?</Label>
              <RadioGroup 
                value={formData.seguiuPlano} 
                onValueChange={(v) => handleRadioChange("seguiuPlano", v)}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="TOTALMENTE" id="seguiu-totalmente" />
                  <Label htmlFor="seguiu-totalmente">Totalmente</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PARCIALMENTE" id="seguiu-parcialmente" />
                  <Label htmlFor="seguiu-parcialmente">Parcialmente</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="NAO" id="seguiu-nao" />
                  <Label htmlFor="seguiu-nao">Não</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="comeuAMais">Comeu a mais?</Label>
                <Input 
                  id="comeuAMais" 
                  name="comeuAMais" 
                  value={formData.comeuAMais}
                  onChange={handleChange}
                  placeholder="Descreva se comeu além do plano"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="refeicoesPerdidas">Refeições Perdidas</Label>
                <Input 
                  id="refeicoesPerdidas" 
                  name="refeicoesPerdidas"
                  value={formData.refeicoesPerdidas}
                  onChange={handleChange}
                  placeholder="Quais refeições não fez"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="refeicaoLivre">Refeição Livre</Label>
                <Input 
                  id="refeicaoLivre" 
                  name="refeicaoLivre"
                  value={formData.refeicaoLivre}
                  onChange={handleChange}
                  placeholder="Descreva sua refeição livre"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="digestaoIntestino">Digestão/Intestino</Label>
                <Input 
                  id="digestaoIntestino" 
                  name="digestaoIntestino"
                  value={formData.digestaoIntestino}
                  onChange={handleChange}
                  placeholder="Como está sua digestão"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="dificuldadeAlimentos">Dificuldade com Alimentos</Label>
                <Input 
                  id="dificuldadeAlimentos" 
                  name="dificuldadeAlimentos"
                  value={formData.dificuldadeAlimentos}
                  onChange={handleChange}
                  placeholder="Teve dificuldade com algum alimento?"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sleep and Well-being */}
        <Card>
          <CardHeader>
            <CardTitle>Sono e Bem-estar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="periodoMenstrual"
                  name="periodoMenstrual"
                  checked={formData.periodoMenstrual}
                  onChange={handleCheckboxChange}
                  className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="periodoMenstrual">Período Menstrual?</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="horasSono">Horas de Sono</Label>
                <Input 
                  id="horasSono" 
                  name="horasSono"
                  type="number"
                  value={formData.horasSono}
                  onChange={handleChange}
                  placeholder="Quantas horas dormiu"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="qualidadeSono">Qualidade do Sono</Label>
                <select
                  id="qualidadeSono"
                  name="qualidadeSono"
                  value={formData.qualidadeSono}
                  onChange={(e) => handleRadioChange("qualidadeSono", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="OTIMA">Ótima</option>
                  <option value="BOA">Boa</option>
                  <option value="REGULAR">Regular</option>
                  <option value="RUIM">Ruim</option>
                  <option value="PESSIMA">Péssima</option>
                </select>
              </div>
              
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="acordouCansado"
                  name="acordouCansado"
                  checked={formData.acordouCansado}
                  onChange={handleCheckboxChange}
                  className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="acordouCansado">Acordou Cansado?</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Protocol */}
        <Card>
          <CardHeader>
            <CardTitle>Protocolo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Manteve Protocolo?</Label>
              <RadioGroup 
                value={formData.manteveProtocolo} 
                onValueChange={(v) => handleRadioChange("manteveProtocolo", v)}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="TOTALMENTE" id="protocolo-totalmente" />
                  <Label htmlFor="protocolo-totalmente">Totalmente</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PARCIALMENTE" id="protocolo-parcialmente" />
                  <Label htmlFor="protocolo-parcialmente">Parcialmente</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="NAO" id="protocolo-nao" />
                  <Label htmlFor="protocolo-nao">Não</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Effects and Observations */}
        <Card>
          <CardHeader>
            <CardTitle>Efeitos e Observações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="efeitosColaterais">Efeitos Colaterais</Label>
              <Input 
                id="efeitosColaterais" 
                name="efeitosColaterais"
                value={formData.efeitosColaterais}
                onChange={handleChange}
                placeholder="Descreva quaisquer efeitos colaterais"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes" 
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                placeholder="Outras observações importantes"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Progress Photos */}
        <Card>
          <CardHeader>
            <CardTitle>Fotos de Progresso</CardTitle>
            <CardDescription>Adicione fotos para acompanhar seu progresso visualmente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {(['frente', 'costas', 'ladoDireito', 'ladoEsquerdo'] as PhotoType[]).map((type) => (
                <div key={type} className="space-y-2">
                  <Label htmlFor={`photo-${type}`} className="capitalize">
                    Foto {type.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </Label>
                  
                  <input
                    id={`photo-${type}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoChange(type, e)}
                    className="hidden"
                  />
                  
                  <label
                    htmlFor={`photo-${type}`}
                    className="block w-full p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition"
                  >
                    {photoPreviews[type] ? (
                      <div className="relative">
                        <img
                          src={photoPreviews[type]}
                          alt={`Preview ${type}`}
                          className="w-full h-32 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            removePhoto(type)
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <span>+ Adicionar foto</span>
                        <span className="text-xs">JPEG, PNG (max 5MB)</span>
                      </div>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Error message */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Submit button */}
        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </>
            ) : "Enviar Feedback"}
          </Button>
        </div>
      </form>
    </div>
  )
}