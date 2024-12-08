import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2 } from 'lucide-react'

export default function EmailSentAlert() {
  return (
    <Alert variant="default" className="bg-green-50 border-green-300 text-green-800">
      <CheckCircle2 className="h-4 w-4 text-green-600" />
      <AlertTitle className="text-green-800 font-medium">Sucesso!</AlertTitle>
      <AlertDescription className="text-green-700">
        Email enviado com sucesso.
      </AlertDescription>
    </Alert>
  )
}

