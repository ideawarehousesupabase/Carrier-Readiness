import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Eye, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge, statusTone } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { useCarriers } from "@/hooks/use-carriers";

export const Route = createFileRoute("/carriers/")({
  component: CarrierList,
});

function CarrierList() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("readiness-desc");
  
  const { data: carriers = [], isLoading } = useCarriers();

  const list = useMemo(() => {
    let l = carriers.filter((c) =>
      c.name.toLowerCase().includes(q.toLowerCase()) &&
      (status === "all" || c.status === status),
    );
    switch (sort) {
      case "readiness-desc": l = [...l].sort((a, b) => b.readinessScore - a.readinessScore); break;
      case "readiness-asc": l = [...l].sort((a, b) => a.readinessScore - b.readinessScore); break;
      case "name": l = [...l].sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return l;
  }, [carriers, q, status, sort]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search carriers…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="md:w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Conditional">Conditional</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="md:w-56"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="readiness-desc">Readiness: High to Low</SelectItem>
              <SelectItem value="readiness-asc">Readiness: Low to High</SelectItem>
              <SelectItem value="name">Name (A–Z)</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left text-xs uppercase text-muted-foreground">
                  <th className="px-4 py-3">Carrier</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Readiness</th>
                  <th className="px-4 py-3">Risk</th>
                  <th className="px-4 py-3">Insurance</th>
                  <th className="px-4 py-3">Last Updated</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {list.map((c) => (
                  <tr key={c.id} className="border-t hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.type}</td>
                    <td className="px-4 py-3"><StatusBadge tone={statusTone(c.status)}>{c.status}</StatusBadge></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-accent" style={{ width: `${c.readinessScore}%` }} />
                        </div>
                        <span className="font-medium">{c.readinessScore}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge tone={statusTone(c.riskLevel)}>{c.riskLevel}</StatusBadge></td>
                    <td className="px-4 py-3"><StatusBadge tone={statusTone(c.insuranceStatus)}>{c.insuranceStatus}</StatusBadge></td>
                    <td className="px-4 py-3 text-muted-foreground">{c.lastUpdated}</td>
                    <td className="px-4 py-3 text-right">
                      <Button asChild size="sm" variant="ghost">
                        <Link to="/carriers/$id" params={{ id: c.id }}>
                          <Eye className="mr-1 h-4 w-4" /> View
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr><td colSpan={8} className="p-10 text-center text-muted-foreground">No carriers match your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

