import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { RequireAuth } from "@/components/require-auth";

export const Route = createFileRoute("/carriers")({
  component: () => (
    <RequireAuth>
      <AppShell title="Carrier Directory">
        <Outlet />
      </AppShell>
    </RequireAuth>
  ),
});

