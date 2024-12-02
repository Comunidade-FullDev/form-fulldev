import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2 } from 'lucide-react'
import { useState } from "react";

interface FormPage {
  id: number;
  elements: any[];
}

interface PageManagerProps {
  pages: FormPage[];
  activePage: number;
  setActivePage: (pageId: number) => void;
  addPage: () => void;
  deletePage: (pageId: number) => void;
}

export function PageManager({ pages, activePage, setActivePage, addPage, deletePage }: PageManagerProps) {

  const handleDeletePage = (pageId: number) => {

    deletePage(pageId); //funcao remove a pagina selecionada

    if (activePage === pageId) {
   
      if (pages.length > 1) {
        setActivePage(Math.max(pageId - 1, 0));  
      } else {
        setActivePage(0);  
      }
    } else if (activePage > pageId) {
      setActivePage(activePage - 1);
    }
  }

  const handleAddPage = () => {
    addPage();
    setActivePage(pages.length); 
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {pages.map((page) => (
          <Button
            key={page.id}
            variant={activePage === page.id ? "secondary" : "ghost"}
            className="w-full justify-between relative"
            onClick={() => setActivePage(page.id)}
          >
            <span>Página {page.id}</span>
            {pages.length > 1 && page.id !== 1 && (
              <Trash2
                className="h-4 w-4 text-muted-foreground hover:text-destructive relative z-20"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeletePage(page.id)
                }}
                style={{ pointerEvents: 'all' }} // fiz para o ícone de deletar funcionar corretamente pq nao sei o motivo de nao funcionar sem isso
              />
            )}
          </Button>
        ))}
      </div>
      <Button className="w-full" onClick={handleAddPage}>
        <Plus className="mr-2 h-4 w-4" />
        Nova Página
      </Button>
      <Separator />
    </div>
  )
}
