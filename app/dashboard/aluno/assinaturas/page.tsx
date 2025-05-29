"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CheckCircle, AlertCircle, Clock, Ban, HourglassIcon } from "lucide-react";
import { useAssinaturasAluno } from "@/hooks/aluno/useAssinaturaAluno";
import { useRouter } from "next/navigation";

export default function AssinaturasPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"todas" | "PENDENTE" | "PENDENTE_APROVACAO" | "CANCELADA">("todas");

  const statusParam = activeTab === "todas" ? undefined : activeTab;

  const { data: assinaturasResponse, isLoading } = useAssinaturasAluno(
    statusParam ? { status: activeTab === "todas" ? undefined : activeTab} : {}
  );

  const assinaturas = assinaturasResponse?.data || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ATIVA":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="h-3 w-3 mr-1" /> Ativa</Badge>;
      case "PENDENTE":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100"><Clock className="h-3 w-3 mr-1" /> Pendente</Badge>;
      case "PENDENTE_APROVACAO":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><HourglassIcon className="h-3 w-3 mr-1" /> Aguardando Aprovação</Badge>;
      case "CANCELADA":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100"><AlertCircle className="h-3 w-3 mr-1" /> Cancelada</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const calcularDiasRestantes = (dataFim: string) => {
    if (!dataFim) return 0;
    const hoje = new Date();
    const fimData = new Date(dataFim);
    const diffTempo = fimData.getTime() - hoje.getTime();
    return Math.ceil(diffTempo / (1000 * 60 * 60 * 24)).toFixed(0)
  };

  const calcularProgresso = (dataInicio: string, dataFim: string) => {
    if (!dataFim) return 0;
    const inicio = new Date(dataInicio).getTime();
    const fim = new Date(dataFim).getTime();
    const hoje = new Date().getTime();
    const total = fim - inicio;
    const decorrido = hoje - inicio;
    return Math.max(0, Math.min(100, (decorrido / total) * 100)).toFixed(0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Minhas Assinaturas</h1>
          <p className="text-gray-500">Gerencie suas assinaturas de planos</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Status das Assinaturas</CardTitle>
          <CardDescription>Entenda os diferentes status das suas assinaturas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatusBadge status="ATIVA" desc="Parcelas pagas e aprovadas pelo coach" icon={CheckCircle} color="green" />
            <StatusBadge status="PENDENTE" desc="Parcelas cujo prazo de pagamento ainda não venceu" icon={Clock} color="blue" />
            <StatusBadge status="PENDENTE_APROVACAO" desc="Parcelas pagas aguardando aprovação do coach" icon={HourglassIcon} color="yellow" />
            <StatusBadge status="CANCELADA" desc="Parcelas cujo prazo de pagamento já venceu" icon={Ban} color="red" />
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="ATIVA">Ativas</TabsTrigger>
          <TabsTrigger value="PENDENTE">Pendentes</TabsTrigger>
          <TabsTrigger value="PENDENTE_APROVACAO">Aguardando</TabsTrigger>
          <TabsTrigger value="CANCELADA">Canceladas</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {assinaturas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assinaturas.map((assinatura) => {
                const diasRestantes = calcularDiasRestantes(assinatura.dataFim as string);
                const progresso = calcularProgresso(assinatura.dataInicio as string, assinatura.dataFim as string);

                return (
                  <Card key={assinatura.id}
                    className={`${getBorderClass(assinatura.status)} cursor-pointer hover:shadow-lg`}
                    onClick={() => router.push(`/dashboard/aluno/assinaturas/${assinatura.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => { if (e.key === "Enter" || e.key === " ") router.push(`/dashboard/aluno/assinaturas/${assinatura.id}`); }}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{assinatura.parcelamento?.plano?.titulo || "Plano"}</CardTitle>
                        {getStatusBadge(assinatura.status)}
                      </div>
                      <CardDescription>
                        Assinatura criada em {new Date(assinatura.createdAt).toLocaleDateString("pt-BR")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <InfoRow label="Valor:" value={`R$ ${assinatura.parcelamento.valorParcela.toFixed(2)}`} />
                      <InfoRow label="Início:" value={assinatura.dataInicio ? new Date(assinatura.dataInicio).toLocaleDateString("pt-BR") : "Não definida"} />
                      <InfoRow label="Término:" value={assinatura.dataFim ? new Date(assinatura.dataFim).toLocaleDateString("pt-BR") : "Não definida"} />
                      <InfoRow label="Parcela:" value={`${assinatura.parcela}/${assinatura.parcelamento.quantidadeParcela}`} />

                      {(assinatura.status === "ATIVA" || assinatura.status === "PENDENTE") && (
                        <div className="space-y-1">
                          <InfoRow label="Progresso:" value={`${progresso}%`} />
                          <Progress value={progresso as number} className="h-2" />
                          <p className="text-xs text-gray-500 text-right">
                            {diasRestantes && Number(diasRestantes) > 0 ? `${diasRestantes} dias restantes` : "Assinatura vencida"}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">Nenhuma assinatura encontrada.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatusBadge({ status, desc, icon: Icon, color }: { status: string; desc: string; icon: React.ElementType; color: string }) {
  return (
    <div className="flex items-start space-x-2">
      <Badge className={`bg-${color}-100 text-${color}-800 hover:bg-${color}-100 mt-1`}>
        <Icon className="h-3 w-3 mr-1" /> {status}
      </Badge>
      <span className="text-sm">{desc}</span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function getBorderClass(status: string) {
  switch (status) {
    case "PENDENTE_APROVACAO": return "border-yellow-300";
    case "CANCELADA": return "border-red-300";
    case "PENDENTE": return "border-blue-300";
    default: return "";
  }
}
