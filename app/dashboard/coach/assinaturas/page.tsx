"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import { useCoachContext } from "@/lib/CoachContext"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Upload, X, FileText, ImageIcon, File } from "lucide-react"
import { format, addMonths } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useAssinaturas } from "@/hooks/useAssinaturas"
import { usePlanos } from "@/hooks/usePlanos"
import { useAlunos } from "@/hooks/useAlunos"
import { toast } from "@/components/ui/use-toast"
import { CreateAssinaturaRequest } from "@/lib/types"

export default function AssinaturasPage() {
  const { user } = useAuth()
  const { coach, loading: coachLoading, error: coachError } = useCoachContext()
  const { createAssinatura } = useAssinaturas()
  const { alunos, loading: alunosLoading } = useAlunos(user?.id)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const itemsPerPage = 10

  // Form state
  const [selectedAlunoId, setSelectedAlunoId] = useState("")
  const [selectedPlanoId, setSelectedPlanoId] = useState("")
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(addMonths(new Date(), 1))
  const [status, setStatus] = useState<"PENDENTE_APROVACAO" | "PENDENTE" | "ATIVA" | "INATIVA" | "CANCELADA">(
    "PENDENTE",
  )
  const [parcelaAtual, setParcelaAtual] = useState("1")
  const [totalParcelas, setTotalParcelas] = useState("1")
  const [valor, setValor] = useState("")
  const [comprovante, setComprovante] = useState<File | null>(null)
  const [comprovantePreview, setComprovantePreview] = useState<string | null>(null)

  // Junta todas as assinaturas dos alunos
  const assinaturas =
    (coach?.alunos as any[])?.flatMap((a: any) => a.assinaturas?.map((as: any) => ({ ...as, aluno: a })) || []) || []

  // Filter assinaturas based on search term
  const filteredAssinaturas = assinaturas.filter(
    (assinatura: any) =>
      assinatura.aluno?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assinatura.plano?.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assinatura.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Pagination
  const totalPages = Math.ceil(filteredAssinaturas.length / itemsPerPage)
  const paginatedAssinaturas = filteredAssinaturas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // Update end date and valor when plan changes
  useEffect(() => {
    if (selectedPlanoId && startDate && coach?.planos) {
      const selectedPlano = coach?.planos.find((plano) => plano.id === selectedPlanoId)
      if (selectedPlano) {
        setEndDate(addMonths(startDate, selectedPlano.duracao))
        setValor(selectedPlano.valor.toString())
      }
    }
  }, [selectedPlanoId, startDate, coach?.planos])

  // Clean up object URL when component unmounts or when file changes
  useEffect(() => {
    return () => {
      if (comprovantePreview) {
        URL.revokeObjectURL(comprovantePreview)
      }
    }
  }, [comprovantePreview])

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setComprovante(file)

      // Create preview URL for image files
      if (file.type.startsWith("image/")) {
        const previewUrl = URL.createObjectURL(file)
        setComprovantePreview(previewUrl)
      } else {
        setComprovantePreview(null)
      }
    }
  }

  // Remove selected file
  const handleRemoveFile = () => {
    setComprovante(null)
    if (comprovantePreview) {
      URL.revokeObjectURL(comprovantePreview)
      setComprovantePreview(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Get file icon based on type
  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-5 w-5" />
    } else if (file.type === "application/pdf") {
      return <FileText className="h-5 w-5" />
    } else {
      return <File className="h-5 w-5" />
    }
  }
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64String = (reader.result as string).split(",")[1] // Remove "data:image/png;base64,"
      resolve(base64String)
    }
    reader.onerror = error => reject(error)
    reader.readAsDataURL(file)
  })
}
const handleSubmit = async () => {
  // Validação inicial de campos obrigatórios
  if (!selectedAlunoId || !selectedPlanoId || !startDate || !endDate || !parcelaAtual || !totalParcelas || !valor) {
    toast({
      title: "Erro",
      description: "Por favor, preencha todos os campos obrigatórios.",
      variant: "destructive",
    });
    return;
  }

  // Conversão e validação de números
  const valorNum = Number(valor);
  const parcelaNum = Number(parcelaAtual);
  const totalParcelasNum = Number(totalParcelas);

  if (isNaN(valorNum) || valorNum <= 0) {
    toast({
      title: "Erro",
      description: "O valor deve ser um número positivo.",
      variant: "destructive",
    });
    return;
  }

  if (isNaN(parcelaNum) || isNaN(totalParcelasNum)) {
    toast({
      title: "Erro",
      description: "Os valores das parcelas devem ser números válidos.",
      variant: "destructive",
    });
    return;
  }

  if (parcelaNum > totalParcelasNum) {
    toast({
      title: "Erro",
      description: "A parcela atual não pode ser maior que o total de parcelas.",
      variant: "destructive",
    });
    return;
  }

  // Validação de datas
  if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
    toast({
      title: "Erro",
      description: "Datas inválidas.",
      variant: "destructive",
    });
    return;
  }

  if (startDate >= endDate) {
    toast({
      title: "Erro",
      description: "A data de início deve ser anterior à data de fim.",
      variant: "destructive",
    });
    return;
  }

  // Validação do planoId
  if (typeof selectedPlanoId !== 'string' || selectedPlanoId.trim() === '') {
    toast({
      title: "Erro",
      description: "Selecione um plano válido.",
      variant: "destructive",
    });
    return;
  }

  setIsSubmitting(true);

  try {
    // Preparar FormData
    const formData = new FormData();
    
    // Adicionar campos ao FormData
    formData.append('alunoId', selectedAlunoId);
    formData.append('planoId', selectedPlanoId);
    formData.append('dataInicio', startDate.toISOString().split('T')[0]);
    formData.append('dataFim', endDate.toISOString().split('T')[0]);
    formData.append('valor', valorNum.toString());
    formData.append('parcela', parcelaNum.toString());
    formData.append('total_parcelas', totalParcelasNum.toString());
    formData.append('status', status);
    
    // Adicionar comprovante se existir
    if (comprovante) {
      formData.append('comprovante_url', comprovante);
    }
 
    // Chamar seu hook createAssinatura
    const result = await createAssinatura(formData);

    if (result) {
      toast({
        title: "Sucesso",
        description: "Assinatura criada com sucesso!",
      });

      // Resetar formulário
      setSelectedAlunoId("");
      setSelectedPlanoId("");
      setStartDate(new Date());
      setEndDate(addMonths(new Date(), 1));
      setStatus("PENDENTE");
      setParcelaAtual("1");
      setTotalParcelas("1");
      setValor("");
      setComprovante(null);
      setComprovantePreview(null);
      setIsDialogOpen(false);
    }
  } catch (error) {
    console.error("Erro ao criar assinatura:", error);
    
    let errorMessage = "Não foi possível criar a assinatura. Tente novamente.";
    
    if (error instanceof Error) {
      errorMessage = error.message || errorMessage;
    }

    toast({
      title: "Erro",
      description: errorMessage,
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};

  // Format currency input
  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters
    const value = e.target.value.replace(/[^\d]/g, "")

    // Convert to number with 2 decimal places
    const numericValue = value ? (Number.parseInt(value) / 100).toFixed(2) : ""

    setValor(numericValue)
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
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Criar Nova Assinatura</DialogTitle>
              <DialogDescription>Selecione um aluno, um plano e defina os detalhes da assinatura.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="aluno">Aluno</Label>
                <Select value={selectedAlunoId} onValueChange={setSelectedAlunoId} disabled={alunosLoading}>
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
                <Label htmlFor="plano">Plano</Label>
                <Select value={selectedPlanoId} onValueChange={setSelectedPlanoId} disabled={!coach}>
                  <SelectTrigger id="plano">
                    <SelectValue placeholder="Selecione um plano" />
                  </SelectTrigger>
                  <SelectContent>
                    {coach?.planos && coach?.planos.map((plano) => (
                      <SelectItem key={plano.id} value={plano.id}>
                        {plano.titulo} - R$ {plano.valor.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="valor">Valor da Assinatura (R$)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">R$</span>
                  <Input
                    id="valor"
                    type="text"
                    value={valor}
                    onChange={handleValorChange}
                    className="pl-10"
                    placeholder="0,00"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(value) =>
                    setStatus(value as "PENDENTE_APROVACAO" | "PENDENTE" | "ATIVA" | "INATIVA" | "CANCELADA")
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDENTE_APROVACAO">Pendente de Aprovação</SelectItem>
                    <SelectItem value="PENDENTE">Pendente</SelectItem>
                    <SelectItem value="ATIVA">Ativa</SelectItem>
                    <SelectItem value="INATIVA">Inativa</SelectItem>
                    <SelectItem value="CANCELADA">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dataInicio">Data de Início</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? (
                          format(startDate, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dataFim">Data de Fim</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "dd/MM/yyyy", { locale: ptBR }) : <span>Selecione uma data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="parcelaAtual">Parcela Atual</Label>
                  <Select value={parcelaAtual} onValueChange={setParcelaAtual}>
                    <SelectTrigger id="parcelaAtual">
                      <SelectValue placeholder="Selecione a parcela atual" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="totalParcelas">Total de Parcelas</Label>
                  <Select value={totalParcelas} onValueChange={setTotalParcelas}>
                    <SelectTrigger id="totalParcelas">
                      <SelectValue placeholder="Selecione o total de parcelas" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "parcela" : "parcelas"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="comprovante">Comprovante de Pagamento</Label>
                {comprovante ? (
                  <div className="rounded-md border border-gray-200 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getFileIcon(comprovante)}
                        <span className="text-sm font-medium">{comprovante.name}</span>
                        <span className="text-xs text-gray-500">({(comprovante.size / 1024).toFixed(0)} KB)</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveFile}
                        className="h-8 w-8 p-0"
                        aria-label="Remover arquivo"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {comprovantePreview && (
                      <div className="mt-2 max-h-40 overflow-hidden rounded-md">
                        <img
                          src={comprovantePreview || "/placeholder.svg"}
                          alt="Preview do comprovante"
                          className="h-auto max-w-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center rounded-md border border-dashed border-gray-300 p-6">
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <div className="mt-2">
                        <Button
                          variant="ghost"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                          Selecionar arquivo
                        </Button>
                        <input
                          ref={fileInputRef}
                          id="comprovante"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF ou PDF até 10MB</p>
                    </div>
                  </div>
                )}
              </div>
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

          {coachLoading ? (
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
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Parcela</TableHead>
                      <TableHead>Comprovante</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedAssinaturas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          Nenhuma assinatura encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedAssinaturas.map((assinatura: any) => (
                        <TableRow key={assinatura.id}>
                          <TableCell>{assinatura.aluno?.nome || "Aluno"}</TableCell>
                          <TableCell>{assinatura.plano?.titulo || "Plano"}</TableCell>
                          <TableCell>R$ {assinatura.valor.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                assinatura.status === "ATIVA"
                                  ? "bg-green-100 text-green-800"
                                  : assinatura.status === "PENDENTE"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : assinatura.status === "PENDENTE_APROVACAO"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-red-100 text-red-800"
                              }
                            >
                              {assinatura.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {assinatura.parcela}/{assinatura.totalParcelas}
                          </TableCell>
                          <TableCell>
                            {assinatura.comprovante_url ? (
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                                <a
                                  href={assinatura.comprovante_pagamento}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label="Ver comprovante"
                                >
                                  <FileText className="h-4 w-4" />
                                </a>
                              </Button>
                            ) : (
                              <span className="text-gray-500 text-sm">Não enviado</span>
                            )}
                          </TableCell>
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
                          href={`?page=${Math.max(currentPage - 1, 1)}`}
                          onClick={(e) => {
                            e.preventDefault()
                            if (currentPage > 1) {
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                          }}
                          aria-disabled={currentPage === 1}
                          tabIndex={currentPage === 1 ? -1 : 0}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            href={`?page=${i + 1}`}
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
                          href={`?page=${Math.min(currentPage + 1, totalPages)}`}
                          onClick={(e) => {
                            e.preventDefault()
                            if (currentPage < totalPages) {
                              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                            }
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
