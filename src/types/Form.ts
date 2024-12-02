export interface Form {
  id: string
  title: string
  createdAt: Date
  responsesCount: number
}

export interface FormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export interface EditFormDialogProps extends FormDialogProps {
  form: Form
}

export interface DeleteFormDialogProps extends FormDialogProps {
  form: Form
  onDelete: (id: string) => void
}

export type QuestionType = 'text' | 'textarea' | 'radio' | 'checkbox' | 'email' | 'number'

export interface Option {
id: string
text: string
}

export interface Question {
id: string
type: QuestionType
title: string
description?: string
options?: Option[]
required?: boolean
placeholder?: string
min?: number
max?: number
}

export interface FormResponse {
[questionId: string]: string | string[] | number
}
