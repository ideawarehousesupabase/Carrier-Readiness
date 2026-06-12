import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import type { UserRole } from "@/lib/types";

export const Route = createFileRoute("/auth/register")({ component: RegisterPage });

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "Transport Manager" as UserRole,
  });
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await register(form);
      toast.success("Account created");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-beige p-6">
      <form onSubmit={submit} className="w-full max-w-md space-y-5 rounded-xl border border-beige-deep bg-card p-8 shadow-sm">

        <div>
          <h1 className="text-2xl font-bold">Create your CORP account</h1>
          <p className="text-sm text-muted-foreground">Prototype — credentials are stored in Firestore (or local fallback).</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required minLength={4} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Role</Label>
          <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as UserRole })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Transport Manager">Transport Manager</SelectItem>
              <SelectItem value="Compliance Officer">Compliance Officer</SelectItem>
              <SelectItem value="Operations Manager">Operations Manager</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={busy}>
          {busy ? "Creating…" : "Create account"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/auth/login" className="font-medium text-accent hover:underline">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
