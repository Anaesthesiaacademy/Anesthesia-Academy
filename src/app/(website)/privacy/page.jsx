import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-12 pt-24 text-gray-800">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
        Privacy Policy
      </h1>

      <section className="mb-8">
        <p className="text-lg leading-relaxed">
          At <strong className="text-blue-600">Anaesthesia Academy</strong>,
          your privacy is important to us. This policy explains how we collect,
          use, and protect your personal information when you visit or use our
          services, whether online or in person.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Information We Collect
        </h2>
        <ul className="list-disc list-inside text-lg space-y-2">
          <li>Your name, email address, and contact information.</li>
          <li>Details you provide when registering for courses or events.</li>
          <li>Payment information when purchasing courses or materials.</li>
          <li>Any feedback, inquiries, or communication you share with us.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          How We Use Your Information
        </h2>
        <ul className="list-disc list-inside text-lg space-y-2">
          <li>To provide, manage, and improve our educational services.</li>
          <li>To process your registrations, payments, and course access.</li>
          <li>To communicate updates, offers, and important announcements.</li>
          <li>To respond to your inquiries and provide customer support.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Data Protection and Security
        </h2>
        <p className="text-lg leading-relaxed">
          We take appropriate measures to protect your personal data from
          unauthorized access, disclosure, or misuse. Your payment details are
          handled securely through trusted third-party providers, and we never
          store your card information on our servers.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Refund Policy
        </h2>
        <p className="text-lg leading-relaxed">
          We are committed to providing high-quality educational content. If you
          experience a problem accessing a course, encounter technical issues,
          or believe you are entitled to a refund, please contact us within{" "}
          <strong>7 days</strong> of your purchase. We will review your case and
          offer a full or partial refund where appropriate.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Your Rights
        </h2>
        <p className="text-lg leading-relaxed">
          You have the right to access, correct, or request deletion of your
          personal data held by us. To exercise these rights, please contact us
          via email or through our website.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Contact Information
        </h2>
        <p className="text-lg leading-relaxed">
          If you have any questions about this Privacy Policy or how we handle
          your data, feel free to reach out:
        </p>
        <p className="text-lg leading-relaxed mt-2">
          📧 Email:
          <a
            href="mailto:anaesthesiaacademy1@gmail.com"
            className="text-blue-600 underline"
          >
            anaesthesiaacademy1@gmail.com
          </a>
        </p>
        <p className="text-lg leading-relaxed mt-2">
          📞 Phone:
          <a href="tel:+201091091620" className="text-blue-600 underline">
            +201091091620
          </a>
        </p>
      </section>
    </main>
  );
}
