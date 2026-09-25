import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight, PieChart, Receipt, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Splitwise — Share expenses without the awkward math" },
      {
        name: "description",
        content: "Split bills with friends and groups, track who owes whom, and settle up in seconds.",
      },
      { property: "og:title", content: "Splitwise — Share expenses without the awkward math" },
      {
        property: "og:description",
        content: "Split bills with friends and groups, track who owes whom, and settle up in seconds.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { isAuthenticated, ready } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && isAuthenticated) navigate({ to: "/dashboard", replace: true });
  }, [ready, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Receipt className="size-5" />
          </span>
          <span className="text-lg font-semibold text-foreground">Splitwise</span>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/auth">Login</Link>
        </Button>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Share expenses without the awkward math
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Add an expense once, split it equally, unequally or by percentage, and always know exactly
          who owes whom.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/auth">
              Get started <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 px-4 pb-20 md:grid-cols-3">
        <Card>
          <CardHeader>
            <Users className="size-6 text-primary" />
            <CardTitle className="mt-2 text-base">Groups &amp; friends</CardTitle>
            <CardDescription>Trips, flatmates, dinners — keep every circle separate.</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <PieChart className="size-6 text-primary" />
            <CardTitle className="mt-2 text-base">Flexible splits</CardTitle>
            <CardDescription>Equal, unequal or percentage — with live totals.</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Receipt className="size-6 text-primary" />
            <CardTitle className="mt-2 text-base">Simple settle up</CardTitle>
            <CardDescription>Record payments and clear balances in one tap.</CardDescription>
          </CardHeader>
        </Card>
      </section>
    </div>
  );
}
