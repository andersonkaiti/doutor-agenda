import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Progress } from "@components/ui/progress";
import {
  Activity,
  Baby,
  Bone,
  Brain,
  Eye,
  Hand,
  Heart,
  Hospital,
  Stethoscope,
} from "lucide-react";

interface ISpeciality {
  speciality: string;
  appointments: number;
}

interface ITopSpecialitiesProps {
  topSpecialities: ISpeciality[];
}

function getSpecialityIcon(speciality: string) {
  const specialityLower = speciality.toLowerCase();

  if (specialityLower.includes("cardiolog")) return Heart;

  if (
    specialityLower.includes("ginecolog") ||
    specialityLower.includes("obstetri")
  )
    return Baby;

  if (specialityLower.includes("pediatr")) return Activity;

  if (specialityLower.includes("dermatolog")) return Hand;

  if (
    specialityLower.includes("ortoped") ||
    specialityLower.includes("traumat")
  )
    return Bone;

  if (specialityLower.includes("oftalmol")) return Eye;

  if (specialityLower.includes("neurolog")) return Brain;

  return Stethoscope;
}

export function TopSpecialities({ topSpecialities }: ITopSpecialitiesProps) {
  const maxAppointments = Math.max(
    ...topSpecialities.map((item) => item.appointments),
  );

  return (
    <Card className="mx-auto w-full py-0">
      <CardContent className="p-0">
        <CardHeader className="flex items-center justify-between border-b p-6">
          <div className="flex items-center gap-2">
            <Hospital className="text-muted-foreground" />
            <CardTitle className="text-base">Especialidades</CardTitle>
          </div>
        </CardHeader>

        <div className="divide-y">
          {topSpecialities.map((speciality) => {
            const Icon = getSpecialityIcon(speciality.speciality);

            // Porcentagem de ocupação da especialidade baseando-se no maior número de agendamentos
            const progressValue =
              (speciality.appointments / maxAppointments) * 100;

            return (
              <div
                key={speciality.speciality}
                className="flex items-center justify-between p-4"
              >
                <div className="flex w-full items-center gap-4">
                  <div className="text-primary bg-primary/10 flex size-10 items-center justify-center rounded-full">
                    <Icon className="size-5" />
                  </div>
                  <div className="flex w-full flex-col justify-center gap-2">
                    <div className="flex w-full justify-between">
                      <h3 className="text-sm">{speciality.speciality}</h3>

                      <div className="text-right">
                        <span className="text-muted-foreground text-sm font-medium">
                          {speciality.appointments} agend.
                        </span>
                      </div>
                    </div>

                    <Progress value={progressValue} className="w-full" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
