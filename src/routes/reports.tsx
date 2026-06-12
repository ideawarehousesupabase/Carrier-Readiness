import { createFileRoute } from "@tanstack/react-router";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { AppShell } from "@/components/app-shell";
import { RequireAuth } from "@/components/require-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { readinessCategory } from "@/lib/mock-data";
import { useCarriers } from "@/hooks/use-carriers";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/reports")({
  component: () => (
    <RequireAuth>
      <AppShell title="Reports"><Reports /></AppShell>
    </RequireAuth>
  ),
});

function Reports() {
  const { data: carriers = [], isLoading } = useCarriers();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const avg = carriers.length > 0 ? Math.round(carriers.reduce((a, c) => a + c.readinessScore, 0) / carriers.length) : 0;

  const readinessBuckets = ["Critical", "At Risk", "Ready", "Highly Ready"].map((label) => ({
    name: label,
    count: carriers.filter((c) => readinessCategory(c.readinessScore).label === label).length,
  }));
  const allDocs = carriers.flatMap((c) => c.documents);
  const docCounts = ["Verified", "Pending", "Expired", "Missing"].map((s) => ({
    name: s, value: allDocs.filter((d) => d.status === s).length,
  }));
  const riskCounts = ["Low", "Medium", "High"].map((r) => ({
    name: r, value: carriers.filter((c) => c.riskLevel === r).length,
  }));
  const approvalCounts = ["Approved", "Pending", "Conditional", "Rejected"].map((s) => ({
    name: s, value: carriers.filter((c) => c.status === s).length,
  }));

  const colors = ["var(--success)", "var(--warning)", "var(--info)", "var(--destructive)"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Carrier Readiness Report</CardTitle>
            <div className="text-xs text-muted-foreground">Average readiness score: <span className="font-bold text-accent">{avg}</span></div>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={readinessBuckets}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="var(--accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Compliance Report</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={docCounts} dataKey="value" nameKey="name" outerRadius={90} label>
                  {docCounts.map((_, i) => <Cell key={i} fill={colors[i]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Risk Report</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskCounts}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Approval Report</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={approvalCounts} dataKey="value" nameKey="name" outerRadius={90} label>
                  {approvalCounts.map((_, i) => <Cell key={i} fill={colors[i]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
