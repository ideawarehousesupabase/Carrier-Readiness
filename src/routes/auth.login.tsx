import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/login")({ component: LoginPage });

function LoginPage() {
  const { login, firebaseReady } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success("Welcome back");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent">
            <ShieldCheck className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <div className="text-lg font-bold">CORP</div>
            <div className="text-xs uppercase tracking-wider opacity-70">Carrier Onboarding Readiness</div>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-bold leading-tight">
            Onboard carriers with <span className="text-accent">confidence</span>.
          </h2>
          <p className="text-primary-foreground/80">
            Verify compliance, score readiness, and orchestrate approvals — all in one operations cockpit built for modern logistics teams.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-6">
            {[
              { k: "20+", v: "Carriers tracked" },
              { k: "98%", v: "Compliance visibility" },
              { k: "4-step", v: "Onboarding" },
            ].map((s) => (
              <div key={s.v} className="rounded-lg border border-primary-foreground/20 p-3">
                <div className="text-2xl font-bold text-accent">{s.k}</div>
                <div className="text-xs opacity-80">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs opacity-70">
          <Truck className="h-4 w-4" /> Built for transport, compliance & operations leaders.
        </div>
      </div>

      <div className="flex items-center justify-center bg-beige p-6 lg:p-12">
        <form onSubmit={submit} className="w-full max-w-md space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Sign in to CORP</h1>
            <p className="text-sm text-muted-foreground">Access your carrier readiness workspace.</p>
          </div>
          {!firebaseReady && (
            <div className="rounded-md border border-warning/40 bg-warning/10 p-3 text-xs text-foreground">
              Firebase env vars not detected — using local fallback. Set <code>VITE_FIREBASE_*</code> in <code>.env.local</code> to persist users in Firestore.
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            New to CORP?{" "}
            <Link to="/auth/register" className="font-medium text-accent hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
