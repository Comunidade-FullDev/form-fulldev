'use client';
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Link2, Share2 } from 'lucide-react';
import { Form, FormWorkspace } from '@/types/Form';
import { getMyPublicsForms } from '@/services/endpoint/form';
import { FaFacebook, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { CopyButton, ShareModal } from '../CopyAndShare';


export default function PublishedForms() {
  const sharedMessage = localStorage.getItem("sharedMessage") || ""
  const [searchTerm, setSearchTerm] = useState('');
  const [forms, setForms] = useState<FormWorkspace[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);


  useEffect(() => {
    const fetchForms = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getMyPublicsForms();
        setForms(data || []);
      } catch (err: any) {
        setError(err.message || 'Erro desconhecido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchForms();
  }, []);

  const filteredForms = Array.isArray(forms)
  ? forms.filter((form) =>
      form.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : [];


  return (
    <div className="space-y-4">
      <Input
        placeholder="Buscar formulários publicados"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      <div className="rounded-md border">
      {isLoading ? (
      
          <p>Carregando...</p>
        ) : filteredForms.length === 0 && searchTerm !== "" ? (
          <p className="p-4 text-center text-gray-500">Nenhum formulário publicado com o título "{searchTerm}" foi encontrado.</p>
        ) :  forms.length === 0  || filteredForms.length === 0 ? ( 
          <p className="p-4 text-center text-gray-500">Você ainda não publicou nenhum formulário.</p>
        ): error ? (
          <p className="text-red-500">{error}</p>
        )  :(
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
                <TableRow key={form.id} onClick={() => window.location.href = `/form/builder?id=${form.id}`}>
                  <TableCell className="font-medium">{form.title}</TableCell>
                  <TableCell>{new Date(form.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {form.views}
                    </div>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>

                      <CopyButton textToCopy={form.link} />

                      <ShareModal link={form.link} message={sharedMessage} />
                      
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
