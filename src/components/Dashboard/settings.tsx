import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { updateDefaultFormSettings } from "@/services/endpoint/form";
import { Label } from "../ui/label";
import Modal from "../ui/modal-password";

// const Modal = ({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) => {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
//         <h2 className="text-lg font-bold mb-4">{title}</h2>
//         {children}
//         <div className="mt-4 text-right">
//           <Button onClick={onClose} variant="outline">
//             Cancelar
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

const formSchema = z.object({
  workspaceName: z.string().min(2, {
    message: "O nome do espaço de trabalho deve ter pelo menos 2 caracteres.",
  }),
  language: z.string(),
  emailNotifications: z.boolean(),
  defaultPrivacy: z.string(),
  password: z.string().optional(),
});

export default function Settings() {
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [password, setPassword] = useState("");

  const storedPrivacy = localStorage.getItem("defaultPrivacy") || "public";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workspaceName: "Meu Espaço de Trabalho",
      language: "pt-BR",
      emailNotifications: true,
      defaultPrivacy: storedPrivacy,
      password: "",
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      const defaultPrivacy = value.defaultPrivacy || "";
      localStorage.setItem("defaultPrivacy", defaultPrivacy);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [form]);

  const handleModalClose = () => {
    form.setValue("defaultPrivacy", "public");
    form.setValue("password", "");
    setModalOpen(false);
  };

  const handlePrivacyChange = (value: string) => {
    if (value === "password") {
      setModalOpen(true);
    } else {
      form.setValue("defaultPrivacy", value);
      form.setValue("password", "");
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const standard = form.watch("defaultPrivacy");
      const { password } = values;
      console.log(password)
      console.log(values.password)
      console.log("Payload enviado:", { defaultPrivacy: standard, password });

      await updateDefaultFormSettings(standard, values.password || "");
      console.log("Configurações atualizadas com sucesso:", values);
      alert("Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      alert("Erro ao salvar as configurações. Tente novamente.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="workspaceName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Espaço de Trabalho</FormLabel>
              <FormControl>
                <Input placeholder="Meu Espaço de Trabalho" {...field} />
              </FormControl>
              <FormDescription>
                Este é o nome que aparecerá em seus formulários.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Idioma</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um idioma" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es-ES">Español</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Idioma padrão para seus formulários.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="emailNotifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Notificações por Email</FormLabel>
                <FormDescription>
                  Receba notificações quando houver novas respostas.
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="defaultPrivacy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Privacidade Padrão dos Formulários</FormLabel>
              <Select
                onValueChange={(value: string) => {
                  handlePrivacyChange(value);
                  field.onChange(value);
                }}
                value={form.watch("defaultPrivacy")}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a privacidade padrão" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="public">Público</SelectItem>
                  <SelectItem value="private">Privado</SelectItem>
                  <SelectItem value="password">Protegido por Senha</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Configuração de privacidade padrão para novos formulários.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Salvar Alterações</Button>
      </form>
      {isModalOpen && (
        <Modal title="Definir Senha" onClose={handleModalClose}>
          <p>Digite a senha para proteger o formulário:</p>
          
          <div className="space-y-2 w-full">

            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Insira a senha do seu formulário aqui"
              className="w-full text-white"
              value={form.watch("password")}
            onChange={(e) => form.setValue("password", e.target.value)}
            />
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <Button className="bg-green-600"
              onClick={() => {
                setModalOpen(false);
              }}
            >
              Salvar
            </Button>

            <Button onClick={() => setModalOpen(false)} variant="outline" className="bg-red-600 hover:bg-red-900 text-white">
            Cancelar
          </Button>
          </div>
        </Modal>
      )}
    </Form>
  );
}
