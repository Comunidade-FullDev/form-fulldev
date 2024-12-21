interface InfoQuestionDTO {
  title: string;
  type: string;
  questionDescription: string;
}

export interface Form {
  id: string
  title: string
  createdAt: Date
  responsesCount: number
  idPublic: string
  link: string
  description: string
  questions: QuestionDTO[]
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
title: string
}

export interface Question {
id: string
type: string
title: string
questionDescription?: string
options?: string[]
required?: boolean
placeholder?: string
min?: number
max?: number
}

export interface FormResponse {
[questionId: string]: string | string[] | number
}

export interface FormElement {
  id: number;
  type: 'text' | 'textarea' | 'radio' | 'checkbox';
  question: string;
  options: string[];
  required: boolean;
  questionDescription: string;
}

export interface FormPage {
  id: number;
  elements: FormElement[];
}

export interface FormWorkspace {
  id: string;
  title: string;
  idPublic: string;
  createdAt: Date;
  responsesCount: number;
  link: string;
  views: number;
}
export interface Option {
  id: string
  title: string
  }

export interface CreateForm {
  id: string;
  idPublic: string
  title: string;
  description: string;
  link: string;
  createdAt: Date;
  createdBy: string;
  responsesCount: number;
  isPublished: boolean;
  questions: Array<{
    id: number;
    title: string;
    type: string;
    questionDescription: string;
    required: boolean;
    placeholder: string;
    options?: string[]; 
  }>;
}
export interface QuestionDTO {
  title: string;
  type: string;
  questionDescription: string;
  required: boolean;
  placeholder: string;
  options?: string[];
}

export interface FormDTO {
  title: string;
  description: string;
  questions: QuestionDTO[];
}

export interface AnswerDTO {
  questionId: number;
  response: string;
}

export interface AnswerGraphDTO {
  id: number; 
  answeredBy: string | null;
  answers: {
    [questionId: number]: string | string[] | number;
  };
}

export interface FormGraph{
  id: string;
  title: string;
  description: string;
  responsesCount: number;
  createdAt: Date;
  createdBy: string;
  isPublished: boolean;
  questions: Array<{
    id: number;
    title: string;
    type: string;
    questionDescription: string;
    required: boolean;
    placeholder: string;
    options?: string[]; 
    responses: AnswerGraphDTO[];
  }>;
}

export interface FormElementProps {
  element: {
    id: number;
    type: 'text' | 'textarea' | 'radio' | 'checkbox'; 
    question: string;
    options: string[];
    required: boolean;
    questionDescription: string;
  };
  isActive: boolean;
  onClick: () => void;
  onUpdate: (updates: Partial<FormElementProps['element']>) => void;
  onDelete: () => void;
}