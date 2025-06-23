"use server";

import { db } from "@db/index";
import { patientsTable } from "@db/schema";
import { protectedActionClient } from "@lib/next-safe-action";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const deletePatient = protectedActionClient
  .schema(
    z.object({
      id: z.string().uuid(),
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    const patient = await db.query.patientsTable.findFirst({
      where: eq(patientsTable.id, parsedInput.id),
    });

    if (!patient) {
      throw new Error("Paciente não encontrado");
    }

    if (patient.clinicId !== ctx.user.clinic?.id) {
      throw new Error("Paciente não encontrado");
    }

    await db.delete(patientsTable).where(eq(patientsTable.id, parsedInput.id));

    revalidatePath("/patients");
  });
