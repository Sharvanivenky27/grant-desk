import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | GrantDesk",
  description: "GrantDesk terms of service — the rules and guidelines for using the platform.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Last updated: June 2026 &middot; These terms apply to GrantDesk beta users.
      </p>

      <div className="rounded-md border border-amber-300 bg-amber-50 px-5 py-4 mb-10">
        <p className="text-sm text-amber-800 font-medium">
          This is a demonstration application. No real personal data is collected or processed for
          commercial purposes.
        </p>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
          1. Acceptance of Terms
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          By accessing or using GrantDesk, you agree to be bound by these Terms of Service. If you
          do not agree to these terms, please do not use the platform. GrantDesk is provided as-is
          during the beta period, and features or terms may change as the product evolves.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">2. Use of Service</h2>
        <p className="text-muted-foreground leading-relaxed">
          GrantDesk is intended for lawful business use only. You agree not to misuse the platform,
          attempt to gain unauthorized access to any part of the service, scrape or harvest data in
          bulk, or use the platform for any purpose that violates applicable laws or regulations.
          Abuse of the service may result in immediate account suspension.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
          3. Account Responsibility
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          You are responsible for maintaining the confidentiality of your account credentials,
          including your password. All activity that occurs under your account is your
          responsibility. Please notify us immediately at{" "}
          <a
            href="mailto:legal@grantdesk.ca"
            className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          >
            legal@grantdesk.ca
          </a>{" "}
          if you suspect unauthorized use of your account.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
          4. Grant Information Accuracy
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Grant data displayed on GrantDesk is sourced from public government sources and is
          updated on a regular basis. However, GrantDesk does not guarantee the accuracy,
          completeness, or timeliness of any grant information. Eligibility criteria and deadlines
          can change without notice. Always verify details directly on the official government
          source before submitting an application.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
          5. Intellectual Property
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          The GrantDesk platform, including its design, software, and curated content, is owned by
          GrantDesk and protected by applicable intellectual property laws. You retain full
          ownership of the business profile data and other content you provide. By using the
          service, you grant GrantDesk a limited license to use your data solely to operate and
          improve the platform.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
          6. Limitation of Liability
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          GrantDesk is not liable for missed grant deadlines, incorrect eligibility assessments,
          unsuccessful applications, or any other outcomes resulting from your use of the platform.
          The service is provided on a best-effort basis, and you should not rely solely on
          GrantDesk for time-sensitive or business-critical grant decisions.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">7. Termination</h2>
        <p className="text-muted-foreground leading-relaxed">
          We reserve the right to suspend or terminate accounts that violate these Terms of
          Service, engage in abusive behavior, or are inactive for an extended period. You may
          delete your account at any time through your account settings or by contacting us, and
          your data will be removed in accordance with our Privacy Policy.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">8. Contact</h2>
        <p className="text-muted-foreground leading-relaxed">
          For terms-related inquiries, please contact us at{" "}
          <a
            href="mailto:legal@grantdesk.ca"
            className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          >
            legal@grantdesk.ca
          </a>
          .
        </p>
      </section>
    </div>
  );
}
