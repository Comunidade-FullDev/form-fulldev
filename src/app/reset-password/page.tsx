'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { confirmPasswordReset } from '@/services/endpoint/authService';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handlePasswordReset = async () => {
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      const responseMessage = await confirmPasswordReset(token, password);
      setSuccessMessage(responseMessage);
      setError('');
      setTimeout(() => router.push('/login'), 3000);
    } catch (err) {
      setError('Erro ao redefinir a senha. Verifique o token ou tente novamente.');
    }
  };

  const handlePasswordChange = (e: { target: { id: string; value: string } }) => {
    const { id, value } = e.target;

    if (id === "password") setPassword(value);
    if (id === "confirm-password") setConfirmPassword(value);

    if (id === "password" || id === "confirm-password") {
      setPasswordMismatch(
        !!value && (id === "password" ? value !== confirmPassword : password !== value)
      );
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Redefinir sua senha</CardTitle>
        <CardDescription>Digite sua nova senha abaixo.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {successMessage ? (
          <div className="text-green-500 text-center">{successMessage}</div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="password">Nova Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua nova senha"
                value={password}
                onChange={handlePasswordChange}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirme sua Senha</Label>
              {passwordMismatch && (
                <p className="text-red-500 text-sm mt-2">As senhas estão diferentes.</p>
              )}
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirme sua nova senha"
                value={confirmPassword}
                onChange={handlePasswordChange}
                className="w-full"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Button className="w-full" onClick={handlePasswordReset}>
              Redefinir Senha
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 lg:p-8">
      <Suspense fallback={<div>Carregando...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}