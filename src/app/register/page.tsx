'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SuccessAlert } from "@/components/Alerts/EmaillSend";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { register, RegisterDTO } from "../../services/endpoint/authService";
import { redirectToFacebookAuth, redirectToGoogleAuth } from "../../services/endpoint/otherAuthService";
import spinnerloading from "./../../../public/isloading.svg";
import { Eye, EyeOff } from "lucide-react";
import Cookies from "js-cookie";



export default function Register() {
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null)
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleCloseAlert = () => {

    setIsAlertOpen(false);
  };

  setTimeout(() => {
    setApiError("");
  }, 8000);

  const handleRegisterWithEmail = async () => {
    if (passwordMismatch) {
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      const authData: RegisterDTO = { email, password };
      Cookies.remove("token")
      await register(authData);
      setIsAlertOpen(true);
    } catch (error: any) {
      if (error.response && error.response.data) {
        setApiError(error.response.data);
      } else {
        setApiError("Ocorreu um erro ao registrar. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };


  const handleLoginWithGoogle = async () => {
    redirectToGoogleAuth();
  };

  const handleLoginWithFacebook = async () => {
    redirectToFacebookAuth();
  };
  const handlePasswordChange = (e: { target: { id: any; value: any; }; }) => {
    const { id, value } = e.target;

    if (id === "password") setPassword(value);
    if (id === "confirmPassword") setConfirmPassword(value);
    if (id === "password" || id === "confirmPassword") {
      setPasswordMismatch(value && (id === "password" ? value !== confirmPassword : password !== value));
    }
  }

  const alternarVisibilidadeSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  return (

    <div className="min-h-screen w-full dark flex">
      <div className="hidden lg:flex w-1/2 bg-primary items-center justify-center p-8">
        <div className="text-primary-foreground">
          <Image alt="Logo FullDev" src="/LogoWhite.svg" width={340} height={340} />
        </div>
      </div>
      <div>
      </div>
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <Card className="w-full max-w-md mx-auto overflow-hidden rounded-lg shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Criar uma nova conta</CardTitle>
            <CardDescription>
              Registre-se para continuar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 w-full">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Digite um email" onChange={(e) => setEmail(e.target.value)} className="w-full" />
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Insira sua senha"
                  className="w-full pr-10"
                  onChange={handlePasswordChange}
                />
                <button
                  type="button"
                  onClick={alternarVisibilidadeSenha}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                >
                  {mostrarSenha ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="confirmPassword">Confirme a senha</Label>
              {passwordMismatch && (
                <p className="text-red-500 text-sm mt-2">As senhas estão diferentes.</p>
              )}
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Confirme a sua senha"
                  onChange={handlePasswordChange}
                  className="w-full" />
                <button
                  type="button"
                  onClick={alternarVisibilidadeSenha}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                >
                  {mostrarSenha ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            {apiError && (
              <p className="text-red-500 text-sm text-center mt-2">{apiError}</p>
            )}
            <Button className="w-full" onClick={handleRegisterWithEmail} disabled={isLoading}>
              {isLoading ? (
                <Image src={spinnerloading} alt="Carregando" className="animate-spin h-5 w-5 mr-3" />
              ) : (
                "Criar minha conta"
              )}
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Ou
                </span>
              </div>
            </div>
            <div className="text-center text-sm">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Entre agora
              </Link>
            </div>
          </CardContent>
        </Card>
        <SuccessAlert
          isOpen={isAlertOpen}
          onClose={handleCloseAlert}
          userEmail={email}
        />
      </div>

    </div>

  );
}
