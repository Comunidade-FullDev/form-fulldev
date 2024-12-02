'use client'
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Trash2, GripVertical } from 'lucide-react'
import { Switch } from "@/components/ui/switch"

interface FormElementProps {
  element: {
    id: number;
    type: 'text' | 'textarea' | 'radio' | 'checkbox'; 
    question: string;
    options: string[];
    required: boolean;
    description: string;
  };
  isActive: boolean;
  onClick: () => void;
  onUpdate: (updates: Partial<FormElementProps['element']>) => void;
  onDelete: () => void;
}

export function FormElement({ element, isActive, onClick, onUpdate, onDelete }: FormElementProps) {
  const [isEditing, setIsEditing] = useState(false)

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ question: e.target.value })
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ description: e.target.value })
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...element.options]
    newOptions[index] = value
    onUpdate({ options: newOptions })
  }

  const addOption = () => {
    onUpdate({ options: [...element.options, `Opção ${element.options.length + 1}`] })
  }

  const removeOption = (index: number) => {
    const newOptions = element.options.filter((_, i) => i !== index)
    onUpdate({ options: newOptions })
  }

  const toggleRequired = () => {
    onUpdate({ required: !element.required })
  }

  return (
    <Card
      className={`p-4 ${isActive ? 'ring-2 ring-primary' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
          {isEditing ? (
            <Input
              value={element.question}
              onChange={handleQuestionChange}
              onBlur={() => setIsEditing(false)}
              autoFocus
              className="font-semibold text-lg"
            />
          ) : (
            <h3
              className="text-lg font-semibold cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              {element.question}
            </h3>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={element.required}
            onCheckedChange={toggleRequired}
            aria-label="Tornar pergunta obrigatória"
          />
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Excluir pergunta</span>
          </Button>
        </div>
      </div>
      <Textarea
        value={element.description}
        onChange={handleDescriptionChange}
        placeholder="Adicione uma descrição (opcional)"
        className="mb-4 text-sm"
      />
      {element.type === 'text' && (
        <Input placeholder="Resposta curta" disabled />
      )}

      {element.type === 'textarea' && (
        <Textarea placeholder="Resposta longa" disabled />
      )}
      {element.type === 'radio' && (
        <RadioGroup>
          {element.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value={option} id={`radio-${element.id}-${index}`} disabled />
              <Input
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="flex-grow"
              />
              <Button size="sm" variant="ghost" onClick={() => removeOption(index)}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remover opção</span>
              </Button>
            </div>
          ))}
        </RadioGroup>
      )}
      {element.type === 'checkbox' && (
        <div className="space-y-2">
          {element.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Checkbox id={`checkbox-${element.id}-${index}`} disabled />
              <Input
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="flex-grow"
              />
              <Button size="sm" variant="ghost" onClick={() => removeOption(index)}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remover opção</span>
              </Button>
            </div>
          ))}
        </div>
      )}
      {(element.type === 'radio' || element.type === 'checkbox') && (
        <Button onClick={addOption} className="mt-2">
          Adicionar opção
        </Button>
      )}
    </Card>
  )
}

