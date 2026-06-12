import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { RequireAuth } from "@/components/require-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/status-badge";
import { readinessCategory } from "@/lib/mock-data";
import { useCarriers } from "@/hooks/use-carriers";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/readiness")({
  component: () => (
    <RequireAuth>
      <AppShell title="Readiness Assessment"><Readiness /></AppShell>
    </RequireAuth>
  ),
});

function Readiness() {
  const { data: carriers = [], isLoading } = useCarriers();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const buckets = [
    { label: "Critical", range: "0–49", tone: "destructive" as const, items: carriers.filter((c) => c.readinessScore < 50) },
    { label: "At Risk", range: "50–69", tone: "warning" as const, items: carriers.filter((c) => c.readinessScore >= 50 && c.readinessScore < 70) },
    { label: "Ready", range: "70–84", tone: "info" as const, items: carriers.filter((c) => c.readinessScore >= 70 && c.readinessScore < 85) },
    { label: "Highly Ready", range: "85–100", tone: "success" as const, items: carriers.filter((c) => c.readinessScore >= 85) },
  ];
  const avg = (key: "documentation" | "insurance" | "safety" | "capabilities") =>
    Math.round(carriers.reduce((a, c) => a + c.readiness[key], 0) / carriers.length);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {buckets.map((b) => (
          <Card key={b.label}>
            <CardContent className="p-4">
              <StatusBadge tone={b.tone}>{b.label}</StatusBadge>
              <div className="mt-3 text-3xl font-bold">{b.items.length}</div>
              <div className="text-xs text-muted-foreground">Score {b.range}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Average Component Scores</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {(["documentation", "insurance", "safety", "capabilities"] as const).map((k) => (
            <div key={k}>
              <div className="mb-1 flex justify-between text-sm capitalize">
                <span>{k}</span><span className="font-medium">{avg(k)}</span>
              </div>
              <Progress value={avg(k)} />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Missing Requirements</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {carriers.filter((c) => c.missingRequirements.length).slice(0, 8).map((c) => (
                <li key={c.id} className="rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <Link to="/carriers/$id" params={{ id: c.id }} className="font-medium hover:text-accent">{c.name}</Link>
                    <span className="text-xs text-muted-foreground">Score {c.readinessScore}</span>
                  </div>
                  <ul className="mt-2 list-disc pl-5 text-xs text-muted-foreground">
                    {c.missingRequirements.map((m) => <li key={m}>{m}</li>)}
                  </ul>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Improvement Recommendations</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {carriers.filter((c) => c.recommendations.length).slice(0, 8).map((c) => (
                <li key={c.id} className="rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <Link to="/carriers/$id" params={{ id: c.id }} className="font-medium hover:text-accent">{c.name}</Link>
                    <StatusBadge tone={readinessCategory(c.readinessScore).tone}>
                      {readinessCategory(c.readinessScore).label}
                    </StatusBadge>
                  </div>
                  <ul className="mt-2 list-disc pl-5 text-xs text-muted-foreground">
                    {c.recommendations.map((r) => <li key={r}>{r}</li>)}
                  </ul>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
