import { Zap, Bot, ShieldCheck } from "lucide-react";

const styles = {
  automation: {
    icon: Zap,
    classes: "bg-info/10 text-info border-info/30",
  },
  ai: {
    icon: Bot,
    classes: "bg-brand/10 text-brand border-brand/30",
  },
  maintenance: {
    icon: ShieldCheck,
    classes: "bg-accent/10 text-accent border-accent/30",
  },
} as const;

export default function TrustBadge({
  kind,
  label,
}: {
  kind: keyof typeof styles;
  label: string;
}) {
  const { icon: Icon, classes } = styles[kind];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${classes}`}
    >
      <Icon size={12} />
      {label}
    </span>
  );
}
