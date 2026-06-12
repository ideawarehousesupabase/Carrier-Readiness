import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Upload } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { RequireAuth } from "@/components/require-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  component: () => (
    <RequireAuth>
      <AppShell title="Carrier Onboarding"><Onboarding /></AppShell>
    </RequireAuth>
  ),
});

const steps = ["Basic Information", "Capabilities", "Documents", "Review", "Submit"];

function Onboarding() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [data, setData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    caps: { gen: true, ref: false, haz: false, pharma: false, food: false },
    docs: {
      "Insurance Certificate": "",
      "Operating License": "",
      "Safety Certificate": "",
      "Tax Document": "",
      "Vehicle Registration": "",
    } as Record<string, string>,
  });

  if (done) {
    return (
      <Card className="mx-auto max-w-xl">
        <CardContent className="space-y-4 py-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold">Onboarding submitted</h2>
          <p className="text-sm text-muted-foreground">
            {data.companyName || "The carrier"} has been queued for compliance review and readiness scoring.
          </p>
          <Button onClick={() => { setStep(0); setDone(false); setData({ ...data, companyName: "" }); }}>
            Onboard another carrier
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        {steps.map((label, i) => (
          <div key={label} className="flex flex-1 items-center">
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
              i <= step ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
            )}>{i + 1}</div>
            <div className={cn("ml-2 hidden text-xs sm:block", i <= step ? "font-medium" : "text-muted-foreground")}>{label}</div>
            {i < steps.length - 1 && <div className={cn("mx-2 h-px flex-1", i < step ? "bg-accent" : "bg-border")} />}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>{steps[step]}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {step === 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                ["companyName", "Company Name"],
                ["contactPerson", "Contact Person"],
                ["email", "Email"],
                ["phone", "Phone"],
              ].map(([k, l]) => (
                <div key={k} className="space-y-1.5">
                  <Label>{l}</Label>
                  <Input value={(data as any)[k]} onChange={(e) => setData({ ...data, [k]: e.target.value })} />
                </div>
              ))}
              <div className="space-y-1.5 md:col-span-2">
                <Label>Address</Label>
                <Input value={data.address} onChange={(e) => setData({ ...data, address: e.target.value })} />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {[
                ["gen", "General Freight"],
                ["ref", "Refrigerated"],
                ["haz", "Hazmat"],
                ["pharma", "Pharmaceutical"],
                ["food", "Food Distribution"],
              ].map(([k, l]) => (
                <label key={k} className="flex cursor-pointer items-center gap-3 rounded-md border p-3 hover:bg-muted/30">
                  <Checkbox
                    checked={(data.caps as any)[k]}
                    onCheckedChange={(v) => setData({ ...data, caps: { ...data.caps, [k]: Boolean(v) } })}
                  />
                  <span className="font-medium">{l}</span>
                </label>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              {Object.keys(data.docs).map((name) => (
                <div key={name} className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <div className="text-sm font-medium">{name}</div>
                    <div className="text-xs text-muted-foreground">{data.docs[name] || "No file uploaded"}</div>
                  </div>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setData({ ...data, docs: { ...data.docs, [name]: e.target.files?.[0]?.name || "file.pdf" } })}
                    />
                    <span className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground">
                      <Upload className="h-3 w-3" /> Upload
                    </span>
                  </label>
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 text-sm">
              <Section title="Company">
                <Row k="Name" v={data.companyName} />
                <Row k="Contact" v={data.contactPerson} />
                <Row k="Email" v={data.email} />
                <Row k="Phone" v={data.phone} />
                <Row k="Address" v={data.address} />
              </Section>
              <Section title="Capabilities">
                <div>{Object.entries(data.caps).filter(([, v]) => v).map(([k]) => k).join(", ") || "—"}</div>
              </Section>
              <Section title="Documents">
                {Object.entries(data.docs).map(([k, v]) => <Row key={k} k={k} v={v || "Not uploaded"} />)}
              </Section>
            </div>
          )}

          {step === 4 && (
            <p className="text-sm text-muted-foreground">
              Click submit to send this carrier for compliance verification, readiness scoring, and risk evaluation.
            </p>
          )}

          <div className="flex justify-between pt-2">
            <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>Back</Button>
            {step < steps.length - 1 ? (
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setStep((s) => s + 1)}>Continue</Button>
            ) : (
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setDone(true)}>Submit Onboarding</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border p-3">
      <div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">{title}</div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v || "—"}</span></div>;
}
