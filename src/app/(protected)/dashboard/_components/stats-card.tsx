import { Badge } from "@components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { formatCurrencyInCents } from "@helpers/currency";
import {
  CalendarIcon,
  DollarSignIcon,
  Stethoscope,
  UserIcon,
} from "lucide-react";

export interface StatsCardProps {
  totalRevenue: number;
  totalAppointments: number;
  totalPatients: number;
  totalDoctors: number;
}

export function StatsCard({
  totalRevenue,
  totalAppointments,
  totalPatients,
  totalDoctors,
}: StatsCardProps) {
  const stats = [
    {
      title: "Faturamento",
      value: totalRevenue
        ? formatCurrencyInCents(totalRevenue)
        : formatCurrencyInCents(0),
      icon: DollarSignIcon,
    },
    {
      title: "Agendamentos",
      value: totalAppointments,
      icon: CalendarIcon,
    },
    {
      title: "Pacientes",
      value: totalPatients,
      icon: UserIcon,
    },
    {
      title: "Médicos",
      value: totalDoctors,
      icon: Stethoscope,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="gap-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary rounded-full p-2.5">
                <stat.icon className="size-4" />
              </Badge>
              <span className="text-sm font-medium text-gray-500">
                {stat.title}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{stat.value}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
