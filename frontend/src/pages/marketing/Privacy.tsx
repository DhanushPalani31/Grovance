import { motion } from "framer-motion";
import Navbar from "../../components/marketing/Navbar";
import Footer from "../../components/marketing/Footer";

const sections = [
  {
    title: "1. What This Policy Covers",
    body: `This Privacy Policy explains what information Grovance collects through its website
and client portal, how we use it, and the choices you have. It applies to visitors to our
marketing site and to users of the client portal.`,
  },
  {
    title: "2. Information We Collect",
    body: `Account information: name and email address you provide when creating an account.
Contact/lead information: name, email, and message content submitted through the Contact form.
AI interaction data: messages you send to the AI Assistant, Content Studio prompts, and the
resulting AI-generated content. Usage and activity data: actions taken within the portal (for
example, toggling an automation rule or opening a support ticket), which we log to power
features like the Activity Feed. We do not currently collect payment card data directly — any
billing is handled by a dedicated payment processor if and when paid plans are introduced.`,
  },
  {
    title: "3. How We Use Information",
    body: `We use the information above to: provide and operate the Service (for example,
authenticating your account and displaying your activity feed); generate AI responses and
content you request; respond to inquiries submitted through the Contact form; monitor and
improve the reliability and security of the Service; and communicate with you about your
account or the Service.`,
  },
  {
    title: "4. AI Processing and Third Parties",
    body: `Messages you send to the AI Assistant or Content Studio are sent to Anthropic's
Claude API to generate a response. We do not sell your personal information to third parties.
We may share limited information with infrastructure providers (such as hosting and email
delivery services) solely to operate the Service, under contractual confidentiality
obligations.`,
  },
  {
    title: "5. Cookies and Local Storage",
    body: `The client portal stores your authentication session in your browser's local storage
rather than cookies, so you remain signed in between visits. We do not currently use
advertising or third-party tracking cookies on this site.`,
  },
  {
    title: "6. Data Retention",
    body: `We retain account and activity information for as long as your account is active, or
as needed to provide the Service and comply with legal obligations. You may request deletion of
your account and associated data at any time, subject to any records we're required to keep by
law.`,
  },
  {
    title: "7. Your Rights",
    body: `Depending on your location, you may have rights to access, correct, export, or delete
your personal information, and to object to or restrict certain processing. To exercise these
rights, contact us through the Contact page. [Placeholder — expand this section with
jurisdiction-specific rights, e.g. GDPR or CCPA, once you know where your customers are
located.]`,
  },
  {
    title: "8. Children's Privacy",
    body: `The Service is intended for business use and is not directed at children. We do not
knowingly collect personal information from children.`,
  },
  {
    title: "9. Security",
    body: `We use reasonable technical measures — including password hashing and token-based
authentication — to protect your information. No method of transmission or storage is
completely secure, and we cannot guarantee absolute security.`,
  },
  {
    title: "10. International Data Transfers",
    body: `Depending on where you and our service providers (including our AI provider) are
located, your information may be processed in a country other than your own. [Placeholder —
confirm specific transfer safeguards once real hosting/provider locations are finalized.]`,
  },
  {
    title: "11. Changes to This Policy",
    body: `We may update this Privacy Policy from time to time. Material changes will be
reflected by an updated "Last updated" date on this page.`,
  },
  {
    title: "12. Contact",
    body: `Questions about this Privacy Policy can be sent through the Contact page.`,
  },
];

export default function Privacy() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <section className="mx-auto max-w-3xl flex-1 px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 className="text-3xl font-bold text-ink">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>Template notice:</strong> this is a complete, realistic draft written for a
          demo application — it is not a substitute for review by a qualified attorney (and, if
          you'll have EU/UK or California customers, specific GDPR/CCPA language) before
          publishing it for real customers.
        </div>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-600">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="mb-2 font-semibold text-ink">{s.title}</h2>
              <p className="whitespace-pre-line">{s.body}</p>
            </div>
          ))}
        </div>
        </motion.div>
      </section>
      <Footer />
    </div>
  );
}
