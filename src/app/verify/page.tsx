'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "./../../../public/LogoWhite.svg";
import { verifyUser } from "@/services/endpoint/authService";

export default function EmailVerification() {
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(10);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setToken(params.get("token"));
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const verifyUserEmail = async (token: string) => {
      try {
        await verifyUser(token);
        setVerificationStatus("success");
      } catch (error) {
        console.error("Erro ao verificar o e-mail:", error);
        setVerificationStatus("error");
      }
    };

    verifyUserEmail(token);
  }, [token]);

  useEffect(() => {
    if (verificationStatus === "success") {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            router.push("/login");
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [verificationStatus, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md mx-auto text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {verificationStatus === "success"
              ? "Email verificado com sucesso!"
              : verificationStatus === "error"
              ? "Erro na verificação"
              : "Verificando..."}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {verificationStatus === "success" && (
            <>
              <CardDescription>
                Sua conta foi verificada com sucesso. Você será redirecionado para a página de login em {countdown} segundos.
              </CardDescription>
              <Image
                alt="Success"
                src={logo}
                width={120}
                height={120}
                className="mx-auto"
              />
            </>
          )}
          {verificationStatus === "error" && (
            <CardDescription>
              Não foi possível verificar seu e-mail. Verifique o link enviado ou tente novamente mais tarde.
            </CardDescription>
          )}
          {verificationStatus === null && (
            <CardDescription>
              Aguarde enquanto verificamos seu e-mail...
            </CardDescription>
          )}
          <Button
            className="w-full"
            onClick={() => router.push(verificationStatus === "success" ? "/login" : "/")}
          >
            {verificationStatus === "success" ? "Ir para Login" : "Voltar para Home"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}