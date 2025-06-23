"use server";

import { db } from "@db/index";
import { patientsTable } from "@db/schema";
import { protectedWithClinicActionClient } from "@lib/next-safe-action";
import { revalidatePath } from "next/cache";

import { patientFormSchema } from "./schema";

export const upsertPatient = protectedWithClinicActionClient
  .schema(patientFormSchema)
  .action(async ({ parsedInput, ctx }) => {
    await db
      .insert(patientsTable)
      .values({
        ...parsedInput,
        id: parsedInput.id,
        clinicId: ctx.user.clinic.id,
      })
      .onConflictDoUpdate({
        target: [patientsTable.id],
        set: {
          ...parsedInput,
        },
      });

    revalidatePath("/patients");
  });
