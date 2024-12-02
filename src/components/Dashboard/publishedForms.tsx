'use client'
import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Eye, Link2, Share2 } from 'lucide-react'

interface PublishedForm {
  id: string
  name: string
  publishedAt: Date
  views: number
  url: string
}

const publishedForms: PublishedForm[] = [
  { id: '1', name: 'Pesquisa de Satisfação', publishedAt: new Date('2024-03-01'), views: 150, url: 'https://forms.example.com/f/1' },
  { id: '2', name: 'Inscrição para Evento', publishedAt: new Date('2024-03-05'), views: 300, url: 'https://forms.example.com/f/2' },
  { id: '3', name: 'Feedback de Produto', publishedAt: new Date('2024-03-10'), views: 75, url: 'https://forms.example.com/f/3' },
]

export default function PublishedForms() {
  const [searchTerm, setSearchTerm] = React.useState('')

  const filteredForms = publishedForms.filter(form =>
    form.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <Input
        placeholder="Buscar formulários publicados"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Nome do Formulário</TableHead>
              <TableHead>Data de Publicação</TableHead>
              <TableHead>Visualizações</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredForms.map((form) => (
              <TableRow key={form.id}>
                <TableCell className="font-medium">{form.name}</TableCell>
                <TableCell>{form.publishedAt.toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {form.views}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigator.clipboard.writeText(form.url)}
                  >
                    <Link2 className="h-4 w-4" />
                    <span className="sr-only">Copiar link</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Compartilhar</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
