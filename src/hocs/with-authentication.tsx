// Higher Order Component
// É um componente que recebe um componente e o renderiza, mas antes de renderizá-lo,
// executa alguma ação ou passa alguma prop extra para esse componente

import { auth } from "@lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface IWithAuthenticationProps {
  children: React.ReactNode;
  mustHavePlan?: boolean;
  mustHaveClinic?: boolean;
}

export async function WithAuthentication({
  children,
  mustHavePlan = false,
  mustHaveClinic = false,
}: IWithAuthenticationProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  if (mustHavePlan && !session?.user.plan) {
    redirect("/subscription");
  }

  if (mustHaveClinic && !session?.user.clinic) {
    redirect("/clinic-form");
  }

  return children;
}
