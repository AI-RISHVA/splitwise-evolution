import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const Route = createFileRoute("/_authenticated/friends")({
  head: () => ({
    meta: [
      { title: "Friends — Splitwise" },
      { name: "description", content: "Find people, send friend requests and manage your friend list." },
      { property: "og:title", content: "Friends — Splitwise" },
      { property: "og:description", content: "Find people, send friend requests and manage your friend list." },
    ],
  }),
  component: () => (
    <AppShell title="Friends">
      <ComingSoon phase="Phase 4" title="Friends" />
    </AppShell>
  ),
});
