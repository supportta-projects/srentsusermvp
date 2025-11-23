import VendorNavbar from '@/components/vendor/VendorNavbar';
import VendorFooter from '@/components/vendor/VendorFooter';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <VendorNavbar />
      <div className="max-w-4xl mx-auto px-4 py-20 pt-32">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using RentOrent, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Subscription Terms</h2>
            <p>
              Subscriptions are billed in advance on a monthly, 6-month, or yearly basis. All subscriptions automatically renew unless cancelled.
            </p>
            <p>
              You may cancel your subscription at any time. Your access will continue until the end of your current billing period.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Refund Policy</h2>
            <p>
              We offer a 30-day money-back guarantee. If you're not satisfied with RentOrent for any reason, contact us within 30 days of your subscription for a full refund.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Service Level Agreement</h2>
            <p>
              We strive to maintain 99.9% uptime. In case of service interruptions, we will work to restore service as quickly as possible.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. User Responsibilities</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account and password. You agree to notify us immediately of any unauthorized use.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Limitation of Liability</h2>
            <p>
              RentOrent shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Contact</h2>
            <p>
              For questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:support@rentorent.com" className="text-[#DC2626] hover:text-[#B91C1C]">
                support@rentorent.com
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

