import { z } from "zod";

export const upsertAppointmentSchema = z.object({
  id: z.string().optional(),
  patientId: z.string().min(1, {
    message: "Paciente é obrigatório",
  }),
  doctorId: z.string().min(1, {
    message: "Médico é obrigatório",
  }),
  appointmentPriceInCents: z.number().min(1, {
    message: "Valor da consulta é obrigatório",
  }),
  date: z.date({
    message: "Data é obrigatória",
  }),
  time: z.string().min(1, {
    message: "Horário é obrigatório",
  }),
});
