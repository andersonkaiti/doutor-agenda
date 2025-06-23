"use server";

import { getAvailableTimes } from "@actions/get-available-times";
import { db } from "@db/index";
import { appointmentsTable } from "@db/schema";
import { protectedWithClinicActionClient } from "@lib/next-safe-action";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";

import { addAppointmentSchema } from "./schema";

export const addAppointment = protectedWithClinicActionClient
  .schema(addAppointmentSchema)
  .action(async ({ parsedInput, ctx }) => {
    if (!ctx.user.clinic?.id) {
      throw new Error("Clinic not found");
    }

    const availableTimes = await getAvailableTimes({
      doctorId: parsedInput.doctorId,
      date: dayjs(parsedInput.date).format("YYYY-MM-DD"),
    });

    if (!availableTimes) {
      throw new Error("No available times");
    }

    const isTimeAvailable = availableTimes?.data?.some(
      (time) => time.value === parsedInput.time && time.available,
    );

    if (!isTimeAvailable) {
      throw new Error("Time not available");
    }

    const appointmentDateTime = dayjs(parsedInput.date)
      .set("hour", parseInt(parsedInput.time.split(":")[0]))
      .set("minute", parseInt(parsedInput.time.split(":")[1]))
      .toDate();

    await db
      .insert(appointmentsTable)
      .values({
        ...parsedInput,
        clinicId: ctx.user.clinic.id,
        date: appointmentDateTime,
      })
      .onConflictDoUpdate({
        target: [appointmentsTable.id],
        set: {
          ...parsedInput,
          date: appointmentDateTime,
        },
      });

    revalidatePath("/appointments");
    revalidatePath("/dashboard");
  });
