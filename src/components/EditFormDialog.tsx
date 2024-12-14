import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateForm } from "@/services/endpoint/form"
import { EditFormDialogProps } from "@/types/Form"
import { useEffect, useState } from "react"

interface Form {
  title: string;
  description: string;
}

export function EditFormDialog({
  form,
  open,
  onOpenChange,
}: EditFormDialogProps) {
  const [formTitle, setFormTitle] = useState(form.title); 
  const [formDescription, setFormDescription] = useState(form.description); 
  const formData = form

  const changeForm = async () => {
    if (formData) {
      const formDTO = {
        title: formTitle,
        description: formDescription,
        questions: formData.questions || [],
      };
    
      try {
        await updateForm(parseInt(form.id, 10), formDTO);
        window.location.href = "../workspace";
      } catch (error) {
        console.error("Erro ao atualizar o formulário:", error);
      }
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-full w-max">
        <DialogHeader>
          <DialogTitle>Editar meu formulário</DialogTitle>
          <DialogDescription>
            Faça mudanças gerais em seu form
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input 
            id="name"
            defaultValue={form.title}
            onChange={(e) => setFormTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Input 
            id="description" 
            defaultValue={form.description}
            onChange={(e) => setFormDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="gap-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" onClick={changeForm}>Salvar alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

