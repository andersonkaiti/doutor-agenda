import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@components/ui/page-container";
import { WithAuthentication } from "@hocs/with-authentication";
import { auth } from "@lib/auth";
import { headers } from "next/headers";

import { SubscriptionPlan } from "./_components/subscription-plan";

export default async function SubscriptionPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  return (
    <WithAuthentication mustHavePlan mustHaveClinic>
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <PageTitle>Assinatura</PageTitle>
            <PageDescription>Gerencie a sua assinatura</PageDescription>
          </PageHeaderContent>
        </PageHeader>
        <PageContent>
          <SubscriptionPlan
            active={session.user.plan === "essential"}
            userEmail={session.user.email}
          />
        </PageContent>
      </PageContainer>
    </WithAuthentication>
  );
}
