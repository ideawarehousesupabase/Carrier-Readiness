import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { RequireAuth } from "@/components/require-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, statusTone } from "@/components/status-badge";
import { toast } from "sonner";
import type { CarrierStatus } from "@/lib/types";
import { useCarriers, useUpdateCarrier } from "@/hooks/use-carriers";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/approvals")({
  component: () => (
    <RequireAuth>
      <AppShell title="Approval Workflow"><Approvals /></AppShell>
    </RequireAuth>
  ),
});

function Approvals() {
  const { data: carriers = [], isLoading } = useCarriers();
  const updateMutation = useUpdateCarrier();

  const setStatus = (id: string, status: CarrierStatus, name: string) => {
    updateMutation.mutate({ id, updates: { status } }, {
      onSuccess: () => toast.success(`${name} → ${status}`),
      onError: () => toast.error(`Failed to update ${name}`),
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const queue = carriers.filter((c) => ["Pending", "Conditional"].includes(c.status));

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-0">
          <div className="border-b bg-muted/40 px-4 py-3 text-sm font-semibold">Approval Queue</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30">
                <tr className="text-left text-xs uppercase text-muted-foreground">
                  <th className="px-4 py-3">Carrier</th>
                  <th className="px-4 py-3">Readiness</th>
                  <th className="px-4 py-3">Risk</th>
                  <th className="px-4 py-3">Current Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((c) => {
                  const status = c.status;
                  return (
                    <tr key={c.id} className="border-t">
                      <td className="px-4 py-3 font-medium">{c.name}</td>
                      <td className="px-4 py-3">{c.readinessScore}</td>
                      <td className="px-4 py-3"><StatusBadge tone={statusTone(c.riskLevel)}>{c.riskLevel}</StatusBadge></td>
                      <td className="px-4 py-3"><StatusBadge tone={statusTone(status)}>{status}</StatusBadge></td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90" onClick={() => setStatus(c.id, "Approved", c.name)}>Approve</Button>
                          <Button size="sm" variant="outline" onClick={() => setStatus(c.id, "Conditional", c.name)}>Conditional</Button>
                          <Button size="sm" variant="destructive" onClick={() => setStatus(c.id, "Rejected", c.name)}>Reject</Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {queue.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No carriers awaiting decision.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="border-b bg-muted/40 px-4 py-3 text-sm font-semibold">Decision History</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30">
                <tr className="text-left text-xs uppercase text-muted-foreground">
                  <th className="px-4 py-3">Carrier</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {carriers.filter((c) => !["Pending", "Conditional"].includes(c.status)).map((c) => {
                  const status = c.status;
                  return (
                    <tr key={c.id} className="border-t">
                      <td className="px-4 py-3 font-medium">{c.name}</td>
                      <td className="px-4 py-3"><StatusBadge tone={statusTone(status)}>{status}</StatusBadge></td>
                      <td className="px-4 py-3 text-muted-foreground">{c.lastUpdated}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
