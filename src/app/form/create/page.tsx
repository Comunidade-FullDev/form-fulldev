'use client'

import Link from "next/link"
import { PenLine, Download, Rocket, Zap, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/navigation'

export default function CreateForm() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const router = useRouter()

  const handleModalOpen = () => {
    setIsModalOpen(true)
  }

  const simulateLoading = () => {
    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        setLoadingProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            resolve();
            return 100;
          }
          return prevProgress + 10;
        });
      }, 300);
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const topic = formData.get('topic') as string;
    const questionCount = formData.get('questionCount') as string;

    setIsLoading(true);
    setLoadingProgress(0);

    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        body: JSON.stringify({ topic, questionCount }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('erro ao gerar questoes');
      }

      const data = await response.json();

      localStorage.setItem('importedQuestions', JSON.stringify(data));
      await simulateLoading();

      router.push('/form/builder');
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };


  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/workspace" className="hover:text-foreground">
          Meu espaço de trabalho
        </Link>
        <span>&gt;</span>
        <span>Criar novo formulário</span>
      </nav>

      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h1 className="mb-2 text-2xl font-bold md:text-3xl">
            O que vamos construir hoje? <span className="inline-block" role="img" aria-label="Rosto sorridente">🙂</span>
          </h1>
          <p className="text-sm text-muted-foreground md:text-base">
            Hey! Você pode começar criando um do zero ou usando um template
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 auto-rows-fr">
          <Card className="overflow-hidden h-full">
            <CardContent className="p-6 h-full">
              <Button
                variant="ghost"
                className="h-full w-full p-0 flex flex-col items-center justify-center"
                asChild
              >
                <Link href="/form/builder" className="flex flex-col items-center text-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-4">
                    <PenLine className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="mb-2 text-base font-semibold md:text-lg">Iniciar do zero</h2>
                  <p className="text-xs text-muted-foreground md:text-sm">
                    Comece projetando e solicitando elementos para<br />
                    criar seu formulário do zero
                  </p>
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden h-full">
            <CardContent className="p-6 h-full">
              <Button
                variant="ghost"
                className="h-full w-full p-0 flex flex-col items-center justify-center"
                onClick={handleModalOpen}
              >
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <Download className="h-6 w-6 text-primary" />
                </div>
                <h2 className="mb-2 text-base font-semibold md:text-lg">Importar perguntas com I.A</h2>
                <p className="text-xs text-muted-foreground md:text-sm">
                  escolha um tema e peça para a I.A<br />
                  gerar suas questões
                </p>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center text-xs md:text-sm">
          <span className="text-muted-foreground">Precisa de ajuda para começar? </span>
          <Link
            href="/support"
            className="font-medium text-primary hover:underline"
          >
            Solicite um suporte agora
          </Link>
        </div>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-full max-w-lg p-4 sm:p-6">
          {!isLoading ? (
            <>
              <DialogHeader>
                <DialogTitle>Importar perguntas</DialogTitle>
                <DialogDescription>
                  Insira o tópico e o número de questões que você deseja gerar.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="topic">Tópico</Label>
                    <Input
                      id="topic"
                      name="topic"
                      placeholder="Ex: principais perguntas em uma entrevista de emprego"
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="questionCount">Número de questões</Label>
                    <Input
                      id="questionCount"
                      name="questionCount"
                      type="number"
                      placeholder="Ex: 10"
                      required
                      min="1"
                      max="50"
                      className="w-full"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full sm:w-auto">
                    Gerar questões
                  </Button>
                </DialogFooter>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-6 p-4 sm:p-6">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
                <Zap
                  className="h-16 w-16 sm:h-24 sm:w-24 text-yellow-500 animate-pulse z-10 relative"
                  strokeWidth={1.5}
                  fill="currentColor"
                />
              </div>
              <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                <Zap className="h-5 w-5 text-yellow-500 animate-pulse" />
                <span className="text-sm font-medium animate-pulse text-center">
                  Gerando questões na velocidade da luz! 🌟
                </span>
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-2.5 rounded-full animate-pulse"
                  style={{ width: "75%" }}
                ></div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-center">
                  Preparando conteúdo inteligente em alta velocidade...
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
