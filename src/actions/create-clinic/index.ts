"use server";

import { db } from "@db/index";
import { clinicsTable, usersToClinicsTable } from "@db/schema";
import { auth } from "@lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function createClinic(name: string) {
  // Verificar se o usuário está logado
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const [clinic] = await db.insert(clinicsTable).values({ name }).returning();

  await db.insert(usersToClinicsTable).values({
    userId: session.user.id,
    clinicId: clinic.id,
  });

  redirect("/dashboard");
}
