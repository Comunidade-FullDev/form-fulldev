'use client';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, FileEdit, Import, Plus, Share2, Trash2 } from 'lucide-react';
import Link from "next/link";
import { EditFormDialog } from "@/components/EditFormDialog";
import { DeleteFormDialog } from "@/components/DeleteFormDialog";
import { Form } from '@/types/Form';

const generateFakeForms = (num: number): Form[] => {
  const forms: Form[] = [];
  for (let i = 0; i < num; i++) {
    forms.push({
      id: String(i + 1),
      title: `Formulário ${i + 1}`,
      createdAt: new Date(2024, 11, 7 - (i % 30)),
      responsesCount: Math.floor(Math.random() * 100),
      idPublic: '',
      description: '',
      questions: [],
      link: ''
    });
  }
  return forms;
};

const searchForms = (forms: Form[], searchTerm: string) => {
  if (!searchTerm) return forms;
  return forms.filter(form => form.title.toLowerCase().includes(searchTerm.toLowerCase()));
};

export default function Forms() {
  const [forms, setForms] = useState<Form[]>([]);
  const [editingForm, setEditingForm] = useState<Form | null>(null);
  const [deletingForm, setDeletingForm] = useState<Form | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [formsPerPage] = useState(5);

  useEffect(() => {
    const loadedForms = generateFakeForms(30);
    setForms(loadedForms);
  }, []);

  const indexOfLastForm = currentPage * formsPerPage;
  const indexOfFirstForm = indexOfLastForm - formsPerPage;
  const currentForms = searchForms(forms, searchTerm).slice(indexOfFirstForm, indexOfLastForm);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleDelete = (id: string) => {
    setForms((prev) => prev.filter((form) => form.id !== id));
    setDeletingForm(null);
  };

  return (
    <div className="space-y-4 md:w-full w-max">
      <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Buscar formulários"
          className="max-w-xs w-full"
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex flex-wrap gap-2 w-max">
          <Button variant="outline" size="sm" className="flex-grow sm:flex-grow-0">
            <Import className="mr-2 h-4 w-4" />
            Importar forms
          </Button>
          <Link href="/form/create">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Criar novo formulário
            </Button>
          </Link>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Seus forms</TableHead>
              <TableHead className="hidden sm:table-cell">Data de criação</TableHead>
              <TableHead>Respostas</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentForms.map((form) => (
              <TableRow key={form.id}>
                <TableCell>{form.title}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {form.createdAt.toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>{form.responsesCount} respostas</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingForm(form)}
                    >
                      <FileEdit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="md:block">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    {/* <Button
                      className='myWonderfulButton md:hidden'
                      onClick={
                        () => {
                          navigator.share({
                            title: 'Share',
                            text: 'whatevs',
                            url: form.link
                          }
                          )
                        }
                      }>
                      <Share2 className="h-4 w-4" />
                    </Button> */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingForm(form)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm">
          {currentPage} - {Math.ceil(searchForms(forms, searchTerm).length / formsPerPage)} de {Math.ceil(searchForms(forms, searchTerm).length / formsPerPage)} páginas
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(searchForms(forms, searchTerm).length / formsPerPage)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      {editingForm && (
        <EditFormDialog
          form={editingForm}
          open={!!editingForm}
          onOpenChange={(open) => !open && setEditingForm(null)}
        />
      )}
      {deletingForm && (
        <DeleteFormDialog
          form={deletingForm}
          open={!!deletingForm}
          onOpenChange={(open) => !open && setDeletingForm(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
