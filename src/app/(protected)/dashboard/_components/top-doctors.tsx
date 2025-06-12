import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Stethoscope } from "lucide-react";

interface IDoctor {
  id: string;
  name: string;
  avatarImageUrl: string | null;
  speciality: string;
  appointments: number;
}

interface ITopDoctorsProps {
  doctors: IDoctor[];
}

export function TopDoctors({ doctors }: ITopDoctorsProps) {
  return (
    <Card className="mx-auto w-full py-0">
      <CardContent className="p-0">
        <CardHeader className="flex items-center justify-between border-b p-6">
          <div className="flex items-center gap-2">
            <Stethoscope className="text-muted-foreground" />
            <CardTitle className="text-base">Médicos mais agendados</CardTitle>
          </div>
        </CardHeader>

        <div className="divide-y">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="text-sm">{doctor.name}</h3>
                  <p className="text-muted-foreground text-xs">
                    {doctor.speciality}
                  </p>
                </div>
              </div>
              <div className="text-muted-foreground text-sm font-medium">
                {doctor.appointments} agend.
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
