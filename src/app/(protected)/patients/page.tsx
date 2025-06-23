import { DataTable } from "@components/ui/data-table";
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
import { patientsTable } from "@db/schema";
import { WithAuthentication } from "@hocs/with-authentication";
import { auth } from "@lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { AddPatientButton } from "./_components/add-patient-button";
import { patientsTableColumns } from "./_components/table-columns";

export default async function PatientsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.clinic) return null;

  const patients = await db.query.patientsTable.findMany({
    where: eq(patientsTable.clinicId, session.user.clinic.id),
  });

  return (
    <WithAuthentication mustHavePlan mustHaveClinic>
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <PageTitle>Pacientes</PageTitle>
            <PageDescription>
              Gerencie os pacientes de sua clínica
            </PageDescription>
          </PageHeaderContent>
          <PageActions>
            <AddPatientButton />
          </PageActions>
        </PageHeader>
        <PageContent>
          <DataTable data={patients} columns={patientsTableColumns} />
        </PageContent>
      </PageContainer>
    </WithAuthentication>
  );
}
