"use client";

import { Button } from "@components/ui/button";
import { Dialog, DialogTrigger } from "@components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";

import { UpsertDoctorForm } from "./upsert-doctor-form";

export function AddDoctorButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Adicionar médico
        </Button>
      </DialogTrigger>
      <UpsertDoctorForm isOpen={isOpen} onSuccess={() => setIsOpen(false)} />
    </Dialog>
  );
}
