"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAssinaturas } from "@/hooks/useAssinaturas"
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

export default function AssinaturasPage() {
  const { assinaturas, loading, error } = useAssinaturas()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter assinaturas based on search term
  const filteredAssinaturas = assinaturas.filter(
    (assinatura) =>
      assinatura.aluno?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assinatura.plano?.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assinatura.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Pagination
  const totalPages = Math.ceil(filteredAssinaturas.length / itemsPerPage)
  const paginatedAssinaturas = filteredAssinaturas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Assinaturas</h1>
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

          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-md bg-red-50 p-4 text-red-700">
              <p>{error}</p>
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
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedAssinaturas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          Nenhuma assinatura encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedAssinaturas.map((assinatura) => (
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
