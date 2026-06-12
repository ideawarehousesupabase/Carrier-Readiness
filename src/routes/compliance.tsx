import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { RequireAuth } from "@/components/require-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge, statusTone } from "@/components/status-badge";
import { useCarriers } from "@/hooks/use-carriers";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/compliance")({
  component: () => (
    <RequireAuth>
      <AppShell title="Compliance Center"><Compliance /></AppShell>
    </RequireAuth>
  ),
});

function Compliance() {
  const { data: carriers = [], isLoading } = useCarriers();
  const [filter, setFilter] = useState("all");

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }


  const rows = useMemo(() => {
    const all = carriers.flatMap((c) =>
      c.documents.map((d) => ({ carrier: c.name, ...d })),
    );
    if (filter === "all") return all;
    return all.filter((r) => r.status.toLowerCase() === filter);
  }, [filter]);

  const counts = useMemo(() => {
    const all = carriers.flatMap((c) => c.documents);
    return {
      verified: all.filter((d) => d.status === "Verified").length,
      pending: all.filter((d) => d.status === "Pending").length,
      expired: all.filter((d) => d.status === "Expired").length,
      missing: all.filter((d) => d.status === "Missing").length,
    };
  }, []);

  const actionFor = (status: string) => {
    switch (status) {
      case "Verified": return "No action";
      case "Pending": return "Review pending submission";
      case "Expired": return "Request renewal";
      case "Missing": return "Request upload";
      default: return "—";
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {Object.entries(counts).map(([k, v]) => (
          <Card key={k}>
            <CardContent className="p-4">
              <div className="text-xs uppercase text-muted-foreground">{k}</div>
              <div className="mt-1 text-2xl font-bold">{v}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="verified">Verified</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="expired">Expired</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left text-xs uppercase text-muted-foreground">
                  <th className="px-4 py-3">Carrier</th>
                  <th className="px-4 py-3">Document</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Expiry Date</th>
                  <th className="px-4 py-3">Action Required</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 100).map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-3 font-medium">{r.carrier}</td>
                    <td className="px-4 py-3">{r.name}</td>
                    <td className="px-4 py-3"><StatusBadge tone={statusTone(r.status)}>{r.status}</StatusBadge></td>
                    <td className="px-4 py-3 text-muted-foreground">{r.expiryDate}</td>
                    <td className="px-4 py-3">{actionFor(r.status)}</td>
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
