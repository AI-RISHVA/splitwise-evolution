import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const Route = createFileRoute("/_authenticated/activity")({
  head: () => ({
    meta: [
      { title: "Activity — Splitwise" },
      { name: "description", content: "Recent expenses, settlements and group updates in one feed." },
      { property: "og:title", content: "Activity — Splitwise" },
      { property: "og:description", content: "Recent expenses, settlements and group updates in one feed." },
    ],
  }),
  component: () => (
    <AppShell title="Activity">
      <ComingSoon phase="Phase 8" title="Activity feed" />
    </AppShell>
  ),
});
