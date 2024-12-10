'use client'

import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BarChart3, Search, Download, CheckCircle, Clock, HelpCircle, Users } from 'lucide-react'
import { getFormAnswers, getFormByIdToGraph } from "@/services/endpoint/form"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function StatisticsPage() {
  const [mockFormData, setMockFormData] = useState<any>({
    title: "",
    totalResponses: 0,
    completionRate: 0,
    averageTime: "N/A",
    questions: []
  })
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const formId = params.get("id");
        const formData = await getFormByIdToGraph(formId || "")
        const responseFormData = await getFormAnswers(formId || "")

        const updatedFormData = {
          title: formData.title,
          totalResponses: formData.responsesCount,
          completionRate: calculateCompletionRate(formData.responsesCount),
          averageTime: "N/A",
          questions: formData.questions.map((question) => {
            const questionAnswers = responseFormData
              .map((answer) => answer.answers[question.id])
              .filter((answer) => answer !== undefined)

            return {
              id: question.id,
              question: question.title,
              type: question.type,
              options: question.options || [],
              responses: questionAnswers
            }
          })
        }

        console.log(updatedFormData)
        console.log(responseFormData)

        setMockFormData(updatedFormData)
        setSelectedQuestion(updatedFormData.questions[0])

      } catch (error) {
        console.error("Erro ao atualizar os dados do mock:", error)
      }
    }
    fetchData()
  }, [])

  const pieChartData = selectedQuestion?.options?.map((option: string, index: number): { name: string, value: number } => {
    const responseCount = selectedQuestion.responses.filter((response: string) => response === option).length;
    return {
      name: option,
      value: responseCount
    };
  }) || [];

  useEffect(() => {
    console.log('Selected Question:', selectedQuestion);
  }, [selectedQuestion]);




  const calculateCompletionRate = (responsesCount: number): number => {
    return responsesCount > 100 ? 85 : 70
  }

  const exportData = () => {
    const csvContent = [
      ["Pergunta", "Opção", "Respostas", "Porcentagem"],
      ...mockFormData.questions.flatMap((question: any) =>
        question.options.map((option: string, index: number) => [
          question.question,
          option,
          question.responses[index],
          ((question.responses[index] / question.responses.reduce((a: number, b: number) => a + b, 0)) * 100).toFixed(2) + "%"
        ])
      )
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "estatisticas_pesquisa.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">{mockFormData.title} - Estatísticas</h1>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total de Respostas", value: mockFormData.totalResponses, icon: Users },
          { title: "Taxa de Conclusão", value: `${mockFormData.completionRate}%`, icon: CheckCircle },
          { title: "Tempo Médio", value: mockFormData.averageTime, icon: Clock },
          { title: "Perguntas", value: mockFormData.questions.length, icon: HelpCircle },
        ].map((card, index) => (
          <Card key={index} className="flex flex-col transition-all duration-300 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="chart" className="space-y-6">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-auto">
          <TabsTrigger value="chart" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">
            <BarChart3 className="w-4 h-4 mr-2" /> Gráfico
          </TabsTrigger>

          <TabsTrigger value="responses" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">
            <Search className="w-4 h-4 mr-2" /> Respostas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="space-y-6">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <Card className="col-span-2 md:col-span-1 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle>{selectedQuestion?.question}</CardTitle>
                <CardDescription>Distribuição das respostas</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px] sm:h-[300px] md:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((_entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-2 md:col-span-1 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Perguntas</CardTitle>
                <CardDescription>Selecione uma pergunta para visualizar as estatísticas</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[250px]">
                  {mockFormData.questions
                    .filter((question: { type: string }) => question.type === "radio" || question.type === "checkbox")
                    .map((question: { id: Key | null | undefined; question: string }) => ( 
                      <div
                        key={question.id}
                        className={`p-3 cursor-pointer rounded transition-colors duration-200 ${selectedQuestion.id === question.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                        onClick={() => setSelectedQuestion(question)}
                      >
                        {question.question}
                      </div>
                    ))}
                </ScrollArea>

              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Search className="w-4 h-4 mr-2" />
              Ver Todas as Respostas
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Todas as Respostas</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[calc(90vh-100px)] mt-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left p-3 font-medium">Respondente</th>
                      {mockFormData.questions.map((question: { id: Key | null | undefined; question: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }) => (
                        <th key={question.id} className="text-left p-3 font-medium">{question.question}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mockFormData.questions[0]?.responses?.map((_: any, index: number) => (
                      <tr key={index} className="border-b last:border-b-0">
                        <td className="p-3">Respondente {index + 1}</td>
                        {mockFormData.questions.map((question: { id: Key | null | undefined; responses: any[] }) => (
                          <td key={question.id} className="p-3">{question.responses[index] || 'Nenhuma resposta'}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={exportData}>
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </Button>
      </div>
    </div>
  )
}
