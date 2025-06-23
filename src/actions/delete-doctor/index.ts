"use server";

import { db } from "@db/index";
import { doctorsTable } from "@db/schema";
import { protectedActionClient } from "@lib/next-safe-action";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const deleteDoctor = protectedActionClient
  .schema(
    z.object({
      id: z.string().uuid(),
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    const doctor = await db.query.doctorsTable.findFirst({
      where: eq(doctorsTable.id, parsedInput.id),
    });

    if (doctor?.clinicId !== ctx.user.clinic?.id) {
      throw new Error("Médico não encontrado");
    }

    await db.delete(doctorsTable).where(eq(doctorsTable.id, parsedInput.id));

    revalidatePath("/doctors");
  });
