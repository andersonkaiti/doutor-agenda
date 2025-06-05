"use client";

import { Avatar, AvatarFallback } from "@components/ui/avatar";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@components/ui/card";
import { Dialog, DialogTrigger } from "@components/ui/dialog";
import { Separator } from "@components/ui/separator";
import { doctorsTable } from "@db/schema";
import { formatCurrencyInCents } from "@helpers/currency";
import { CalendarIcon, ClockIcon, DollarSignIcon } from "lucide-react";

import { getAvailabilty } from "../_helpers/availability";
import { UpsertDoctorForm } from "./upsert-doctor-form";

interface IDoctorCardProps {
  doctor: typeof doctorsTable.$inferSelect;
}

export function DoctorCard({ doctor }: IDoctorCardProps) {
  const doctorInitials = doctor.name
    .split(" ")
    .map((name) => name[0])
    .join("");

  const availability = getAvailabilty(doctor);

  return (
    <Card className="px-6 py-5">
      <CardHeader className="px-0">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>{doctorInitials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-medium">{doctor.name}</h3>
            <p className="text-muted-foreground text-sm">{doctor.speciality}</p>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-2 px-0">
        <Badge variant="secondary" className="rounded-full px-2 py-1">
          <CalendarIcon className="mr-1" />
          {availability.from.format("dddd")} a {availability.to.format("dddd")}
        </Badge>
        <Badge variant="secondary" className="rounded-full px-2 py-1">
          <ClockIcon className="mr-1" />
          {availability.from.format("HH:mm")} às{" "}
          {availability.to.format("HH:mm")}
        </Badge>
        <Badge variant="secondary" className="rounded-full px-2 py-1">
          <DollarSignIcon className="mr-1" />
          {formatCurrencyInCents(doctor.appointmentPriceInCents)}
        </Badge>
      </CardContent>
      <Separator />
      <CardFooter className="px-0">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">Ver detalhes</Button>
          </DialogTrigger>
          <UpsertDoctorForm />
        </Dialog>
      </CardFooter>
    </Card>
  );
}
