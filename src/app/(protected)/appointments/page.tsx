import { DataTable } from "@components/ui/data-table";
import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@components/ui/page-container";
import { db } from "@db/index";
import { appointmentsTable, doctorsTable, patientsTable } from "@db/schema";
import { WithAuthentication } from "@hocs/with-authentication";
import { auth } from "@lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { AddAppointmentButton } from "./_components/add-appointment-button";
import { appointmentsTableColumns } from "./_components/table-columns";

export default async function AppointmentsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.clinic) return null;

  const [patients, doctors, appointments] = await Promise.all([
    db.query.patientsTable.findMany({
      where: eq(patientsTable.clinicId, session.user.clinic.id),
    }),
    db.query.doctorsTable.findMany({
      where: eq(doctorsTable.clinicId, session.user.clinic.id),
    }),
    db.query.appointmentsTable.findMany({
      where: eq(appointmentsTable.clinicId, session.user.clinic.id),
      with: {
        patient: true,
        doctor: true,
      },
    }),
  ]);

  return (
    <WithAuthentication mustHavePlan mustHaveClinic>
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <PageTitle>Agendamentos</PageTitle>
            <PageDescription>
              Gerencie os agendamentos da sua clínica
            </PageDescription>
          </PageHeaderContent>
          <AddAppointmentButton patients={patients} doctors={doctors} />
        </PageHeader>
        <PageContent>
          <DataTable data={appointments} columns={appointmentsTableColumns} />
        </PageContent>
      </PageContainer>
    </WithAuthentication>
  );
}
