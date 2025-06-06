import { z } from "zod";

export const patientFormSchema = z.object({
  id: z.string().uuid().optional(),
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

export type UpsertPatientFormSchema = z.infer<typeof patientFormSchema>;
