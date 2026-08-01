import Navbar from "../../components/marketing/Navbar";
import Footer from "../../components/marketing/Footer";

export default function Terms() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <section className="mx-auto max-w-3xl flex-1 px-6 py-16">
        <h1 className="text-3xl font-bold text-brand-ink">Terms of Service</h1>
        <p className="mt-2 text-sm text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-600">
          <p>
            <strong className="text-brand-ink">This is placeholder content for a demo
            application.</strong> Replace this page with real, reviewed legal terms
            before taking Grovance to production with real clients.
          </p>
          <div>
            <h2 className="mb-2 font-semibold text-brand-ink">1. Use of the Service</h2>
            <p>
              This demo portal is provided to illustrate Grovance's automation, AI, and
              maintenance capabilities. It is not intended for storing real customer or
              payment data in its current form.
            </p>
          </div>
          <div>
            <h2 className="mb-2 font-semibold text-brand-ink">2. Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your login
              credentials and for all activity under your account.
            </p>
          </div>
          <div>
            <h2 className="mb-2 font-semibold text-brand-ink">3. Changes</h2>
            <p>
              We may update these terms as the product evolves. Continued use of the
              service after changes constitutes acceptance of the revised terms.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
