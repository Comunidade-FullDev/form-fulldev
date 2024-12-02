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
import { EditFormDialogProps } from "@/types/Form"

export function EditFormDialog({
  form,
  open,
  onOpenChange,
}: EditFormDialogProps) {
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
            <Label htmlFor="name">Form Name</Label>
            <Input id="name" defaultValue={form.name} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" placeholder="Insira a descrição" />
          </div>
        </div>
        <DialogFooter className="gap-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit">Salvar alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

