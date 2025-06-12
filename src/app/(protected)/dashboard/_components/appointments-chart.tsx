"use client";

import "dayjs/locale/pt-br";

import { formatCurrencyInCents } from "@helpers/currency";
import dayjs from "dayjs";
import { DollarSignIcon } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

dayjs.locale("pt-br");

interface IAppointmentsChartProps {
  dailyAppointmentsData: {
    date: string;
    appointments: number;
    revenue: number;
  }[];
}

export function AppointmentsChart({
  dailyAppointmentsData,
}: IAppointmentsChartProps) {
  const chartDays = Array.from({ length: 21 }).map((_, index) =>
    dayjs()
      .subtract(10 - index, "days")
      .format("YYYY-MM-DD"),
  );

  const chartData = chartDays.map((day) => {
    const dailyAppointments = dailyAppointmentsData.find(
      (item) => item.date === day,
    );

    return {
      date: dayjs(day).format("DD/MM"),
      fullDate: day,
      appointments: dailyAppointments?.appointments || 0,
      revenue: dailyAppointments?.revenue || 0,
    };
  });

  const chartConfig = {
    revenue: {
      label: "Faturamento",
      color: "#0B68F7",
    },
    appointments: {
      label: "Agendamentos",
      color: "#10B981",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSignIcon />
          Agendamentos e faturamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 30,
              right: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatCurrencyInCents(value)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    if (name === "revenue") {
                      return (
                        <>
                          <div className="size-3 rounded bg-[#10B981]" />
                          <span className="text-muted-foreground">
                            Faturamento:
                          </span>
                          <span className="font-semibold">
                            {formatCurrencyInCents(Number(value))}
                          </span>
                        </>
                      );
                    }

                    return (
                      <>
                        <div className="size-3 rounded bg-[#0B68F7]" />
                        <span className="text-muted-foreground">
                          Agendamentos:
                        </span>
                        <span className="font-semibold">{value}</span>
                      </>
                    );
                  }}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return dayjs(payload[0].payload?.fullDate).format(
                        "DD/MM/YYYY (dddd)",
                      );
                    }

                    return label;
                  }}
                />
              }
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="appointments"
              stroke="var(--color-appointments)"
              fill="var(--color-appointments)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-revenue)"
              fill="var(--color-revenue)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
