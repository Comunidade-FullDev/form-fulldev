'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EmailSentAlert from "@/components/Alerts/EmaillSend";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { register, RegisterDTO } from "../../services/endpoint/authService";
import { redirectToFacebookAuth, redirectToGoogleAuth } from "../../services/endpoint/otherAuthService";
import spinnerloading from "./../../../public/isloading.svg";


export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSendEmail = () => {
    setEmailSent(true); 
  };

  const handleRegisterWithEmail = async () => {
    setIsLoading(true);
      setTimeout(async () => {
        setIsLoading(false);
        try {
          const authData: RegisterDTO = { email, password };
          const response = await register(authData);
          console.log(response)
          handleSendEmail()
        } catch (error) {
          console.log("erro ao fazer login "+error)
        }
      }, 2000);
  };
  
  const handleLoginWithGoogle = async () =>{
    redirectToGoogleAuth();
  };

  const handleLoginWithFacebook = async () =>{
    redirectToFacebookAuth();
  };

  return (
    <div className="min-h-screen w-full dark flex">
      <div className="hidden lg:flex w-1/2 bg-primary items-center justify-center p-8">
        <div className="text-primary-foreground">
          <Image alt="Logo FullDev" src="/LogoWhite.svg" width={340} height={340} />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
      <Card className="w-full max-w-md mx-auto overflow-hidden rounded-lg shadow-lg">
      {emailSent && (
              <EmailSentAlert />  //fiz um modelo apenas
            )}
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
              <Input id="password" type="password" placeholder="Digite uma senha" onChange={(e) => setPassword(e.target.value)} className="w-full" />
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="confirmPassword">Confirme a senha</Label>
              <Input id="confirmPassword" type="password" placeholder="Confirme a sua senha" onChange={(e) => setConfirmPassword(e.target.value)} className="w-full" />
            </div>
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
            <div className="space-y-2">
              <Button variant="outline" className="w-full" onClick={handleLoginWithGoogle}>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Registra-se usando a conta do Google
              </Button>
              <Button variant="outline" className="w-full" onClick={handleLoginWithFacebook}>
                <svg className="mr-2 h-4 w-4" fill="#1877f2" viewBox="0 0 24 24">
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                </svg>
                Registra-se usando a conta do Facebook
              </Button>
            </div>
            <div className="text-center text-sm">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Entre agora
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
