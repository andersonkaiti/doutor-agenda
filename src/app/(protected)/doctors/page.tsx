import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@components/ui/page-container";
import { db } from "@db/index";
import { doctorsTable } from "@db/schema";
import { WithAuthentication } from "@hocs/with-authentication";
import { auth } from "@lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { AddDoctorButton } from "./_components/add-doctor-button";
import { DoctorCard } from "./_components/doctor-card";

export default async function DoctorsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.clinic) return null;

  const doctors = await db.query.doctorsTable.findMany({
    where: eq(doctorsTable.clinicId, session.user.clinic.id),
  });

  return (
    <WithAuthentication mustHavePlan mustHaveClinic>
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <PageTitle>Médicos</PageTitle>
            <PageDescription>
              Gerencie os médicos de sua clínica
            </PageDescription>
          </PageHeaderContent>
          <PageActions>
            <AddDoctorButton />
          </PageActions>
        </PageHeader>
        <PageContent>
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </section>
        </PageContent>
      </PageContainer>
    </WithAuthentication>
  );
}
