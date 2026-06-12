import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Truck, CheckCircle2, Clock, XCircle, AlertTriangle, Gauge, ArrowUpRight, Loader2,
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";
import { AppShell } from "@/components/app-shell";
import { RequireAuth } from "@/components/require-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { recentActivity, alerts, readinessCategory } from "@/lib/mock-data";
import { StatusBadge, statusTone } from "@/components/status-badge";
import { useCarriers } from "@/hooks/use-carriers";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <RequireAuth>
      <AppShell title="Dashboard"><Dashboard /></AppShell>
    </RequireAuth>
  ),
});

function Dashboard() {
  const { data: carriers = [], isLoading } = useCarriers();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const total = carriers.length;
  const approved = carriers.filter((c) => c.status === "Approved").length;
  const pending = carriers.filter((c) => c.status === "Pending").length;
  const rejected = carriers.filter((c) => c.status === "Rejected").length;
  const complianceAlerts = carriers.filter((c) =>
    c.documents.some((d) => d.status === "Expired" || d.status === "Missing"),
  ).length;
  const avgReadiness = carriers.length > 0 ? Math.round(
    carriers.reduce((a, c) => a + c.readinessScore, 0) / carriers.length,
  ) : 0;

  const statusData = [
    { name: "Approved", value: approved, color: "var(--success)" },
    { name: "Pending", value: pending, color: "var(--warning)" },
    {
      name: "Conditional",
      value: carriers.filter((c) => c.status === "Conditional").length,
      color: "var(--info)",
    },
    { name: "Rejected", value: rejected, color: "var(--destructive)" },
  ];

  const readinessBuckets = ["Critical", "At Risk", "Ready", "Highly Ready"].map((label) => ({
    name: label,
    count: carriers.filter((c) => readinessCategory(c.readinessScore).label === label).length,
  }));

  const kpis = [
    { label: "Total Carriers", value: total, icon: Truck, tone: "primary" },
    { label: "Approved", value: approved, icon: CheckCircle2, tone: "success" },
    { label: "Pending Reviews", value: pending, icon: Clock, tone: "warning" },
    { label: "Rejected", value: rejected, icon: XCircle, tone: "destructive" },
    { label: "Compliance Alerts", value: complianceAlerts, icon: AlertTriangle, tone: "warning" },
    { label: "Avg Readiness", value: avgReadiness, icon: Gauge, tone: "accent" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {kpis.map((k) => (
          <Card key={k.label} className="border-l-4" style={{ borderLeftColor: "var(--accent)" }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">{k.label}</div>
                  <div className="mt-1 text-2xl font-bold">{k.value}</div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <k.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Carrier Status Distribution</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {statusData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Readiness Distribution</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={readinessBuckets}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="var(--accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Link to="/carriers" className="text-xs text-accent hover:underline">View all</Link>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recentActivity.map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-3 rounded-md border p-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 text-accent">
                      {a.type === "approval" && <CheckCircle2 className="h-4 w-4" />}
                      {a.type === "compliance" && <AlertTriangle className="h-4 w-4" />}
                      {a.type === "readiness" && <Gauge className="h-4 w-4" />}
                    </div>
                    <div>
                      <div className="text-sm">{a.text}</div>
                      <div className="text-xs text-muted-foreground">{a.time}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Alerts</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((al) => (
              <div key={al.id} className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <StatusBadge tone={al.severity === "high" ? "destructive" : al.severity === "medium" ? "warning" : "info"}>
                    {al.severity.toUpperCase()}
                  </StatusBadge>
                  <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                </div>
                <p className="mt-2 text-sm">{al.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>High-Risk Carriers</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                  <th className="py-2 pr-3">Carrier</th>
                  <th className="py-2 pr-3">Type</th>
                  <th className="py-2 pr-3">Readiness</th>
                  <th className="py-2 pr-3">Risk</th>
                  <th className="py-2 pr-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {carriers.filter((c) => c.riskLevel === "High").slice(0, 5).map((c) => (
                  <tr key={c.id} className="border-b last:border-0">
                    <td className="py-2 pr-3 font-medium">{c.name}</td>
                    <td className="py-2 pr-3">{c.type}</td>
                    <td className="py-2 pr-3">{c.readinessScore}</td>
                    <td className="py-2 pr-3"><StatusBadge tone={statusTone(c.riskLevel)}>{c.riskLevel}</StatusBadge></td>
                    <td className="py-2 pr-3"><StatusBadge tone={statusTone(c.status)}>{c.status}</StatusBadge></td>
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
