import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | GrantDesk",
  description: "GrantDesk privacy policy — how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Last updated: June 2026 &middot; GrantDesk is currently in beta.
      </p>

      <div className="rounded-md border border-amber-300 bg-amber-50 px-5 py-4 mb-10">
        <p className="text-sm text-amber-800 font-medium">
          This is a demonstration application. No real personal data is collected or processed for
          commercial purposes.
        </p>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
          1. Information We Collect
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          We collect information you provide directly to us, including your name, email address, and
          company details when you create an account or complete your business profile. We also
          collect usage data such as pages visited and features used to help us improve the
          platform. Additional optional profile information — such as industry, employee count, and
          annual revenue — may be collected to improve grant matching accuracy.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
          2. How We Use Your Information
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          We use the information we collect to provide and operate the GrantDesk platform, including
          personalized grant matching based on your business profile. Your information is also used
          to send deadline reminders and relevant notifications when you have enabled them, and to
          continuously improve the accuracy and relevance of our platform for all users.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">3. Data Sharing</h2>
        <p className="text-muted-foreground leading-relaxed">
          We do not sell your personal information to third parties under any circumstances. We may
          share anonymized, aggregated data — which cannot be used to identify you — for research
          purposes or to publish insights about grant funding trends. Any service providers we
          engage are bound by data processing agreements and may not use your data for their own
          purposes.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">4. Data Storage</h2>
        <p className="text-muted-foreground leading-relaxed">
          Your data is stored securely on servers located in Canada. We use industry-standard
          encryption both at rest and in transit to protect your information. Access to personal
          data is restricted to authorized personnel who require it to operate and maintain the
          service.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">5. Your Rights</h2>
        <p className="text-muted-foreground leading-relaxed">
          You have the right to access, correct, or delete the personal information we hold about
          you. You may request deletion of your account and all associated data at any time by
          contacting us at{" "}
          <a
            href="mailto:privacy@grantdesk.ca"
            className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          >
            privacy@grantdesk.ca
          </a>
          . We will process deletion requests within 30 days.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">6. Cookies</h2>
        <p className="text-muted-foreground leading-relaxed">
          We use essential session cookies only — these are required for the platform to function
          correctly and to keep you signed in. We do not use third-party advertising cookies,
          tracking pixels, or any other cookies for marketing or behavioral profiling purposes.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">7. Contact</h2>
        <p className="text-muted-foreground leading-relaxed">
          For privacy-related inquiries, please contact us at{" "}
          <a
            href="mailto:privacy@grantdesk.ca"
            className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          >
            privacy@grantdesk.ca
          </a>
          .
        </p>
      </section>
    </div>
  );
}
