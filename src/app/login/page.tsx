'use client'
import { useState } from "react";
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
import { Eye, EyeOff } from "lucide-react"; // Importar ícones de olho

export default function LoginPage() {
  const [estaCarregando, setEstaCarregando] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [mostrarSenha, setMostrarSenha] = useState(false); // Novo estado para visibilidade da senha

  const handleLoginComEmail = async () => {
    setEstaCarregando(true);
    setTimeout(async () => {
      setEstaCarregando(false);
      try {
        const dadosAutenticacao: AuthDTO = { email, password: senha };
        await login(dadosAutenticacao);
        window.location.href = "/workspace"
      } catch (erro) {
        console.log("erro ao fazer login "+erro)
        setMensagem('Falha no login. Verifique suas credenciais.');
      }
    }, 2000);
  };

  const handleLoginComGoogle = async () =>{
    redirectToGoogleAuth();
  };

  const handleLoginComFacebook = async () =>{
    redirectToFacebookAuth();
  };

  const alternarVisibilidadeSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  return (
    <div className="min-h-screen w-full flex dark flex-col lg:flex-row">
      <div className="lg:w-1/2 bg-primary items-center justify-center p-8 hidden lg:flex">
        <Image alt="Logo FullDev" src="/LogoWhite.svg" width={340} height={340} />
      </div>

      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Bem-vindo de volta</CardTitle>
            <CardDescription>
              Entre para começar a criar seus formulários
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 w-full">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="seu@email.com" className="w-full" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2 w-full relative">
              <Label htmlFor="senha">Senha</Label>
              <div className="relative">
                <Input 
                  id="senha" 
                  type={mostrarSenha ? "text" : "password"} 
                  placeholder="Insira sua senha" 
                  className="w-full pr-10" 
                  onChange={(e) => setSenha(e.target.value)} 
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
                <Checkbox id="lembrar" />
                <label htmlFor="lembrar" className="text-sm font-medium">
                  Lembrar de mim
                </label>
              </div>
              <Link href="/recuperacao" className="text-sm font-medium text-primary hover:underline">
                Esqueci a senha
              </Link>
            </div>
            <Button className="w-full" onClick={handleLoginComEmail} disabled={estaCarregando}>
              {estaCarregando ? (
                <Image src={spinnerloading} alt="Carregando" className="animate-spin h-5 w-5 mr-3" />
              ) : (
                "Entrar"
              )}
            </Button>
            {mensagem && <p>{mensagem}</p>}
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

            <div className="space-y-2">
              <Button variant="outline" className="w-full" onClick={handleLoginComGoogle}>
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
                Entrar usando a conta do Google
              </Button>
              <Button variant="outline" className="w-full" onClick={handleLoginComFacebook}>
                <svg className="mr-2 h-4 w-4" fill="#1877f2" viewBox="0 0 24 24">
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                </svg>
                Entrar usando a conta do Facebook
              </Button>
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