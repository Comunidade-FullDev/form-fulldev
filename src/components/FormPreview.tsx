"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import type { FormResponse } from "@/types/Form"
import { getPublicForm, submitAnswers } from "@/services/endpoint/form"
import LoginModal from "./ModaLogin"
import Cookies from "js-cookie";
import ModalPassword from "./../components/ui/modal-password"
import Image from "next/image";
import spinnerloading from "./../../public/isloading.svg";


interface Question {
  id: string;
  type: string;
  title: string;
  questionDescription: string;
  required: boolean;
  placeholder: string;
  options?: string[];
  min?: number;
  max?: number;
}

interface AnswerDTO {
  questionId: number;
  response: string;
}

export default function FormPreview() {
  const [isLoading, setIsLoading] = useState(false);
  const [params, setParams] = useState<URLSearchParams | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<FormResponse>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null); 
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("");
  const question = questions[currentQuestion];
  const [idPublic, setIdPublic] = useState("")
  const totalQuestions = questions.length;
  const [messagePassword, setMessagePassword] = useState("");


  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      setParams(urlParams);

      const formId = urlParams.get("form") || "";
      const formLogin = urlParams.get("logintype");
      setIdPublic(formId);

      const valueLoginType = formLogin?.split('?')[0];
      setLoginType(valueLoginType || "");

      if (valueLoginType === "private") {
        if (!Cookies.get("token")) {
          setShowLoginModal(true);
        }
        else {
          fetchFormData(formId, valueLoginType || "", "");
        }
      }

      if (valueLoginType === "password") {
        localStorage.removeItem("passwordForm")

        if (!localStorage.getItem("passwordForm")) {
          setShowPasswordModal(true);
        }
      }

      if (valueLoginType === "public") {
        fetchFormData(formId, valueLoginType || "", "");
      }
    }
  }, []);

  const fetchFormData = async (id: string, formHasLoginType: string, password: string) => {
    try {
      localStorage.removeItem("passwordForm")
      setLoading(true)
      setIsLoading(true)
      const data = await getPublicForm(id, formHasLoginType, password);
      const mappedQuestions = data.questions.map((q) => ({
        id: q.id.toString(),
        type: q.type,
        title: q.title || "",
        questionDescription: q.questionDescription || "",
        required: q.required || false,
        placeholder: q.placeholder || "",
        options: q.type === 'radio' || q.type === 'checkbox' ? q.options : undefined,
      }));
      setQuestions(mappedQuestions);
    }catch (error: any) {
        if (error.response && error.response.data) {
          setError(error.response.data);
        } else {
          setError("Ocorreu um erro ao carregar formulário. Por favor, tente novamente mais tarde.");
        }
    } finally {
      setLoading(false)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (messagePassword) {
      const timer = setTimeout(() => {
        setMessagePassword("")
      }, 3000)
      return () => clearTimeout(timer);
    }
  }, [messagePassword])

  const handlePasswordSubmit = async () => {
    try {
      const response = await getPublicForm(idPublic, "password", password);
      setQuestions(
        response.questions.map((q) => ({
          id: q.id.toString(),
          type: q.type,
          title: q.title || "",
          questionDescription: q.questionDescription || "",
          required: q.required || false,
          placeholder: q.placeholder || "",
          options: q.type === "radio" || q.type === "checkbox" ? q.options : undefined,
        }))
      )
      setShowPasswordModal(false)
      localStorage.setItem("passwordForm", password)
    } catch (err) {
      setShowPasswordModal(true)
      setMessagePassword("Senha inválida. Por favor, tente novamente.")
    } finally {
      setLoading(false)
    }

  }


  const handleSubmit = async () => {
    const params = new URLSearchParams(window.location.search)
    const formId = params.get("form")
    if (!formId) {
      alert("Formulário não encontrado!")
      return;
    }

    const answers: AnswerDTO[] = Object.entries(responses).map(([questionId, response]) => ({
      questionId: parseInt(questionId, 10),
      response: Array.isArray(response) ? response.join(", ") : String(response),
    }))

    try {
      setIsLoading(true)
      await submitAnswers(formId, answers)
      setSubmitted(true)
    } catch (error: any) {
        if (error.response && error.response.data) {
          setSubmitError(error.response.data);
        } else {
          setSubmitError("Ocorreu um problema ao enviar suas respostas. Por favor, tente novamente mais tarde.");
        }
    }finally {
      setIsLoading(false)
  }
  };

  const handleNext = useCallback(() => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((curr) => curr + 1)
    } else {
      setSubmitted(true);
    }
  }, [currentQuestion, totalQuestions])

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((curr) => curr - 1)
    }
  }

  const updateResponse = (questionId: string, value: string | string[] | number) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const isQuestionValid = (question: Question) => {
    if (!question.required) return true
    const response = responses[question.id]
    if (Array.isArray(response)) return response.length > 0;
    return response !== undefined && response !== ""
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && isQuestionValid(question)) {
        handleNext()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown);


  }, [handleNext, question, isQuestionValid])


  if (loginType === "private" && !Cookies.get("token")) {
    return <>
      {showLoginModal && <LoginModal />}
    </>
  }

  if (error) {
    return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        {...({ className: "min-h-screen bg-background flex items-center justify-center p-4" } as HTMLMotionProps<'div'>)}
      >
        <div className="text-center space-y-4 w-96">
          <h2 className="text-2xl font-bold text-red-600">Ocorreu um erro!</h2>
          <p className="text-muted-foreground">{error}</p>
          
        </div>
      </motion.div>
    );
  }
  
  if (loginType === "password" && !localStorage.getItem("passwordForm")) {
    return (
      <>
        {showPasswordModal && (
          <ModalPassword title="Entrar com a senha">
            <p>Digite a senha para acessar o formulário:</p>
            <div className="space-y-2 w-full">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Insira a senha do formulário aqui"
                className="w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p className="text-red-600">{error}</p>}
            </div>
            {messagePassword && <p className="text-red-500 text-center">{messagePassword}</p>}

            <div className="mt-4 flex justify-end space-x-2">
              <Button
                className="bg-green-600"
                onClick={handlePasswordSubmit}
              >
                Responder Formulário
              </Button>
            </div>
          </ModalPassword>
        )}
      </>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <Image
          src={spinnerloading}
          alt="Carregando"
          className="animate-spin h-12 w-12 mb-4"
        />
        <p className="text-lg text-gray-300">Carregando perguntas...</p>
      </div>
    )
  }
  
  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case "text":
      case "email":
        return (
          <Input
            type={question.type}
            className="max-w-xl mx-auto text-lg"
            placeholder={question.placeholder}
            value={(responses[question.id] as string) || ""}
            onChange={(e) => updateResponse(question.id, e.target.value)}
          />
        );
      case "textarea":
        return (
          <Textarea
            className="max-w-xl mx-auto text-lg min-h-[150px]"
            placeholder={question.placeholder}
            value={(responses[question.id] as string) || ""}
            onChange={(e) => updateResponse(question.id, e.target.value)}
          />
        );
      case "radio":
        return (
          <RadioGroup
            className="max-w-xl mx-auto space-y-4"
            value={(responses[question.id] as string) || ""}
            onValueChange={(value: string | number | string[]) => updateResponse(question.id, value)}
          >
            {question.options?.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                {...({ className: "flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent transition-colors" } as HTMLMotionProps<'div'>)}
              >
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </motion.div>
            ))}
          </RadioGroup>
        );
      case "checkbox":
        return (
          <div className="max-w-xl mx-auto space-y-4">
            {question.options?.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                {...({ className: "flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent transition-colors" } as HTMLMotionProps<'div'>)}
              >
                <Checkbox
                  id={option}
                  checked={((responses[question.id] as string[]) || []).includes(option)}
                  onCheckedChange={(checked: any) => {
                    const currentValues = (responses[question.id] as string[]) || [];
                    const newValues = checked
                      ? [...currentValues, option]
                      : currentValues.filter((id) => id !== option);
                    updateResponse(question.id, newValues);
                  }}
                />
                <Label htmlFor={option} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </motion.div>
            ))}
          </div>
        )

      case "number":
        return (
          <Input
            type="number"
            className="max-w-xl mx-auto text-lg"
            placeholder={question.placeholder}
            value={(responses[question.id] as number) || ""}
            onChange={(e) => updateResponse(question.id, parseInt(e.target.value, 10))}
            min={question.min}
            max={question.max}
          />
        );
      default:
        return null;
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        {...({ className: "min-h-screen bg-background flex items-center justify-center p-4" } as HTMLMotionProps<'div'>)}
      >
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Obrigado por responder!</h2>
          <p className="text-muted-foreground">Suas respostas foram registradas.</p>
          <Button onClick={() => {
            setSubmitted(false);
            setCurrentQuestion(0);
            setResponses({});
          }}>
            Responder novamente
          </Button>
        </div>
      </motion.div>
    );
  }

  if (submitError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        {...({ className: "min-h-screen bg-background flex items-center justify-center p-4" } as HTMLMotionProps<'div'>)}
      >
        <div className="text-center space-y-4 w-96">
          <h2 className="text-2xl font-bold text-red-600">Erro ao enviar respostas</h2>
          <p className="text-muted-foreground">{submitError}</p>
          <Button
            variant="default"
            onClick={() => {
              setSubmitError(null);
              setIsLoading(false);
            }}
          >
            Tentar novamente
          </Button>
        </div>
      </motion.div>
    );
  }
  

  return (
    <>
      <div className="min-h-screen bg-background flex flex-col">
        <Progress value={((currentQuestion + 1) / totalQuestions) * 100} className="w-full" />

        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              {...({ className: "w-full max-w-4xl space-y-8" } as HTMLMotionProps<'div'>)}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
                {question.title}
                {question.required === true && (
                  <span className="text-red-500"> * </span>
                )}
              </h1>
              {question.questionDescription && (
                <p className="text-center text-muted-foreground mb-8">
                  {question.questionDescription}
                </p>
              )}
              {renderQuestion(question)}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="p-4 md:p-8 border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentQuestion + 1} de {totalQuestions}
            </span>
            <Button
              onClick={currentQuestion === totalQuestions - 1 ? handleSubmit : handleNext}
              disabled={!isQuestionValid(question)}
            >
              {currentQuestion === totalQuestions - 1 ? isLoading ? (
                <Image src={spinnerloading} alt="Carregando" className="animate-spin h-5 w-5 mr-3" />
              ) : (
                "Enviar"
              ) : "Próxima"}
              {}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}