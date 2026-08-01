import TrustBadge from "../components/TrustBadge";

export default function Insights() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-ink">Insights</h1>
          <p className="text-sm text-slate-500">Your week, explained in plain language.</p>
        </div>
        <TrustBadge kind="ai" label="Auto-generated every Monday" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-3 font-semibold text-brand-ink">Week of {new Date().toLocaleDateString()}</h2>
        <p className="text-sm leading-relaxed text-slate-700">
          Sales were up <span className="font-semibold text-brand-teal">12%</span> compared to
          last week, mostly driven by weekend foot traffic. Your top seller was the ceramic mug
          collection — consider featuring it in this week's social post. Three products are
          running low on stock; the Automation Center has already queued restock reminders for
          them. Customer response time on the AI Assistant averaged under 10 seconds, with a 94%
          satisfaction rate on resolved questions.
        </p>
      </div>

      <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">
        This summary is generated automatically from your store's live data every Monday —
        no one on your team has to compile it.
      </div>
    </div>
  );
}
