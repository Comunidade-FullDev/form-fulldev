import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DeleteFormDialogProps } from "@/types/Form"

export function DeleteFormDialog({
  form,
  open,
  onOpenChange,
  onDelete,
}: DeleteFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-max w-full">
        <DialogHeader>
          <DialogTitle>Deletar formulário</DialogTitle>
          <DialogDescription>
          Você tem certeza que deseja deletar "{form.title}"? Essa são não poderá ser revertida.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => onDelete(form.id)}
          >
           Deletar formulário
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

