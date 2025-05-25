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

export default function FeedbacksPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const { 
    data: feedbacksResponse, 
    isLoading,
    isFetching 
  } = useFeedbacks().listarFeedbacks({ 
    page: currentPage,
    pageSize: itemsPerPage,
    search: searchTerm
  })

  const feedbacks = feedbacksResponse?.data || []
  const totalFeedbacks = feedbacksResponse?.total || 0
  const totalPages = Math.ceil(totalFeedbacks / itemsPerPage)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
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
          <div className="mb-4">
            <Input
              placeholder="Buscar feedbacks..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="max-w-sm"
              disabled={isLoading} // Desabilita input durante loading
            />
          </div>

          {(isLoading || isFetching) ? (
            <div className="space-y-4">
              {/* Header do skeleton */}
              <div className="flex space-x-4">
                <Skeleton className="h-10 w-1/5" />
                <Skeleton className="h-10 w-1/5" />
                <Skeleton className="h-10 w-1/5" />
                <Skeleton className="h-10 w-1/5" />
                <Skeleton className="h-10 w-1/5" />
              </div>
              {/* Linhas do skeleton */}
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
              {/* Paginação skeleton */}
              <div className="flex justify-center gap-2">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
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
                            {searchTerm ? 
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
                            if (currentPage > 1) {
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                          }}
                          aria-disabled={currentPage === 1 || isFetching}
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
                            if (currentPage < totalPages) {
                              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                            }
                          }}
                          aria-disabled={currentPage === totalPages || isFetching}
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