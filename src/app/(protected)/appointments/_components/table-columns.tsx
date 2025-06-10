"use client";

import { appointmentsTable } from "@db/schema";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { AppointmentsTableActions } from "./table-actions";

type Appointment = typeof appointmentsTable.$inferSelect & {
  patient: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    sex: "male" | "female";
  };
  doctor: {
    id: string;
    name: string;
    speciality: string;
  };
};

export const appointmentsTableColumns: ColumnDef<Appointment>[] = [
  {
    id: "patientName",
    accessorKey: "patient.name",
    header: "Paciente",
    cell: ({ row: { original: appointment } }) => {
      console.log(appointment);

      return appointment.patient.name;
    },
  },
  {
    id: "doctorName",
    accessorKey: "doctor.name",
    header: "Médico",
    cell: ({ row: { original: appointment } }) => {
      return appointment.doctor.name;
    },
  },
  {
    id: "date",
    accessorKey: "date",
    header: "Data e Hora",
    cell: ({ row: { original: appointment } }) => {
      return format(appointment.date, "dd/MM/yyyy 'às' HH:mm", {
        locale: ptBR,
      });
    },
  },
  {
    id: "speciality",
    accessorKey: "doctor.speciality",
    header: "Especialidade",
    cell: ({ row: { original: appointment } }) => {
      return appointment.doctor.speciality;
    },
  },
  {
    id: "price",
    accessorKey: "appointmentPriceInCents",
    header: "Valor",
    cell: ({ row: { original: appointment } }) => {
      const price = appointment.appointmentPriceInCents / 100;

      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(price);
    },
  },
  {
    id: "actions",
    cell: ({ row: { original } }) => (
      <AppointmentsTableActions appointment={original} />
    ),
  },
];
