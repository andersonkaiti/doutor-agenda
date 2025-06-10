"use client";

import { Button } from "@components/ui/button";
import { Dialog, DialogTrigger } from "@components/ui/dialog";
import { doctorsTable, patientsTable } from "@db/schema";
import { Plus } from "lucide-react";
import { useState } from "react";

import { UpsertAppointmentForm } from "./upsert-appointment-form";

interface IAddAppointmentButtonProps {
  patients: (typeof patientsTable.$inferSelect)[];
  doctors: (typeof doctorsTable.$inferSelect)[];
}

export function AddAppointmentButton({
  patients,
  doctors,
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
      <UpsertAppointmentForm
        isOpen={isOpen}
        onSuccess={() => setIsOpen(false)}
        patients={patients}
        doctors={doctors}
      />
    </Dialog>
  );
}
