import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, XCircle, Clock, FileText, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { StatusBadge, statusTone } from "@/components/status-badge";
import { readinessCategory } from "@/lib/mock-data";
import { useCarrier } from "@/hooks/use-carriers";

export const Route = createFileRoute("/carriers/$id")({
  component: Profile,
  notFoundComponent: () => <div className="p-6">Carrier not found.</div>,
  errorComponent: ({ error }) => <div className="p-6 text-sm text-destructive">{error.message}</div>,
});

function Profile() {
  const { id } = Route.useParams();
  const { data: c, isLoading, error } = useCarrier(id);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !c) {
    throw notFound();
  }

  const cat = readinessCategory(c.readinessScore);


  const capList = [
    ["General Freight", c.capabilities.generalFreight],
    ["Refrigerated Transport", c.capabilities.refrigerated],
    ["Hazmat", c.capabilities.hazmat],
    ["Pharmaceutical", c.capabilities.pharmaceutical],
    ["Food Distribution", c.capabilities.foodDistribution],
  ] as const;

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm">
        <Link to="/carriers"><ArrowLeft className="mr-1 h-4 w-4" /> Back to Directory</Link>
      </Button>

      <Card>
        <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">{c.name}</h2>
              <StatusBadge tone={statusTone(c.status)}>{c.status}</StatusBadge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{c.type} · {c.address} · Fleet of {c.fleetSize}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">{c.readinessScore}</div>
              <StatusBadge tone={cat.tone}>{cat.label}</StatusBadge>
            </div>
            <div className="text-center">
              <div className="text-xs uppercase text-muted-foreground">Risk</div>
              <StatusBadge tone={statusTone(c.riskLevel)}>{c.riskLevel}</StatusBadge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Company Information</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-y-3 text-sm">
            <Field label="Company Name" value={c.name} />
            <Field label="Contact Person" value={c.contactPerson} />
            <Field label="Email" value={c.email} />
            <Field label="Phone" value={c.phone} />
            <Field label="Address" value={c.address} />
            <Field label="Fleet Size" value={String(c.fleetSize)} />
            <Field label="Coverage Area" value={c.coverageArea} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Capabilities</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {capList.map(([label, on]) => (
              <div key={label} className="flex items-center gap-2 rounded-md border p-3">
                {on ? <CheckCircle2 className="h-4 w-4 text-success" /> : <XCircle className="h-4 w-4 text-muted-foreground" />}
                <span className={on ? "font-medium" : "text-muted-foreground"}>{label}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Documents</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left text-xs uppercase text-muted-foreground">
                  <th className="px-3 py-2">Document</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Expiry Date</th>
                </tr>
              </thead>
              <tbody>
                {c.documents.map((d) => (
                  <tr key={d.name} className="border-t">
                    <td className="px-3 py-2 font-medium"><span className="inline-flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground" />{d.name}</span></td>
                    <td className="px-3 py-2"><StatusBadge tone={statusTone(d.status)}>{d.status}</StatusBadge></td>
                    <td className="px-3 py-2 text-muted-foreground">{d.expiryDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Readiness Assessment</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              ["Documentation", c.readiness.documentation],
              ["Insurance", c.readiness.insurance],
              ["Safety", c.readiness.safety],
              ["Capabilities", c.readiness.capabilities],
            ].map(([label, v]) => (
              <div key={label as string}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{label as string}</span>
                  <span className="font-medium">{v as number}</span>
                </div>
                <Progress value={v as number} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Risk Assessment</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Risk Level</span>
              <StatusBadge tone={statusTone(c.riskLevel)}>{c.riskLevel}</StatusBadge>
            </div>
            <div>
              <div className="mb-2 text-sm font-medium">Risk Indicators</div>
              {c.riskIndicators.length === 0 ? (
                <p className="text-sm text-muted-foreground">No active risk indicators.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {c.riskIndicators.map((r) => (
                    <li key={r} className="flex items-start gap-2"><Clock className="mt-0.5 h-4 w-4 text-destructive" />{r}</li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Approval Status</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {(["Approved", "Conditional", "Pending", "Rejected"] as const).map((s) => {
              const active = (s === "Conditional" ? "Conditional" : s) === c.status;
              return (
                <div key={s} className={`rounded-lg border p-4 text-center ${active ? "border-accent bg-accent/10" : ""}`}>
                  <div className="text-sm font-medium">{s === "Conditional" ? "Conditional Approval" : s === "Pending" ? "Pending Review" : s}</div>
                  {active && <div className="mt-1 text-xs text-accent">Current</div>}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
