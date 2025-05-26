"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "@/components/ui/use-toast"
import { useQueryClient } from "@tanstack/react-query"
import { Plus, FileText, Upload } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { usePlanos } from "@/hooks/coach/usePlanos"
import { useAlunos } from "@/hooks/coach/useAlunos"
import { useAssinaturas } from "@/hooks/coach/useAssinaturas"
import { Parcelamento } from "@/lib/types"

export default function AssinaturasPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { criarAssinatura, listarAssinaturas, enviarComprovante } = useAssinaturas()
  const { alunos, isLoading: alunosLoading, error: alunosError } = useAlunos()
  const { planos, isLoading: planosLoading, error: planoError } = usePlanos()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [currentAssinaturaId, setCurrentAssinaturaId] = useState("")

  const [selectedAlunoId, setSelectedAlunoId] = useState("")
  const [selectedParcelamentoId, setSelectedParcelamentoId] = useState("")
  const [selectedPlanoId, setSelectedPlanoId] = useState("")
  const [parcelamentos, setParcelamentos] = useState<Parcelamento[]>([])

  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const { data: assinaturasResponse, isLoading: assinaturasLoading, error: assinaturaError } = listarAssinaturas({
    page: currentPage,
    pageSize: itemsPerPage,
    search: searchTerm
  })

  const assinaturas = assinaturasResponse?.data || []
  const totalAssinaturas = assinaturasResponse?.total || 0
  const totalPages = Math.ceil(totalAssinaturas / itemsPerPage)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handleSubmit = async () => {
    if (!selectedAlunoId || !selectedParcelamentoId) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um aluno e um plano.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await criarAssinatura.mutateAsync({
        alunoId: selectedAlunoId,
        parcelamentoId: selectedParcelamentoId
      })

      toast({
        title: "Sucesso",
        description: "Assinatura criada com sucesso!",
      })

      setSelectedAlunoId("")
      setSelectedParcelamentoId("")
      setIsDialogOpen(false)

      queryClient.invalidateQueries({ queryKey: ['assinaturas'] })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar assinatura. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, assinaturaId: string) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
      setCurrentAssinaturaId(assinaturaId)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !currentAssinaturaId) return

    setIsUploading(true)
    try {
      await enviarComprovante.mutateAsync({
        assinaturaId: currentAssinaturaId,
        file: selectedFile
      })

      toast({
        title: "Sucesso",
        description: "Comprovante enviado com sucesso!",
      })

      setSelectedFile(null)
      queryClient.invalidateQueries({ queryKey: ['assinaturas'] })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao enviar comprovante. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  if (assinaturasLoading || planosLoading || alunosLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-8">
          <Skeleton className="h-10 w-1/4" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    )
  }

  if (alunosError || assinaturaError || planoError) {
    return (
      <div className="container mx-auto py-6">
        <p className="text-red-500">Erro ao exibir as assinaturas</p>
      </div>
    )
  }

  if (!assinaturas) {
    return (
      <div className="container mx-auto py-6">
        <div className="rounded-md bg-red-50 p-4 text-red-700">
          <p>Assinaturas não encontradas.</p>
        </div>
        <div className="mt-4">
          <Link href="/dashboard/coach/feedbacks">
            <Button>Voltar para lista</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Assinaturas</h1>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nova Assinatura
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Assinatura</DialogTitle>
              <DialogDescription>Selecione um aluno e um plano.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="aluno">Aluno</label>
                <Select value={selectedAlunoId} onValueChange={(e)=>setSelectedAlunoId(e)} disabled={alunosLoading}>
                  <SelectTrigger id="aluno">
                    <SelectValue placeholder="Selecione um aluno" />
                  </SelectTrigger>
                  <SelectContent>
                    {alunos.map((aluno) => (
                      <SelectItem key={aluno.id} value={aluno.id}>
                        {aluno.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <label htmlFor="plano">Plano</label>
                <Select
                  value={selectedPlanoId}
                  onValueChange={(planoId) => {
                    setSelectedPlanoId(planoId);
                    const planoSelecionado = planos?.find(p => p.id === planoId);
                    setParcelamentos(planoSelecionado?.parcelamento ?? []);
                    setSelectedParcelamentoId("");
                  }}
                  disabled={planosLoading}
                >
                  <SelectTrigger id="plano">
                    <SelectValue placeholder="Selecione um plano" />
                  </SelectTrigger>
                  <SelectContent>
                    {planos?.map((plano) => (
                      <SelectItem key={plano.id} value={plano.id}>
                        {plano.titulo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {parcelamentos.length > 0 && (
                <div className="grid gap-2 mt-4">
                  <label htmlFor="parcelamento">Parcelamento</label>
                  <Select
                    value={selectedParcelamentoId}
                    onValueChange={setSelectedParcelamentoId}
                  >
                    <SelectTrigger id="parcelamento">
                      <SelectValue placeholder="Selecione um parcelamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {parcelamentos.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {`R$ ${p.valorParcela.toFixed(2)} (${p.quantidadeParcela}x)`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Criando..." : "Criar Assinatura"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Assinaturas</CardTitle>
          <CardDescription>Gerencie as assinaturas dos seus alunos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Buscar assinaturas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {assinaturasLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aluno</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Parcela</TableHead>
                      <TableHead>Comprovante</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assinaturas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          Nenhuma assinatura encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      assinaturas.map((assinatura) => (
                        <TableRow key={assinatura.id}>
                          <TableCell>{assinatura?.aluno?.nome || "Aluno"}</TableCell>
                          <TableCell>{assinatura?.parcelamento?.plano?.titulo || "Plano"}</TableCell>
                          <TableCell>
                            <Badge className={
                              assinatura.status === "ATIVA" ? "bg-green-100 text-green-800" :
                                assinatura.status === "PENDENTE" ? "bg-yellow-100 text-yellow-800" :
                                  assinatura.status === "PENDENTE_APROVACAO" ? "bg-blue-100 text-blue-800" :
                                    "bg-red-100 text-red-800"
                            }>
                              {assinatura.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{assinatura.parcela}/{assinatura.parcelamento.quantidadeParcela}</TableCell>
                        {
                          !assinatura.comprovante_url ? (
                              <TableCell>
                            <div className="flex items-center gap-2">
                              <input
                                type="file"
                                id={`file-upload-${assinatura.id}`}
                                className="hidden"
                                onChange={(e) => handleFileChange(e, assinatura.id)}
                                accept="image/*,.pdf"
                              />
                              <label
                                htmlFor={`file-upload-${assinatura.id}`}
                                className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 flex items-center"
                              >
                                <Upload className="h-4 w-4 mr-1" />
                                Selecionar
                              </label>
                              {selectedFile && currentAssinaturaId === assinatura.id && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleUpload}
                                  disabled={isUploading}
                                  className="text-sm"
                                >
                                  {isUploading ? "Enviando..." : "Enviar"}
                                </Button>
                              )}
                            </div>
                          </TableCell>
                          ): 
                            (
                              <TableCell>
                              <a
                                href={assinatura.comprovante_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Ver comprovante"
                                className="text-blue-500 hover:underline flex items-center"
                              >
                                <FileText className="h-4 w-4 mr-1" /> Ver
                              </a>
                              </TableCell>
                            )
                          
                        }
                          <TableCell>
                            <Link href={`/dashboard/coach/assinaturas/${assinatura.id}`}>
                              <Button variant="outline" size="sm">
                                Ver detalhes
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            if (currentPage > 1) setCurrentPage(currentPage - 1)
                          }}
                          aria-disabled={currentPage === 1}
                          tabIndex={currentPage === 1 ? -1 : 0}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }).map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              setCurrentPage(i + 1)
                            }}
                            isActive={currentPage === i + 1}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                          }}
                          aria-disabled={currentPage === totalPages}
                          tabIndex={currentPage === totalPages ? -1 : 0}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}