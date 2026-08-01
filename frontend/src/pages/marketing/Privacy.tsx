import Navbar from "../../components/marketing/Navbar";
import Footer from "../../components/marketing/Footer";

export default function Privacy() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <section className="mx-auto max-w-3xl flex-1 px-6 py-16">
        <h1 className="text-3xl font-bold text-brand-ink">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-600">
          <p>
            <strong className="text-brand-ink">This is placeholder content for a demo
            application.</strong> Replace this page with a real, legally-reviewed
            privacy policy before handling real customer data.
          </p>
          <div>
            <h2 className="mb-2 font-semibold text-brand-ink">Information We Collect</h2>
            <p>
              The demo portal collects account information (name, email) you provide at
              signup, and messages you send through the contact form or AI assistant,
              solely to demonstrate the product's functionality.
            </p>
          </div>
          <div>
            <h2 className="mb-2 font-semibold text-brand-ink">How We Use Information</h2>
            <p>
              Information submitted through this demo is used only to power the demo
              itself (e.g., logging activity, generating AI responses) and is not sold
              or shared with third parties.
            </p>
          </div>
          <div>
            <h2 className="mb-2 font-semibold text-brand-ink">Third-Party Services</h2>
            <p>
              AI features are powered by Anthropic's Claude API. Messages sent to the AI
              Assistant or Content Studio are processed by Anthropic to generate a
              response.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
