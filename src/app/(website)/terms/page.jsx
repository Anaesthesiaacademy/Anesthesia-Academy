import React from "react";

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 pt-24 text-gray-800">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
        Terms & Conditions
      </h1>

      <section className="mb-8">
        <p className="text-lg leading-relaxed">
          Welcome to <strong className="text-blue-600">Anaesthesia Academy</strong>. By accessing or using our
          educational services, courses, and website, you agree to be bound by these Terms and Conditions. Please
          read them carefully.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">1. Use of Our Services</h2>
        <ul className="list-disc list-inside text-lg space-y-2">
          <li>Courses and materials are intended for medical students, residents, and healthcare professionals.</li>
          <li>All content is educational and should not replace clinical judgment or professional advice.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">2. Enrollment & Payments</h2>
        <p className="text-lg leading-relaxed">
          Access to paid services requires enrollment and full payment. You agree to provide accurate and complete information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">3. Refund Policy</h2>
        <p className="text-lg leading-relaxed mb-4">
          At <strong className="text-blue-600">Anaesthesia Academy</strong>, we prioritize your satisfaction.
        </p>
        <ul className="list-disc list-inside text-lg space-y-2">
          <li>Refund requests can be made within <strong>7 days of purchase</strong>.</li>
          <li>Contact us at <a href="mailto:anaesthesiaacademy1@gmail.com" className="text-blue-600">anaesthesiaacademy1@gmail.com</a> with your order details and issue.</li>
          <li>Refunds processed within <strong>7 business days</strong> after approval.</li>
          <li>Refunds unavailable if:
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>More than <strong>30%</strong> of the course has been completed.</li>
              <li>The request is made after <strong>7 days</strong>.</li>
              <li>The course has been downloaded (if applicable).</li>
            </ul>
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">4. Intellectual Property</h2>
        <p className="text-lg leading-relaxed">
          All materials are the property of <strong className="text-blue-600">Anaesthesia Academy</strong> and cannot be copied, distributed, or reproduced without permission.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">5. Liability Disclaimer</h2>
        <p className="text-lg leading-relaxed">
          While we strive for accuracy, <strong className="text-blue-600">Anaesthesia Academy</strong> is not liable for any harm or loss resulting from the use of our material. Always consult a qualified healthcare professional before applying medical techniques.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">6. Changes to These Terms</h2>
        <p className="text-lg leading-relaxed">
          We reserve the right to modify these Terms at any time. Changes take effect immediately upon posting.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">7. Contact Us</h2>
        <p className="text-lg leading-relaxed">
          For any questions or refund requests, contact us at:
        </p>
        <p className="text-lg text-blue-600 mt-2">anaesthesiaacademy1@gmail.com</p>
      </section>
    </main>
  );
}
