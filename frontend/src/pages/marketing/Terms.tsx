import Navbar from "../../components/marketing/Navbar";
import Footer from "../../components/marketing/Footer";

const sections = [
  {
    title: "1. Agreement to Terms",
    body: `By creating an account, accessing the client portal, or otherwise using Grovance's
website or services (the "Service"), you agree to be bound by these Terms of Service. If you
are agreeing on behalf of a business, you represent that you have authority to bind that
business, and "you" refers to that business.`,
  },
  {
    title: "2. Description of the Service",
    body: `Grovance provides automation tooling, AI-powered features, and ongoing maintenance
support for local shops and brands, delivered through a web-based client portal. Specific
features made available to your account (automation rules, AI assistant, content generation,
insights, ticketing) may vary based on your plan and configuration.`,
  },
  {
    title: "3. Accounts and Registration",
    body: `You must provide accurate information when creating an account and keep your login
credentials confidential. You are responsible for all activity that occurs under your account.
Notify us immediately if you suspect unauthorized access to your account.`,
  },
  {
    title: "4. Acceptable Use",
    body: `You agree not to use the Service to: violate any law or regulation; infringe the
intellectual property or privacy rights of others; transmit malware or attempt to gain
unauthorized access to our systems; or use the AI features to generate content that is
unlawful, defamatory, or intended to deceive end customers.`,
  },
  {
    title: "5. AI-Generated Content",
    body: `Certain features (the AI Assistant, Content Studio, and Insights) use third-party
AI models to generate text based on your inputs and your account's data. AI-generated output
may be inaccurate or unsuitable for a given purpose and should be reviewed before external use.
Grovance does not guarantee the accuracy, completeness, or appropriateness of AI-generated
content, and you are responsible for how you use it.`,
  },
  {
    title: "6. Fees and Payment",
    body: `Paid plans, if applicable to your account, are billed according to the pricing and
billing cycle agreed at signup or in a separate order form. Fees are non-refundable except as
required by law or as otherwise stated in your agreement with Grovance.`,
  },
  {
    title: "7. Ownership and Intellectual Property",
    body: `Grovance retains all rights to the Service itself, including its software, design,
and underlying technology. You retain ownership of the business data, content, and materials
you submit to the Service ("Your Content"). You grant Grovance a limited license to process
Your Content solely to provide and improve the Service.`,
  },
  {
    title: "8. Third-Party Services",
    body: `The Service relies on third-party infrastructure and AI providers (including
Anthropic's Claude API) to operate certain features. Your use of those features is also
subject to the relevant third party's terms, to the extent applicable.`,
  },
  {
    title: "9. Disclaimers",
    body: `THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
OR NON-INFRINGEMENT. Grovance does not warrant that the Service will be uninterrupted, secure,
or error-free.`,
  },
  {
    title: "10. Limitation of Liability",
    body: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, GROVANCE SHALL NOT BE LIABLE FOR ANY INDIRECT,
INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUE,
ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE, EVEN IF ADVISED OF THE POSSIBILITY OF
SUCH DAMAGES.`,
  },
  {
    title: "11. Termination",
    body: `You may stop using the Service and close your account at any time. Grovance may
suspend or terminate your access if you materially breach these Terms and do not cure the
breach within a reasonable period after notice.`,
  },
  {
    title: "12. Changes to These Terms",
    body: `We may update these Terms from time to time. If we make material changes, we will
provide reasonable notice, such as by posting an updated version on this page with a new
"Last updated" date. Continued use of the Service after changes take effect constitutes
acceptance of the revised Terms.`,
  },
  {
    title: "13. Governing Law",
    body: `These Terms are governed by the laws of the jurisdiction in which Grovance is
established, without regard to conflict-of-law principles. [Placeholder — specify the actual
governing jurisdiction before publishing this page for real use.]`,
  },
  {
    title: "14. Contact",
    body: `Questions about these Terms can be sent through the Contact page.`,
  },
];

export default function Terms() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <section className="mx-auto max-w-3xl flex-1 px-6 py-16">
        <h1 className="text-3xl font-bold text-brand-ink">Terms of Service</h1>
        <p className="mt-2 text-sm text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>Template notice:</strong> this is a complete, realistic draft written for a
          demo application — it is not a substitute for review by a qualified attorney in your
          jurisdiction before publishing it for real customers.
        </div>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-600">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="mb-2 font-semibold text-brand-ink">{s.title}</h2>
              <p className="whitespace-pre-line">{s.body}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
