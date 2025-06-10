"use client";

import { Button } from "@components/ui/button";
import { Dialog, DialogTrigger } from "@components/ui/dialog";
import { appointmentsTable, doctorsTable, patientsTable } from "@db/schema";
import { Plus } from "lucide-react";
import { useState } from "react";

import { AddAppointmentForm } from "./add-appointment-form";

interface IAddAppointmentButtonProps {
  patients: (typeof patientsTable.$inferSelect)[];
  doctors: (typeof doctorsTable.$inferSelect)[];
  appointment?: typeof appointmentsTable.$inferSelect;
}

export function AddAppointmentButton({
  patients,
  doctors,
  appointment,
}: IAddAppointmentButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 size-4" />
          Adicionar agendamento
        </Button>
      </DialogTrigger>
      <AddAppointmentForm
        isOpen={isOpen}
        onSuccess={() => setIsOpen(false)}
        appointment={appointment}
        patients={patients}
        doctors={doctors}
      />
    </Dialog>
  );
}
