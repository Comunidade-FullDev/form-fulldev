import Link from "next/link"
import { PenLine, Download } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function CreateForm() {

  

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {/* Breadcrumb */}
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

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <Button
                variant="ghost"
                className="h-full w-full justify-start p-0"
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

          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <Button
                variant="ghost"
                className="h-full w-full justify-start p-0"
                asChild
              >
                <Link href="/form/import" className="flex flex-col items-center text-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-4">
                    <Download className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="mb-2 text-base font-semibold md:text-lg">Importar dados</h2>
                  <p className="text-xs text-muted-foreground md:text-sm">
                    Copie ou importe dados já existentes das<br />
                    suas questões
                  </p>
                </Link>
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
    </div>
  )
}

