function getStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-danger" };
  if (score <= 3) return { score, label: "Okay", color: "bg-warning" };
  return { score, label: "Strong", color: "bg-success" };
}

export default function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const { score, label, color } = getStrength(password);
  const bars = 5;

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {Array.from({ length: bars }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${i < score ? color : "bg-slate-200"}`}
          />
        ))}
      </div>
      <p className="mt-1 text-xs text-slate-400">{label}</p>
    </div>
  );
}
