"use client";

import { createStripeCheckout } from "@actions/create-stripe-checkout";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@components/ui/card";
import { cn } from "@lib/utils";
import { loadStripe } from "@stripe/stripe-js";
import { CheckCircle2, Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { useAction } from "next-safe-action/hooks";

interface SubscriptionPlanProps {
  active?: boolean;
  className?: string;
  userEmail: string;
}

export function SubscriptionPlan({
  active = false,
  className,
  userEmail,
}: SubscriptionPlanProps) {
  const createCheckoutSessionAction = useAction(createStripeCheckout, {
    onSuccess: async ({ data }) => {
      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        throw new Error("Stripe publishable key not found");
      }

      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
      );

      if (!stripe) {
        throw new Error("Stripe not found");
      }

      if (!data?.sessionId) {
        throw new Error("Session ID not found");
      }

      await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });
    },
  });

  const features = [
    "Cadastro de até 3 médicos",
    "Agendamentos ilimitados",
    "Métricas básicas",
    "Cadastro de pacientes",
    "Confirmação manual",
    "Suporte via e-mail",
  ];

  function handleSubscribeClick() {
    createCheckoutSessionAction.execute();
  }

  function handleManagePlanClick() {
    redirect(
      `${process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL}?prefilled_email=${userEmail}`,
    );
  }

  return (
    <Card
      className={cn(
        "w-87.5 border border-gray-200 bg-white shadow-sm",
        className,
      )}
    >
      <CardHeader className="pb-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Essential</h3>
          {active && (
            <Badge
              variant="secondary"
              className="bg-emerald-100 text-emerald-600 hover:bg-emerald-100"
            >
              Atual
            </Badge>
          )}
        </div>
        <p className="mb-4 text-sm text-gray-600">
          Para profissionais autônomos ou pequenas clínicas
        </p>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-gray-900">R$59</span>
          <span className="ml-1 text-gray-600">/ mês</span>
        </div>
      </CardHeader>

      <CardContent className="pb-6">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="size-4 text-emerald-600" />
              </div>
              <span className="text-sm text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full border border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
          variant="outline"
          onClick={active ? handleManagePlanClick : handleSubscribeClick}
          disabled={createCheckoutSessionAction.isExecuting}
        >
          {createCheckoutSessionAction.isExecuting && (
            <Loader2 className="mr-2 size-4 animate-spin" />
          )}
          {active ? "Gerenciar assinatura" : "Fazer assinatura"}
        </Button>
      </CardFooter>
    </Card>
  );
}
