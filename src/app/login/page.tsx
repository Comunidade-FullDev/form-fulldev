'use client'
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import spinnerloading from "./../../../public/isloading.svg";
import { login, AuthDTO } from "../../services/endpoint/authService";
import { redirectToFacebookAuth, redirectToGoogleAuth } from "../../services/endpoint/otherAuthService";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Cookies from "js-cookie";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);




  const handleLoginWithEmail = async () => {
    setIsLoading(true);
    try {
      const authData: AuthDTO = { email, password };
      Cookies.remove("token")
      await login(authData);
      router.push("/workspace")
    } catch (error: any) {
      if (error.response && error.response.data) {
        setMessage(error.response.data);
      } else {
        setMessage("Ocorreu um erro ao tentar logar. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
      if (message) {
        const timer = setTimeout(() => {
          setMessage("")
        }, 4000)
        return () => clearTimeout(timer);
      }
    }, [message])

  const alternarVisibilidadeSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const handleLoginWithGoogle = async () => {
    redirectToGoogleAuth();
  };

  const handleLoginWithFacebook = async () => {
    redirectToFacebookAuth();
  };

  return (
    <div className="min-h-screen w-full flex dark flex-col lg:flex-row">
      <div className="lg:w-1/2 bg-primary items-center justify-center p-8 hidden lg:flex">
        <Image alt="Logo FullDev" src="/LogoWhite.svg" width={340} height={340} />
      </div>

      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Bem vindo de volta</CardTitle>
            <CardDescription>
              Entre para começar a criar seus formulários
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 w-full">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="seu@email.com" className="w-full" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">

                <Input
                  id="password"
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Insira sua senha"
                  className="w-full" onChange={(e) => setPassword(e.target.value)}
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label htmlFor="remember" className="text-sm font-medium">
                  Lembrar de mim
                </label>
              </div>
              <Link href="/recovery" className="text-sm font-medium text-primary hover:underline">
                Esqueci a senha
              </Link>
            </div>
            <Button className="w-full" onClick={handleLoginWithEmail} disabled={isLoading}>
              {isLoading ? (
                <Image src={spinnerloading} alt="Carregando" className="animate-spin h-5 w-5 mr-3" />
              ) : (
                "Entrar"
              )}
            </Button>
            {message && <p>{message}</p>}
            <div className="relative mt-4">
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
              Não tem uma conta?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Crie agora uma
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
