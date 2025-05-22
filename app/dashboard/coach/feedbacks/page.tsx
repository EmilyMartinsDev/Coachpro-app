"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import CoachService from "@/lib/services/coach-service"
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
import { FeedbackService } from "@/lib/services"
import type { Coach } from "@/lib/types"

export default function FeedbacksPage() {
  const { user } = useAuth()
  const [coach, setCoach] = useState<Coach | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    if (user?.id) {
      CoachService.getCoachById(user.id).then((data) => {
        setCoach(data)
        setLoading(false)
      })
    }
  }, [user?.id])

  // Junta todos os feedbacks dos alunos
  const feedbacks = coach?.alunos?.flatMap((a: any) => (a.feedbacks || []).map((fb: any) => ({ ...fb, alunoNome: a.nome }))) || []
  const filteredFeedbacks = feedbacks.filter(
    (feedback: any) =>
      feedback.alunoNome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(feedback.diaFeedback).toLocaleDateString().includes(searchTerm),
  )
  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage)
  const paginatedFeedbacks = filteredFeedbacks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {loading ? (
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
                      <TableHead>Data</TableHead>
                      <TableHead>Seguiu Plano</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedFeedbacks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          Nenhum feedback encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedFeedbacks.map((feedback: any) => (
                        <TableRow key={feedback.id}>
                          <TableCell>{feedback.alunoNome}</TableCell>
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
                            if (currentPage < totalPages) {
                              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                            }
                          }}
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
