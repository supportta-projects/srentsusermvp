import VendorNavbar from '@/components/vendor/VendorNavbar';
import VendorFooter from '@/components/vendor/VendorFooter';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <VendorNavbar />
      <div className="max-w-4xl mx-auto px-4 py-20 pt-32">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Account information (name, email, phone number)</li>
              <li>Business information (shop name, address, GST number)</li>
              <li>Payment information (processed securely through Razorpay)</li>
              <li>Usage data and analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information. All data is encrypted in transit using SSL/TLS encryption.
            </p>
            <p>
              Payment information is processed securely through Razorpay and is not stored on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Retention</h2>
            <p>
              We retain your information for as long as your account is active or as needed to provide services. You may request deletion of your data at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. GDPR Compliance</h2>
            <p>
              We comply with the General Data Protection Regulation (GDPR). If you are located in the European Economic Area (EEA), you have certain data protection rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Third-Party Services</h2>
            <p>
              We use third-party services including Firebase (for data storage) and Razorpay (for payments). These services have their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Changes to Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Contact</h2>
            <p>
              For questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:info@supporttasolutions.com" className="text-[#DC2626] hover:text-[#B91C1C]">
                info@supporttasolutions.com
              </a>
            </p>
          </section>

          <p className="text-sm text-gray-500 mt-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
      <VendorFooter />
    </div>
  );
}

