"use client"

import { SetStateAction, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BarChart, ImportIcon as FileImport, Share2, Settings, Send, Plus, Eye, Undo2, Redo2, Menu, FileEdit, Save, CheckCircle2 } from 'lucide-react'
import { FormElement } from "@/components/FormBuilder/form-element"
import { FormPreview } from "@/components/FormBuilder/form-preview"
import { PageManager } from "@/components/FormBuilder/page-manager"
import { createForm, getFormById, updateForm, publishFormById } from "@/services/endpoint/form"
import StatisticsPage from "@/components/FormBuilder/statistics"
import Link from "next/link";
import { useRouter } from "next/navigation"
import { FaSave } from "react-icons/fa"
import { CreateForm, FormDTO } from "@/types/Form"
import { AnimatePresence, motion } from "framer-motion"
import { Alert, AlertTitle } from "@/components/ui/alert"

interface FormElement {
  id: number;
  type: 'text' | 'textarea' | 'radio' | 'checkbox';
  question: string;
  options: string[];
  required: boolean;
  questionDescription: string;
}

interface FormPage {
  id: number;
  elements: FormElement[];
}

export default function FormBuilder() {
  const router = useRouter();
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [pages, setPages] = useState<FormPage[]>([{ id: 1, elements: [] }])
  const [formTitle, setFormTitle] = useState("Meu Formulário");
  const [formDescription, setFormDescription] = useState("");
  const [activePage, setActivePage] = useState(1)
  const [showLeftSidebar, setShowLeftSidebar] = useState(false)
  const [activeElement, setActiveElement] = useState<number | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showStatistics, setShowStatistics] = useState(false)
  const [formData, setFormData] = useState<CreateForm | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const copyLink = () => {
    navigator.clipboard.writeText(formData?.link || "");
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  const showAlertMessage = (message: SetStateAction<string>) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const fetchFormData = async (id: string) => {
    try {
      const data = await getFormById(parseInt(id, 10));
      setFormData(data);
    } catch (error) {
      console.error("Erro ao carregar os dados do formulário:", error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const formId = params.get("id");
    const importedQuestions = localStorage.getItem('importedQuestions');;
    console.log(formId)

    if (formId) {
      fetchFormData(formId);
    }else if(importedQuestions){
      console.log("pegou as importadas")
      localStorage.removeItem("formPages")
    }
    
    if(!formId && !importedQuestions){
      console.log("entrou aqui")
      localStorage.removeItem("formPages")
      localStorage.removeItem("importedQuestions")
    }
  }, []);

  useEffect(() => {
    if (formData) {
      const pagesFromForm = formData.questions.map((q, index) => ({
        id: index + 1,
        elements: [
          {
            id: q.id,
            type: q.type as "text" | "textarea" | "radio" | "checkbox",
            question: q.title,
            options: q.options || [],
            required: q.required,
            questionDescription: q.questionDescription
          },
        ],
      }));

      console.log("Pages from form:", pagesFromForm);
      setPages(pagesFromForm);
      setActivePage(1);

      localStorage.setItem("formPages", JSON.stringify(pagesFromForm));
      localStorage.setItem("activePage", "1");
    }
  }, [formData]);


  useEffect(() => {
    const savedPages = localStorage.getItem("formPages");
    const savedActivePage = localStorage.getItem("activePage");

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

      const newPages = importedQuestions.map((q: any, index: number) => ({
        id: index + 1,
        elements: [{
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
    localStorage.removeItem("importedQuestions")

  }, []);

  useEffect(() => {
    
    localStorage.setItem("formPages", JSON.stringify(pages));
    localStorage.setItem("activePage", activePage.toString());
    console.log("Páginas salvas no localStorage", pages);
  }, [pages, activePage]);

  const toggleLeftSidebar = () => setShowLeftSidebar(!showLeftSidebar)

  const addFormElement = (type: FormElement['type']) => {
    const newElement: FormElement = {
      id: Date.now(),
      type,
      question: `Nova pergunta ${pages[activePage - 1]?.elements.length + 1}`,
      options: type === 'radio' || type === 'checkbox' ? ['Opção 1', 'Opção 2'] : [],
      required: false,
      questionDescription: '',
    };

    const updatedPages = pages.map(page =>
      page.id === activePage
        ? { ...page, elements: [...page.elements, newElement] }
        : page
    );

    setPages(updatedPages);
    setActiveElement(newElement.id);
  };

  const updateFormElement = (id: number, updates: Partial<FormElement>) => {
    console.log("Antes de atualizar:", pages);

    const updatedPages = pages.map(page => ({
      ...page,
      elements: page.elements.map(el =>
        el.id === id ? { ...el, ...updates } : el
      ),
    }));

    console.log("Após atualizar:", updatedPages);

    console.log("form atualizado:", updatedPages.map(page => ({
      ...page,
      elements: page.elements.map(el => ({
        question: el.question,
        required: el.required,
      })),
    })));

    setPages(updatedPages);
    localStorage.setItem("formPages", JSON.stringify(updatedPages));
  };



  const updateOptions = (elementId: number, newOptions: string[]) => {
    const updatedPages = pages.map(page => ({
      ...page,
      elements: page.elements.map(el =>
        el.id === elementId ? { ...el, options: newOptions } : el
      ),
    }));
    setPages(updatedPages);
    localStorage.setItem("formPages", JSON.stringify(updatedPages));
  };



  const deleteFormElement = (id: number) => {
    const updatedPages = pages.map(page => ({
      ...page,
      elements: page.elements.filter(el => el.id !== id)
    }));

    setPages(updatedPages);

    if (activeElement === id) {
      setActiveElement(null);
    }
  };


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
      showAlertMessage("Formulário salvo com sucesso.")
      router.push("../workspace")
    } catch (error) {
      console.error("Erro ao salvar o formulário:", error);
    }
  };


  const changeForm = async () => {
    if (formData) {
      const formDTO: FormDTO = {
        title: formTitle,
        description: formDescription,
        questions: pages.flatMap(page =>
          page.elements.map(element => ({

            title: element.question,
            type: element.type,
            questionDescription: element.questionDescription,
            required: element.required,
            placeholder: "",
            options: element.options.length > 0
              ? element.options
              : []
          }))
        ),
      };
      try {
        await updateForm(parseInt(formData.id, 10), formDTO);
        showAlertMessage("Formulário atualizado com sucesso.")

        router.push("../workspace");
      } catch (error) {
        console.error("Erro ao atualizar o formulário:", error);
      }
    }
  };


  const publishForm = async () => {
    if (formData) {
      try {
        await publishFormById(parseInt(formData.id, 10))
        showAlertMessage("formulário publicado com sucesso")
        router.push("../workspace");
      } catch (error) {
        console.error("Erro ao publicar o formulário:", error);
      }
    }
  }

  useEffect(() => {
    if (formData) {
      setFormDescription(formData.description || "");
      setFormTitle(formData.title || "");
    }
  }, [formData]);

  const saveSettings = () => {
    console.log("Configurações salvas:", { formTitle, formDescription });
    setIsSettingsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-screen
       bg-background text-foreground">

      {showAlert && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed top-8 right-18 z-50 w-full max-w-sm"
          >
            <Alert
              variant="default"
              className="bg-green-50 border border-green-300 shadow-lg rounded-lg flex items-center gap-3 px-4 py-3"
            >
              <div className="flex items-center justify-center bg-green-100 text-green-600 rounded-full w-10 h-10">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <AlertTitle className="text-green-800 font-semibold">
                  {alertMessage}
                </AlertTitle>
              </div>
            </Alert>
          </motion.div>
        </AnimatePresence>
      )}
      <header className="border-b">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleLeftSidebar}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
            <h1 className="text-lg font-semibold hidden lg:inline"><Link href={"../workspace"}>Meu espaço de trabalho</Link> &gt; Formulário</h1>
            <h1 className="text-lg font-semibold lg:hidden">Formulário</h1>
          </div>

        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t px-4 py-2">
          <div className="flex flex-wrap items-center gap-2">
            <Dialog open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen}>
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
                    {formData ? (
                      <Input
                        id="name"
                        defaultValue={formData?.title || formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="col-span-3"
                      />
                    ) : (
                      <Input
                        id="name"
                        defaultValue={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="col-span-3"
                      />
                    )}

                  </div>
                  <div className="grid items-center gap-4">
                    <Label htmlFor="description" className="">
                      Descrição
                    </Label>
                    <Input
                      id="description"
                      placeholder={formTitle}
                      defaultValue={formData?.description}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
                <Button variant="fulldev" type="submit" onClick={saveSettings}>
                  Salvar Configurações
                </Button>
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
                  <Input defaultValue={formData?.link || "publique o formulário para que um link seja gerado"} readOnly />
                  <Button size="sm" onClick={copyLink}>{copiado ? 'Copiado!' : 'Copiar'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog
              open={showStatistics}
              onOpenChange={setShowStatistics}
              >
              <DialogTrigger asChild>
              {formData?.responsesCount && formData.responsesCount > 0 && (
                <Button variant="outline" size="sm">
                  <BarChart className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Estatísticas</span>
                </Button>
              )}
              </DialogTrigger>
              <DialogContent className="max-w-full w-full h-[90vh] p-0 overflow-y-auto">
                <StatisticsPage />
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex space-x-2">
            {formData ? (
              <>
                <Button className="bg-primary hover:bg-primary/90" onClick={changeForm}>
                  <FileEdit className="h-4 w-4" />
                  <span className="hidden sm:inline">Atualizar</span>
                </Button>
                {formData.isPublished == false &&(
                <Button className="bg-primary hover:bg-primary/90" onClick={publishForm}>
                  <Send className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Publicar</span>
                </Button>
                )}
              </>
            ) : (
              <>
                <Button className="bg-primary hover:bg-primary/90" onClick={saveForm}>
                  <FaSave className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Salvar</span>
                </Button>
              </>
            )}
          </div>
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