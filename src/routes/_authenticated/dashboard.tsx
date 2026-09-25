import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Splitwise" },
      { name: "description", content: "Your balances, groups and recent activity at a glance." },
      { property: "og:title", content: "Dashboard — Splitwise" },
      { property: "og:description", content: "Your balances, groups and recent activity at a glance." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <AppShell title="Dashboard">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Total you are owed</CardDescription>
            <CardTitle className="text-3xl text-primary">₹0.00</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total you owe</CardDescription>
            <CardTitle className="text-3xl text-destructive">₹0.00</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Net balance</CardDescription>
            <CardTitle className="text-3xl">₹0.00</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Next up</CardTitle>
          <CardDescription>
            Friends, groups, expenses and settle-up come in the next phases. Phase 3 is ready — open{" "}
            <Link to="/profile" className="font-medium text-primary underline-offset-4 hover:underline">
              Profile
            </Link>
            .
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          View profile, update details, change password and delete account are all live.
        </CardContent>
      </Card>
    </AppShell>
  );
}
