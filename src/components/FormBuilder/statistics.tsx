'use client'

import { useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BarChart3, ListChecks, Search, Users, CheckCircle, Clock, HelpCircle, Download } from 'lucide-react'

// Dados simulados para demonstração (pega na api ..)
const mockFormData = {
  title: "Pesquisa de Satisfação do Cliente",
  totalResponses: 150,
  completionRate: 85,
  averageTime: "3m 45s",
  questions: [
    {
      id: 1,
      question: "Qual sua satisfação com o nosso produto?",
      type: "radio",
      options: ["Muito Satisfeito", "Satisfeito", "Neutro", "Insatisfeito", "Muito Insatisfeito"],
      responses: [50, 60, 20, 15, 5],
    },
    {
      id: 2,
      question: "Quais recursos você mais usa? (Selecione todos que se aplicam)",
      type: "checkbox",
      options: ["Recurso A", "Recurso B", "Recurso C", "Recurso D"],
      responses: [100, 80, 60, 40],
    },
    {
      id: 3,
      question: "Qual a probabilidade de recomendar nosso produto a outras pessoas?",
      type: "radio",
      options: ["Muito Provável", "Provável", "Neutro", "Pouco Provável", "Nada Provável"],
      responses: [70, 40, 25, 10, 5],
    },
  ],
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function StatisticsPage() {
  const [selectedQuestion, setSelectedQuestion] = useState(mockFormData.questions[0])

  const pieChartData = selectedQuestion.options.map((option, index) => ({
    name: option,
    value: selectedQuestion.responses[index],
  }))
//aqui e opcional, fiz mais pra colocar algo a mais
  const exportData = () => {
    const csvContent = [
      ["Pergunta", "Opção", "Respostas", "Porcentagem"],
      ...mockFormData.questions.flatMap(question =>
        question.options.map((option, index) => [
          question.question,
          option,
          question.responses[index],
          ((question.responses[index] / question.responses.reduce((a, b) => a + b, 0)) * 100).toFixed(2) + "%"
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

      {/* Visão geral do painel */}
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

      {/* Abas para visualização */}
      <Tabs defaultValue="chart" className="space-y-6">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-auto">
          <TabsTrigger value="chart" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">
            <BarChart3 className="w-4 h-4 mr-2" /> Gráfico
          </TabsTrigger>
        
          <TabsTrigger value="responses" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">
            <Search className="w-4 h-4 mr-2" /> Respostas
          </TabsTrigger>
        </TabsList>

        {/* Aba de gráficos */}
        <TabsContent value="chart" className="space-y-6">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <Card className="col-span-2 md:col-span-1 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle>{selectedQuestion.question}</CardTitle>
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
                      {pieChartData.map((entry, index) => (
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
                  {mockFormData.questions.map((question) => (
                    <div
                      key={question.id}
                      className={`p-3 cursor-pointer rounded transition-colors duration-200 ${
                        selectedQuestion.id === question.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                      }`}
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

        {/* Aba de tabela */}
        <TabsContent value="table">
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle>Resumo das Respostas</CardTitle>
              <CardDescription>Distribuição detalhada das respostas de cada pergunta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left p-3 font-medium">Pergunta</th>
                      <th className="text-left p-3 font-medium">Opção</th>
                      <th className="text-left p-3 font-medium">Respostas</th>
                      <th className="text-left p-3 font-medium">Porcentagem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockFormData.questions.flatMap((question) =>
                      question.options.map((option, index) => (
                        <tr key={`${question.id}-${index}`} className="border-b last:border-b-0">
                          <td className="p-3">{index === 0 ? question.question : ''}</td>
                          <td className="p-3">{option}</td>
                          <td className="p-3">{question.responses[index]}</td>
                          <td className="p-3">
                            {((question.responses[index] / question.responses.reduce((a, b) => a + b, 0)) * 100).toFixed(2)}%
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de respostas individuais */}
        <TabsContent value="responses">
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle>Todas as Respostas</CardTitle>
              <CardDescription>Distribuição detalhada das respostas por respondente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left p-3 font-medium">Respondente</th>
                      {mockFormData.questions.map((question) => (
                        <th key={question.id} className="text-left p-3 font-medium">{question.question}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(10)].map((_, index) => (
                      <tr key={index} className="border-b last:border-b-0">
                        <td className="p-3">Respondente {index + 1}</td>
                        {mockFormData.questions.map((question) => (
                          <td key={question.id} className="p-3">
                            {question.type === 'checkbox'
                              ? question.options.filter(() => Math.random() > 0.5).join(', ')
                              : question.options[Math.floor(Math.random() * question.options.length)]
                            }
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Botões para visualizar todas as respostas e exportar dados */}
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
                      {mockFormData.questions.map((question) => (
                        <th key={question.id} className="text-left p-3 font-medium">{question.question}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(10)].map((_, index) => (
                      <tr key={index} className="border-b last:border-b-0">
                        <td className="p-3">Respondente {index + 1}</td>
                        {mockFormData.questions.map((question) => (
                          <td key={question.id} className="p-3">
                            {question.type === 'checkbox'
                              ? question.options.filter(() => Math.random() > 0.5).join(', ')
                              : question.options[Math.floor(Math.random() * question.options.length)]
                            }
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
        <Button size="lg" onClick={exportData} className="bg-green-600 text-white hover:bg-green-700">
          <Download className="w-4 h-4 mr-2" />
          Exportar para Excel
        </Button>
      </div>
    </div>
  )
}