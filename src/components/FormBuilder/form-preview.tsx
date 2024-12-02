"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { DialogTitle } from "@radix-ui/react-dialog"

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

interface FormPreviewProps {
  pages: FormPage[];
}

export function FormPreview({ pages }: FormPreviewProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({})

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleAnswer = (elementId: number, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [elementId]: value }))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleNext()
    }
  }

  const renderInput = (element: FormElement) => (
    <Input
      id={`preview-${element.id}`}
      placeholder="Sua resposta"
      value={answers[element.id] as string || ''}
      onChange={(e) => handleAnswer(element.id, e.target.value)}
      onKeyDown={handleKeyDown}
      className="text-2xl p-4 border-none shadow-none focus:ring-0"
    />
  )

  const renderTextarea = (element: FormElement) => (
    <Textarea
      id={`preview-${element.id}`}
      placeholder="Sua resposta"
      value={answers[element.id] as string || ''}
      onChange={(e) => handleAnswer(element.id, e.target.value)}
      onKeyDown={handleKeyDown}
      className="text-2xl p-4 border-none shadow-none focus:ring-0 resize-none"
      rows={5}
    />
  )

  const renderRadio = (element: FormElement) => (
    <RadioGroup
      value={answers[element.id] as string || ''}
      onValueChange={(value) => handleAnswer(element.id, value)}
    >
      {element.options.map((option, index) => (
        <div key={index} className="flex items-center space-x-2 mb-4">
          <RadioGroupItem 
            value={option} 
            id={`preview-radio-${element.id}-${index}`}
            className="border-2"
          />
          <Label 
            htmlFor={`preview-radio-${element.id}-${index}`} 
            className="text-xl"
          >
            {option}
          </Label>
        </div>
      ))}
    </RadioGroup>
  )

  const renderCheckbox = (element: FormElement) => (
    <div className="space-y-4">
      {element.options.map((option, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Checkbox
            id={`preview-checkbox-${element.id}-${index}`}
            checked={(answers[element.id] as string[] || []).includes(option)}
            onCheckedChange={(checked) => {
              const currentAnswers = answers[element.id] as string[] || []
              const updatedAnswers = checked
                ? [...currentAnswers, option]
                : currentAnswers.filter(item => item !== option)
              handleAnswer(element.id, updatedAnswers)
            }}
            className="border-2"
          />
          <Label 
            htmlFor={`preview-checkbox-${element.id}-${index}`} 
            className="text-xl"
          >
            {option}
          </Label>
        </div>
      ))}
    </div>
  )

  const renderElement = (element: FormElement) => {
    switch (element.type) {
      case 'text': return renderInput(element)
      case 'textarea': return renderTextarea(element)
      case 'radio': return renderRadio(element)
      case 'checkbox': return renderCheckbox(element)
      
      default: return null
    }
  }

  const currentElement = pages[currentPage]?.elements[0]
  const progress = ((currentPage / (pages.length - 1)) * 100).toFixed(0)

  return (
    <div className="h-full flex flex-col justify-between bg-background">
      <div className="w-full h-1 bg-muted">
        <DialogTitle>Visualização do Formulário</DialogTitle>
        <div className="h-full transition-all duration-300 ease-in-out bg-primary" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="flex-1 flex flex-col justify-center items-center p-4 md:p-8">
        <div className="w-full max-w-2xl space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {pages.length === 0 ? (
                <p className="text-xl text-muted-foreground">Não há perguntas ainda</p>
              ) : (
                <>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    {currentElement?.question}
                  </h2>
                  {currentElement?.description && (
                    <p className="text-lg md:text-xl mb-8 text-muted-foreground">
                      {currentElement.description}
                    </p>
                  )}
                  {currentElement && renderElement(currentElement)}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="flex justify-between items-center p-4 border-t">
        <Button
          onClick={handlePrevious}
          disabled={currentPage === 0}
          variant="ghost"
          className="flex items-center"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>
        <span className="text-sm text-muted-foreground">
          {currentPage + 1} de {pages.length}
        </span>
        <Button
          onClick={handleNext}
          disabled={currentPage === pages.length - 1}
          variant="ghost"
          className="flex items-center"
        >
          Próximo
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
