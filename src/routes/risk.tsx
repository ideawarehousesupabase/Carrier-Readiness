import { createFileRoute, Link } from "@tanstack/react-router";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { AppShell } from "@/components/app-shell";
import { RequireAuth } from "@/components/require-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge, statusTone } from "@/components/status-badge";
import { riskTrend } from "@/lib/mock-data";
import { useCarriers } from "@/hooks/use-carriers";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/risk")({
  component: () => (
    <RequireAuth>
      <AppShell title="Risk Management"><Risk /></AppShell>
    </RequireAuth>
  ),
});

function Risk() {
  const { data: carriers = [], isLoading } = useCarriers();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const low = carriers.filter((c) => c.riskLevel === "Low").length;
  const med = carriers.filter((c) => c.riskLevel === "Medium").length;
  const high = carriers.filter((c) => c.riskLevel === "High").length;


  const categories = [
    { name: "Compliance Risk", value: carriers.filter((c) => c.documents.some((d) => d.status === "Expired")).length },
    { name: "Insurance Risk", value: carriers.filter((c) => c.insuranceStatus !== "Verified").length },
    { name: "Documentation Risk", value: carriers.filter((c) => c.documents.some((d) => d.status === "Missing")).length },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {[
          { label: "Low Risk", value: low, tone: "success" as const },
          { label: "Medium Risk", value: med, tone: "warning" as const },
          { label: "High Risk", value: high, tone: "destructive" as const },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <StatusBadge tone={s.tone}>{s.label}</StatusBadge>
              <div className="mt-3 text-3xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">carriers</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {categories.map((c) => (
          <Card key={c.name}>
            <CardHeader><CardTitle className="text-base">{c.name}</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{c.value}</div>
              <p className="text-xs text-muted-foreground">carriers with active exposure</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Risk Trend (last 6 months)</CardTitle></CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={riskTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="low" stroke="var(--success)" strokeWidth={2} />
              <Line type="monotone" dataKey="medium" stroke="var(--warning)" strokeWidth={2} />
              <Line type="monotone" dataKey="high" stroke="var(--destructive)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>High Risk Carriers</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left text-xs uppercase text-muted-foreground">
                  <th className="px-4 py-3">Carrier</th>
                  <th className="px-4 py-3">Readiness</th>
                  <th className="px-4 py-3">Risk Indicators</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {carriers.filter((c) => c.riskLevel === "High").map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="px-4 py-3 font-medium">
                      <Link to="/carriers/$id" params={{ id: c.id }} className="hover:text-accent">{c.name}</Link>
                    </td>
                    <td className="px-4 py-3">{c.readinessScore}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.riskIndicators.join("; ")}</td>
                    <td className="px-4 py-3"><StatusBadge tone={statusTone(c.status)}>{c.status}</StatusBadge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
