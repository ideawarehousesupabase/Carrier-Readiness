import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "destructive" | "info" | "muted" | "accent";

const toneClass: Record<Tone, string> = {
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/20 text-warning-foreground border-warning/40",
  destructive: "bg-destructive/15 text-destructive border-destructive/30",
  info: "bg-info/15 text-info border-info/30",
  muted: "bg-muted text-muted-foreground border-border",
  accent: "bg-accent/15 text-accent border-accent/30",
};

export function StatusBadge({
  children,
  tone = "muted",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export const statusTone = (status: string): Tone => {
  switch (status) {
    case "Approved":
    case "Verified":
    case "Low":
      return "success";
    case "Pending":
    case "Conditional":
    case "Medium":
      return "warning";
    case "Rejected":
    case "Expired":
    case "Missing":
    case "High":
      return "destructive";
    default:
      return "muted";
  }
};
