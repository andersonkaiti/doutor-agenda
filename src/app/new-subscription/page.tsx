import { auth } from "@lib/auth";
import { Sparkles } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { SubscriptionPlan } from "../(protected)/subscription/_components/subscription-plan";

export default async function UpgradePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  if (session.user.plan) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-4">
      <div className="mx-auto max-w-2xl text-center">
        <div className="my-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
            <Sparkles className="h-4 w-4" />
            Desbloqueie todo o potencial da sua clínica
          </div>

          <h1 className="mb-4 text-4xl leading-tight font-bold text-gray-900 md:text-5xl">
            Transforme sua clínica em uma
            <span className="text-emerald-600"> máquina de resultados</span>
          </h1>

          <p className="mb-8 text-xl leading-relaxed text-gray-600">
            Mais de <strong>10.000+ profissionais</strong> já descobriram como
            nossa plataforma revoluciona o atendimento e{" "}
            <strong>triplica a eficiência</strong> das consultas.
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <SubscriptionPlan userEmail={session?.user.email} />
        </div>
      </div>
    </div>
  );
}
