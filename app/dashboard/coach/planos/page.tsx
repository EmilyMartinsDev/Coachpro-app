"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Plus, Trash2 } from "lucide-react"
import { usePlanos } from "@/hooks/coach/usePlanos"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

const formSchema = z.object({
  titulo: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  descricao: z.string().optional(),
  parcelamentos: z.array(
    z.object({
      valor: z.number().min(1, "Valor deve ser maior que 0"),
      vezes: z.number().min(1, "Deve ter pelo menos 1 parcela").max(36, "Máximo de 36 parcelas")
    })
  ).optional()
})

export default function PlanosPage() {
  const { user } = useAuth()
  const { planos, isLoading, isError, cadastrarPlano } = usePlanos()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      parcelamentos: []
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await cadastrarPlano.mutateAsync({
        titulo: values.titulo,
        descricao: values.descricao,
        parcelamentos: values.parcelamentos?.map(p => ({
          valorParcela: p.valor,
          quantidadeParcela: p.vezes
        })) || []
      })
      
      toast({
        title: "Sucesso",
        description: "Plano cadastrado com sucesso!",
      })

      setIsDialogOpen(false)
      form.reset()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao cadastrar o plano",
        variant: "destructive",
      })
    }
  }

  const addParcelamento = () => {
    const currentParcelamentos = form.getValues("parcelamentos") || []
    form.setValue("parcelamentos", [...currentParcelamentos, { valor: 0, vezes: 1 }])
  }

  const removeParcelamento = (index: number) => {
    const parcelamentos = form.getValues("parcelamentos") || []
    const newParcelamentos = parcelamentos.filter((_, i) => i !== index)
    form.setValue("parcelamentos", newParcelamentos)
  }

  // Corrigindo o erro de inputs não controlados
  const getParcelamentoValue = (index: number, field: 'valor' | 'vezes') => {
    const parcelamentos = form.getValues("parcelamentos") || []
    return parcelamentos[index]?.[field] || 0
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-8 flex justify-between items-center">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-[72px] w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Erro ao carregar planos. Tente novamente mais tarde.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Meus Planos</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} /> Criar Plano
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Novo Plano</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="titulo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título do Plano *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Plano Premium" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="descricao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Acesso completo a todos os recursos" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <FormLabel>Opções de Parcelamento</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addParcelamento}
                      >
                        Adicionar
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {(form.watch("parcelamentos") || []).map((_, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="flex-1 grid grid-cols-2 gap-2">
                            <FormField
                              control={form.control}
                              name={`parcelamentos.${index}.valor`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <div className="relative">
                                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                        R$
                                      </span>
                                      <Input
                                        type="number"
                                        placeholder="Valor"
                                        className="pl-8"
                                        value={getParcelamentoValue(index, 'valor')}
                                        onChange={(e) => {
                                          const value = Number(e.target.value)
                                          const parcelamentos = form.getValues("parcelamentos") || []
                                          parcelamentos[index] = {
                                            ...parcelamentos[index],
                                            valor: value
                                          }
                                          form.setValue("parcelamentos", [...parcelamentos])
                                        }}
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`parcelamentos.${index}.vezes`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <div className="relative">
                                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                        x
                                      </span>
                                      <Input
                                        type="number"
                                        placeholder="Parcelas"
                                        className="pl-8"
                                        value={getParcelamentoValue(index, 'vezes')}
                                        onChange={(e) => {
                                          const value = Number(e.target.value)
                                          const parcelamentos = form.getValues("parcelamentos") || []
                                          parcelamentos[index] = {
                                            ...parcelamentos[index],
                                            vezes: value
                                          }
                                          form.setValue("parcelamentos", [...parcelamentos])
                                        }}
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => removeParcelamento(index)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={cadastrarPlano.isPending}>
                    {cadastrarPlano.isPending ? "Salvando..." : "Salvar Plano"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Planos Disponíveis</CardTitle>
          <CardDescription>Lista completa dos planos que você oferece</CardDescription>
        </CardHeader>
        <CardContent>
          {planos?.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <p className="text-muted-foreground">Você ainda não criou nenhum plano</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Criar Primeiro Plano
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Plano</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-right">Opções de Pagamento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {planos?.map((plano) => (
                    <TableRow key={plano.id}>
                      <TableCell className="font-medium">{plano.titulo}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {plano.descricao || "Sem descrição"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-wrap justify-end gap-2">
                          {plano.parcelamento?.length ? (
                            plano.parcelamento.map((p, i) => (
                              <Badge key={i} variant="outline" className="font-normal">
                                {p.quantidadeParcela}x de R$ {p.valorParcela.toFixed(2)}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm">Sem parcelamento</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}