"use server";

import { db } from "@db/index";
import { appointmentsTable } from "@db/schema";
import { protectedActionClient } from "@lib/next-safe-action";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const deleteAppointment = protectedActionClient
  .schema(
    z.object({
      id: z.string().uuid(),
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    const appointment = await db.query.appointmentsTable.findFirst({
      where: eq(appointmentsTable.id, parsedInput.id),
    });

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (appointment.clinicId !== ctx.user.clinic?.id) {
      throw new Error("Unauthorized");
    }

    await db
      .delete(appointmentsTable)
      .where(eq(appointmentsTable.id, parsedInput.id));

    revalidatePath("/appointments");
  });
