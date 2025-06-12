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
import { appointmentsTable, doctorsTable, patientsTable } from "@db/schema";
import { auth } from "@lib/auth";
import dayjs from "dayjs";
import { and, count, eq, gte, lte, sum } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { DatePicker } from "./_components/date-picker";
import { StatsCard } from "./_components/stats-card";

interface IDashboardPageProps {
  searchParams: Promise<{
    from: string;
    to: string;
  }>;
}

export default async function DashboardPage({
  searchParams,
}: IDashboardPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  if (!session.user.clinic) {
    redirect("/clinic-form");
  }

  const { from, to } = await searchParams;

  if (!from || !to) {
    redirect(
      `/dashboard?from=${dayjs().format("YYYY-MM-DD")}&to=${dayjs()
        .add(1, "month")
        .format("YYYY-MM-DD")}`,
    );
  }

  const [[totalRevenue, totalAppointments, totalPatients, totalDoctors]] =
    await Promise.all([
      db
        .select({
          total: sum(appointmentsTable.appointmentPriceInCents),
        })
        .from(appointmentsTable)
        .where(
          and(
            eq(appointmentsTable.clinicId, session.user.clinic.id),
            gte(appointmentsTable.date, new Date(from)),
            lte(appointmentsTable.date, new Date(to)),
          ),
        ),

      db
        .select({
          total: count(),
        })
        .from(appointmentsTable)
        .where(
          and(
            eq(appointmentsTable.clinicId, session.user.clinic.id),
            gte(appointmentsTable.date, new Date(from)),
            lte(appointmentsTable.date, new Date(to)),
          ),
        ),

      db
        .select({
          total: count(),
        })
        .from(patientsTable)
        .where(eq(patientsTable.clinicId, session.user.clinic.id)),

      db
        .select({
          total: count(),
        })
        .from(doctorsTable)
        .where(eq(doctorsTable.clinicId, session.user.clinic.id)),
    ]);

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Dashboard</PageTitle>
          <PageDescription>
            Tenha uma visão geral de sua clínica.
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <DatePicker />
        </PageActions>
      </PageHeader>
      <PageContent>
        <StatsCard
          totalRevenue={totalRevenue ? Number(totalRevenue.total) : 0}
          totalAppointments={
            totalAppointments ? Number(totalAppointments.total) : 0
          }
          totalPatients={totalPatients ? Number(totalPatients.total) : 0}
          totalDoctors={totalDoctors ? Number(totalDoctors.total) : 0}
        />
      </PageContent>
    </PageContainer>
  );
}
