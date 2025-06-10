import { upsertPatient } from "@actions/upsert-patient";
import { Button } from "@components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { patientsTable } from "@db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

const patientFormSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Nome é obrigatório.",
  }),
  email: z.string().trim().email("Email inválido"),
  phoneNumber: z.string().trim().min(1, {
    message: "Telefone é obrigatório.",
  }),
  sex: z.enum(["male", "female"], {
    message: "Sexo é obrigatório.",
  }),
});

interface IUpsertPatientFormProps {
  isOpen: boolean;
  patient?: typeof patientsTable.$inferSelect;
  onSuccess: () => void;
}

export function UpsertPatientForm({
  isOpen,
  patient,
  onSuccess,
}: IUpsertPatientFormProps) {
  const form = useForm<z.infer<typeof patientFormSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: patient?.name ?? "",
      email: patient?.email ?? "",
      phoneNumber: patient?.phoneNumber ?? "",
      sex: patient?.sex ?? undefined,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: patient?.name ?? "",
        email: patient?.email ?? "",
        phoneNumber: patient?.phoneNumber ?? "",
        sex: patient?.sex ?? undefined,
      });
    }
  }, [isOpen, form, patient]);

  const upsertPatientAction = useAction(upsertPatient, {
    onSuccess: () => {
      toast.success("Paciente adicionado com sucesso.");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Erro ao adicionar paciente.");
    },
  });

  function handleSubmit(values: z.infer<typeof patientFormSchema>) {
    upsertPatientAction.execute({
      ...values,
      id: patient?.id,
    });
  }

  return (
    <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Adicionar paciente</DialogTitle>
        <DialogDescription>Adicione um novo paciente.</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do paciente</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de telefone</FormLabel>
                <FormControl>
                  <PatternFormat
                    format="(##) #####-####"
                    mask="_"
                    placeholder="(11) 99999-9999"
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value.value);
                    }}
                    customInput={Input}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sexo</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Masculino</SelectItem>
                      <SelectItem value="female">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button
              type="submit"
              disabled={upsertPatientAction.isPending}
              className="w-full"
            >
              {upsertPatientAction.isPending && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
