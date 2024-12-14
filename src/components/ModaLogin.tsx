'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { login, AuthDTO } from "../services/endpoint/authService";
import spinnerloading from "./../../public/isloading.svg";

export default function LoginModal() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState<string | null>(null);

    const handleLoginWithEmail = async () => {
        setIsLoading(true);
        try {
            const authData: AuthDTO = { email, password };
            await login(authData);
            window.location.reload()
        } catch (error) {
            console.log("Erro ao fazer login " + error);
            setMessage('Falha ao tentar fazer login. Verifique se sua senha ou email estão corretos');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={true}>
            <DialogContent
                className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
            >

                <div className="w-full max-w-lg p-6 bg-gray rounded-lg shadow-md space-y-6">

                    <Card className="space-y-5 p-4">

                        <DialogTitle className="text-2xl font-bold text-center text-gray-800">
                            Bem-vindo
                        </DialogTitle>

                        <DialogDescription className="text-sm text-gray-600 text-center mb-4">
                            Precisamos que crie uma conta temporária para que você possa responder esse formulário
                        </DialogDescription>

                        <CardContent className="space-y-9">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    className="w-full"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Senha</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Insira sua senha"
                                    className="w-full"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                           
                            <Button
                                className="w-full"
                                onClick={handleLoginWithEmail}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Image
                                        src={spinnerloading}
                                        alt="Carregando"
                                        className="animate-spin h-5 w-5 mr-2"
                                    />
                                ) : (
                                    "Entrar"
                                )}
                            </Button>
                            {message && <p className="text-red-500 text-center">{message}</p>}
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}
