"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BarChart, ImportIcon as FileImport, Share2, Settings, Send, Plus, Eye, Undo2, Redo2, Menu } from 'lucide-react'
import { FormElement } from "@/components/FormBuilder/form-element"
import { FormPreview } from "@/components/FormBuilder/form-preview"
import { PageManager } from "@/components/FormBuilder/page-manager"
import { createForm } from "@/services/endpoint/form"
import StatisticsPage from "@/components/FormBuilder/statistics"

interface FormElement {
  id: number;
  type: 'text' | 'textarea' | 'radio' | 'checkbox';
  question: string;
  options: string[];
  required: boolean;
  description: string;
}

interface FormPage {
  id: number;
  elements: FormElement[];
}

export default function FormBuilder() {
  const [pages, setPages] = useState<FormPage[]>([{ id: 1, elements: [] }])
  const [formTitle, setFormTitle] = useState("Meu Formulário");
  const [formDescription, setFormDescription] = useState("");
  const [activePage, setActivePage] = useState(1)
  const [showLeftSidebar, setShowLeftSidebar] = useState(false)
  const [activeElement, setActiveElement] = useState<number | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showStatistics, setShowStatistics] = useState(false)


  useEffect(() => {
    const savedPages = localStorage.getItem('formPages');
    const savedActivePage = localStorage.getItem('activePage');

    if (savedPages) {
      setPages(JSON.parse(savedPages));
    }
    if (savedActivePage) {
      setActivePage(parseInt(savedActivePage, 10));
    }
  }, []);

  
  useEffect(() => {
    const importedQuestionsJson = localStorage.getItem('importedQuestions');
    if (importedQuestionsJson) {
      const importedQuestions = JSON.parse(importedQuestionsJson);
  
      // Mapeando para garantir que cada pergunta seja um "page" com apenas uma questão
      const newPages = importedQuestions.map((q: any, index: number) => ({
        id: index + 1,
        elements: [{  // Alterado para "elements" no plural
          id: Date.now() + Math.random(),
          type: q.options.length > 0 ? 'radio' : 'text',
          question: q.question,
          options: q.options,
          required: false,
          description: '',
        }]
      }));
  
      setPages(newPages);
      localStorage.setItem('formPages', JSON.stringify(newPages));
    

    } else {
      const storedPages = localStorage.getItem('formPages');
      if (storedPages) {
        setPages(JSON.parse(storedPages));
        
      }
    }
  }, []);
  

  

  useEffect(() => {
    localStorage.setItem('formPages', JSON.stringify(pages));
    localStorage.setItem('activePage', activePage.toString());

    
  }, [pages, activePage]);

  const toggleLeftSidebar = () => setShowLeftSidebar(!showLeftSidebar)

  const addFormElement = (type: FormElement['type']) => {
    const newElement: FormElement = {
      id: Date.now(),
      type,
      question: `Nova pergunta ${pages[activePage - 1].elements.length + 1}`,
      options: type === 'radio' || type === 'checkbox' ? ['Opção 1', 'Opção 2'] : [],
      required: false,
      description: '',
    }
    const updatedPages = pages.map(page =>
      page.id === activePage
        ? { ...page, elements: [...page.elements, newElement] }
        : page
    )
    setPages(updatedPages)
    setActiveElement(newElement.id)
  }

  const updateFormElement = (id: number, updates: Partial<FormElement>) => {
    const updatedPages = pages.map(page => ({
      ...page,
      elements: page.elements.map(el => el.id === id ? { ...el, ...updates } : el)
    }))
    setPages(updatedPages)
  }

  const deleteFormElement = (id: number) => {
    const updatedPages = pages.map(page => ({
      ...page,
      elements: page.elements.filter(el => el.id !== id)
    }))
    setPages(updatedPages)
    if (activeElement === id) {
      setActiveElement(null)
    }
  }

  const addPage = () => {
    const newPage = { id: pages.length + 1, elements: [] }
    setPages([...pages, newPage])
    setActivePage(newPage.id)
  }

  const deletePage = (pageId: number) => {
    const updatedPages = pages.filter(page => page.id !== pageId);
    setPages(updatedPages);

    if (pageId === activePage) {
      setActivePage(updatedPages.length > 0 ? Math.min(activePage, updatedPages.length) : 1);
    } else {
      setActivePage(activePage > pageId ? activePage - 1 : activePage);
    }

    const reindexedPages = updatedPages.map((page, index) => ({
      ...page,
      id: index + 1,
    }));

    setPages(reindexedPages);

    if (activePage > reindexedPages.length) {
      setActivePage(reindexedPages.length);
    }
  }

  const saveForm = async () => {
    try {
      await createForm(pages, formTitle, formDescription);
    } catch (error) {
      console.error("Erro ao salvar o formulário:", error);
    }
  };


  return (
      <div className="flex flex-col h-screen
       bg-background text-foreground">
      
        <header className="border-b">
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleLeftSidebar}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
              <h1 className="text-lg font-semibold hidden lg:inline">Meu espaço de trabalho • Formulário</h1>
              <h1 className="text-lg font-semibold lg:hidden">Formulário</h1>
            </div>
        
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t px-4 py-2">
            <div className="flex flex-wrap items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Configurações</span>
                  </Button>
                </DialogTrigger> 
                <DialogContent className="sm:max-w-max w-max">
                  <DialogHeader>
                    <DialogTitle>Configurações do Formulário</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid items-center gap-4">
                      <Label htmlFor="name" className="">
                        Nome
                      </Label>
                      <Input
                      id="name"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="col-span-3"
                    />
                    </div>
                    <div className="grid items-center gap-4">
                      <Label htmlFor="description" className="">
                        Descrição
                      </Label>
                      <Textarea
                      id="description"
                      placeholder="Descrição do formulário"
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className="w-full"
                    />
                    </div>
                  </div>
                  <Button variant="fulldev" type="submit">Salvar Configurações</Button>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Compartilhar</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Compartilhar Formulário</DialogTitle>
                  </DialogHeader>
                  <div className="flex items-center space-x-2">
                    <Input defaultValue="" readOnly />
                    <Button size="sm">Copiar</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <FileImport className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Importar dados</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Importar Dados</DialogTitle>
                  </DialogHeader>
                  <Input type="file" />
                  <Button>Importar</Button>
                </DialogContent>
              </Dialog>
              <Dialog
          open={showStatistics}
          onOpenChange={setShowStatistics}
        >
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <BarChart className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Estatísticas</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-full w-full h-[90vh] p-0 overflow-y-auto">
              <StatisticsPage />
            </DialogContent>
          </Dialog>
            </div>
            <Button className="bg-primary hover:bg-primary/90" onClick={saveForm}>
            <Send className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Publicar</span>
          </Button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <div className={`w-64 border-r ${showLeftSidebar ? 'block' : 'hidden'} lg:block`}>
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                <PageManager 
                  pages={pages}
                  activePage={activePage}
                  setActivePage={setActivePage}
                  addPage={addPage}
                  deletePage={deletePage}
                />
              </div>
            </ScrollArea>
          </div>

          <div className="flex-1 overflow-auto">
            <div className="flex flex-wrap items-center gap-2 p-4 border-b">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                  disabled={pages[activePage - 1]?.elements.length >= 1} 
                  variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar pergunta
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => addFormElement('text')}>Texto curto</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => addFormElement('textarea')}>Texto longo</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => addFormElement('radio')}>Múltipla escolha</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => addFormElement('checkbox')}>Caixa de seleção</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    Visualizar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-full h-[90vh] p-0">
                  <FormPreview pages={pages} />
                </DialogContent>
              </Dialog>
              <Button variant="ghost" size="sm">
                <Undo2 className="h-4 w-4" />
                <span className="sr-only">Desfazer</span>
              </Button>
              <Button variant="ghost" size="sm">
                <Redo2 className="h-4 w-4" />
                <span className="sr-only">Refazer</span>
              </Button>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {pages[activePage - 1]?.elements.map((element) => (
                  <FormElement
                    key={element.id}
                    element={element}
                    isActive={activeElement === element.id}
                    onClick={() => setActiveElement(element.id)}
                    onUpdate={(updates) => updateFormElement(element.id, updates)}
                    onDelete={() => deleteFormElement(element.id)}                   
                    />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}