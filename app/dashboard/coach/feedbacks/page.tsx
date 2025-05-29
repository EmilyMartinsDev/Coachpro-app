"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
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
import { format } from "date-fns"
import { useFeedbacks } from "@/hooks/coach/useFeedbacks"
import { useAlunos } from "@/hooks/coach/useAlunos"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ListarFeedbacksParams } from "@/lib/types"

export default function FeedbacksPage() {
  const { user } = useAuth()
  const { alunos, isLoading: alunosLoading } = useAlunos()
  
  const initialFilters: ListarFeedbacksParams = {
    page: 1,
    pageSize: 10,
    alunoId: undefined,
    respondido: undefined,
    dataInicio: undefined,
    dataFim: undefined,
    search: undefined
  }

  const [filters, setFilters] = useState<ListarFeedbacksParams>(initialFilters)

  const { 
    data: feedbacksResponse, 
    isLoading,
    isFetching 
  } = useFeedbacks().listarFeedbacks(filters)

  const feedbacks = feedbacksResponse?.data || []
  const totalFeedbacks = feedbacksResponse?.total || 0
  const totalPages = Math.ceil(totalFeedbacks / (filters.pageSize! as number))

  const handleFilterChange = (newFilters: Partial<ListarFeedbacksParams>) => {
    setFilters(prev => {
      const updatedFilters = { ...prev, ...newFilters, page: 1 }
      
      if (updatedFilters.alunoId === "all") {
        updatedFilters.alunoId = undefined
      }
      if (updatedFilters.respondido === "all" as any) {
        updatedFilters.respondido = undefined
      }
      
      return updatedFilters
    })
  }

  const handleClearFilters = () => {
    setFilters(initialFilters)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Feedbacks dos Alunos</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Feedbacks</CardTitle>
          <CardDescription>Veja os feedbacks enviados pelos seus alunos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Input
              placeholder="Buscar feedbacks..."
              value={filters.search ?? ""}
              onChange={(e) => handleFilterChange({ search: e.target.value || undefined })}
              className="max-w-sm"
              disabled={isLoading}
            />

            <Select
              value={filters.alunoId ?? "all"}
              onValueChange={(value) => handleFilterChange({ alunoId: value })}
              disabled={alunosLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por aluno" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os alunos</SelectItem>
                {alunos.map((aluno) => (
                  <SelectItem key={aluno.id} value={aluno.id}>
                    {aluno.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.respondido !== undefined ? filters.respondido.toString() : "all"}
              onValueChange={(value) => handleFilterChange({ 
                respondido: value === "" ? undefined : value === "true" 
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="true">Respondidos</SelectItem>
                <SelectItem value="false">Não respondidos</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Input
                type="date"
                value={filters.dataInicio || ""}
                onChange={(e) => handleFilterChange({ 
                  dataInicio: e.target.value || undefined 
                })}
                placeholder="Data inicial"
                className="w-full"
              />
              <Input
                type="date"
                value={filters.dataFim || ""}
                onChange={(e) => handleFilterChange({ 
                  dataFim: e.target.value || undefined 
                })}
                placeholder="Data final"
                className="w-full"
              />
            </div>
          </div>

          <div className="mb-4">
            <Button variant="outline" onClick={handleClearFilters} disabled={isLoading || isFetching}>
              Limpar Filtros
            </Button>
          </div>

          {(isLoading || isFetching) ? (
            <div className="space-y-4">
              <div className="flex space-x-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-1/5" />
                ))}
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
              <div className="flex justify-center gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-10" />
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aluno</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Seguiu Plano</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feedbacks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="text-gray-500">
                            {filters.search ? 
                              "Nenhum feedback encontrado para sua busca" : 
                              "Nenhum feedback encontrado"}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      feedbacks.map((feedback) => (
                        <TableRow key={feedback.id}>
                          <TableCell>{feedback.aluno?.nome}</TableCell>
                          <TableCell>{format(new Date(feedback.diaFeedback), "dd/MM/yyyy")}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                feedback.seguiuPlano === "TOTALMENTE"
                                  ? "bg-green-100 text-green-800"
                                  : feedback.seguiuPlano === "PARCIALMENTE"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }
                            >
                              {feedback.seguiuPlano}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                feedback.respondido 
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {feedback.respondido ? "Respondido" : "Não respondido"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Link href={`/dashboard/coach/feedbacks/${feedback.id}`}>
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
                            if (filters.page && filters.page > 1) {
                              handleFilterChange({ page: filters.page - 1 })
                            }
                          }}
                          aria-disabled={filters.page === 1 || isFetching}
                          className={filters.page === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              handleFilterChange({ page: i + 1 })
                            }}
                            isActive={filters.page === i + 1}
                            aria-disabled={isFetching}
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
                            if (filters.page && filters.page < totalPages) {
                              handleFilterChange({ page: filters.page + 1 })
                            }
                          }}
                          aria-disabled={filters.page === totalPages || isFetching}
                          className={filters.page === totalPages ? "pointer-events-none opacity-50" : ""}
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
