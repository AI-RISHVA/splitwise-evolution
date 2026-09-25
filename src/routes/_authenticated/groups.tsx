import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const Route = createFileRoute("/_authenticated/groups")({
  head: () => ({
    meta: [
      { title: "Groups — Splitwise" },
      { name: "description", content: "Create groups and track shared expenses with them." },
      { property: "og:title", content: "Groups — Splitwise" },
      { property: "og:description", content: "Create groups and track shared expenses with them." },
    ],
  }),
  component: () => (
    <AppShell title="Groups">
      <ComingSoon phase="Phase 5" title="Groups" />
    </AppShell>
  ),
});
