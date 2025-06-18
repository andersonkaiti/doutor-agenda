import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
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
import { getDashboard } from "@data/get-dashboard";
import { auth } from "@lib/auth";
import dayjs from "dayjs";
import { Calendar } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { appointmentsTableColumns } from "../appointments/_components/table-columns";
import { AppointmentsChart } from "./_components/appointments-chart";
import { DatePicker } from "./_components/date-picker";
import { StatsCard } from "./_components/stats-card";
import { TopDoctors } from "./_components/top-doctors";
import { TopSpecialities } from "./_components/top-specialities";

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

  if (!session.user.plan) {
    redirect("/new-subscription");
  }

  const { from, to } = await searchParams;

  if (!from || !to) {
    redirect(
      `/dashboard?from=${dayjs().format("YYYY-MM-DD")}&to=${dayjs()
        .add(1, "month")
        .format("YYYY-MM-DD")}`,
    );
  }

  const {
    totalRevenue,
    totalAppointments,
    totalPatients,
    totalDoctors,
    topDoctors,
    topSpecialities,
    dailyAppointments,
    dailyAppointmentsData,
  } = await getDashboard({
    from: new Date(from),
    to: new Date(to),
    session: {
      id: session.session.id,
      token: session.session.token,
      userId: session.session.userId,
      expiresAt: session.session.expiresAt,
      createdAt: session.session.createdAt,
      updatedAt: session.session.updatedAt,
      user: {
        clinic: {
          id: session.user.clinic.id,
        },
      },
    },
  });

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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[2.25fr_1fr]">
          <AppointmentsChart dailyAppointmentsData={dailyAppointmentsData} />
          <TopDoctors doctors={topDoctors} />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[2.25fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <Calendar className="size-4" />
                  Agendamentos de hoje
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={appointmentsTableColumns}
                data={dailyAppointments}
              />
            </CardContent>
          </Card>

          <TopSpecialities topSpecialities={topSpecialities} />
        </div>
      </PageContent>
    </PageContainer>
  );
}
