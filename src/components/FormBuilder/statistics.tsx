'use client'
import { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FiBarChart, FiList, FiSearch } from "react-icons/fi";

// Dados simulados para demonstração
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
};

export default function StatisticsPage() {
  const [selectedQuestion, setSelectedQuestion] = useState(mockFormData.questions[0]);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">{mockFormData.title} - Estatísticas</h1>

      {/* Visão geral do painel */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total de Respostas", value: mockFormData.totalResponses },
          { title: "Taxa de Conclusão", value: `${mockFormData.completionRate}%` },
          { title: "Tempo Médio", value: mockFormData.averageTime },
          { title: "Perguntas", value: mockFormData.questions.length },
        ].map((card, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Abas para visualização */}
      <Tabs defaultValue="chart" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chart">
            <FiBarChart className="mr-2" /> Visão Gráfica
          </TabsTrigger>
          <TabsTrigger value="table">
            <FiList className="mr-2" /> Visão em Tabela
          </TabsTrigger>
          <TabsTrigger value="responses">
            <FiSearch className="mr-2" /> Respostas Individuais
          </TabsTrigger>
        </TabsList>

        {/* Aba de gráficos */}
        <TabsContent value="chart" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-2 md:col-span-1">
              <CardHeader>
                <CardTitle>{selectedQuestion.question}</CardTitle>
                <CardDescription>Distrib uição das respostas</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={selectedQuestion.options.map((option, index) => ({
                      name: option,
                      value: selectedQuestion.responses[index],
                    }))}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-2 md:col-span-1">
              <CardHeader>
                <CardTitle>Perguntas</CardTitle>
                <CardDescription>Selecione uma pergunta para visualizar as estatísticas</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[250px]">
                  {mockFormData.questions.map((question) => (
                    <div
                      key={question.id}
                      className={`p-2 cursor-pointer rounded ${selectedQuestion.id === question.id ? 'bg-muted' : ''}`}
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
          <Card>
            <CardHeader>
              <CardTitle>Resumo das Respostas</CardTitle>
              <CardDescription>Distribuição detalhada das respostas de cada pergunta</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-2">Pergunta</th>
                      <th className="text-left p-2">Opção</th>
                      <th className="text-left p-2">Respostas</th>
                      <th className="text-left p-2">Porcentagem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockFormData.questions.flatMap((question) =>
                      question.options.map((option, index) => (
                        <tr key={`${question.id}-${index}`}>
                          <td className="p-2">{index === 0 ? question.question : ''}</td>
                          <td className="p-2">{option}</td>
                          <td className="p-2">{question.responses[index]}</td>
                          <td className="p-2">
                            {((question.responses[index] / question.responses.reduce((a, b) => a + b, 0)) * 100).toFixed(2)}%
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de respostas individuais */}
        <TabsContent value="responses">
          <Card>
            <CardHeader>
              <CardTitle>Todas as Respostas</CardTitle>
              <CardDescription>Distribuição detalhada das respostas por respondente</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-2">Respondente</th>
                      {mockFormData.questions.map((question) => (
                        <th key={question.id} className="text-left p-2">{question.question}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(10)].map((_, index) => (
                      <tr key={index}>
                        <td className="p-2">Respondente {index + 1}</td>
                        {mockFormData.questions.map((question) => (
                          <td key={question.id} className="p-2">
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
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Botão para visualizar todas as respostas */}
      <div className="mt-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Ver Todas as Respostas</Button>
          </DialogTrigger>
          < DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Todas as Respostas</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[calc(90vh-100px)] mt-4">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-2">Respondente</th>
                    {mockFormData.questions.map((question) => (
                      <th key={question.id} className="text-left p-2">{question.question}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(10)].map((_, index) => (
                    <tr key={index}>
                      <td className="p-2">Respondente {index + 1}</td>
                      {mockFormData.questions.map((question) => (
                        <td key={question.id} className="p-2">
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
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}