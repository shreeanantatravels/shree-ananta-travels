"use client";
import React from 'react';
import { Topbar } from '../components/Topbar';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ChatbotButton } from '../components/ChatbotButton';
import { useAgent } from '../context/AgentContext';

export default function TermsConditions() {
  const { siteConfig, agent } = useAgent();
  const displayName = siteConfig?.companyName || agent?.businessName || agent?.name || 'Shree Ananta Travels';
  
  const address = siteConfig?.address || agent?.address || '';
  const phone = siteConfig?.contactPhone || agent?.whatsapp || '';
  const email = siteConfig?.contactEmail || agent?.email || '';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans selection:bg-[var(--theme-primary)]/30">
      <Topbar />
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-20 lg:py-28">
        <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Terms & Conditions</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-10 text-lg">
          By using the services provided by {displayName}, you agree to the following terms and conditions. Please read this document carefully.
        </p>

        <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed text-lg bg-white dark:bg-gray-900 p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800">
          
          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Booking and Reservations</h3>
            <ul className="space-y-3 list-none">
              <li><strong>1.1.</strong> To book travel services through {displayName}, you must provide accurate and complete information.</li>
              <li><strong>1.2.</strong> {displayName} reserves the right to accept or reject bookings at its discretion.</li>
              <li><strong>1.3.</strong> The availability and pricing of travel services are subject to change without notice.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Payments and Cancellations</h3>
            <ul className="space-y-3 list-none">
              <li><strong>2.1.</strong> Payment terms and cancellation policies vary depending on the specific travel service. It is your responsibility to understand and adhere to these terms.</li>
              <li><strong>2.2.</strong> {displayName} is not responsible for any charges, fees, or penalties imposed by third-party service providers (e.g., airlines, hotels) in the event of cancellations or modifications.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Travel Documents</h3>
            <ul className="space-y-3 list-none">
              <li><strong>3.1.</strong> It is your responsibility to ensure you possess the required travel documents, such as passports, visas, and identification, for your journey. {displayName} is not responsible for any issues related to travel document requirements.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Privacy and Data Security</h3>
            <ul className="space-y-3 list-none">
              <li><strong>4.1.</strong> {displayName} values your privacy. We collect, store, and process your personal information in accordance with our Privacy Policy.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Liability</h3>
            <ul className="space-y-3 list-none">
              <li><strong>5.1.</strong> {displayName} is not liable for any personal injury, property damage, loss, delay, or other issues that may occur during your travel, including those caused by third-party service providers.</li>
              <li><strong>5.2.</strong> {displayName}'s liability is limited to the fees paid for our services.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Changes to Terms and Conditions</h3>
            <ul className="space-y-3 list-none">
              <li><strong>6.1.</strong> {displayName} reserves the right to modify these terms and conditions at any time. The updated terms will be posted on our website with the date of the last update.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Governing Law</h3>
            <ul className="space-y-3 list-none">
              <li><strong>7.1.</strong> These terms and conditions are governed by and constructed in accordance with the laws of Himachal Pradesh. Any disputes arising from or in connection with these terms shall be subject to the exclusive jurisdiction of the courts of Himachal Pradesh.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Contact Information</h3>
            <p className="mb-4">If you have any questions or concerns about these Terms and Conditions, please contact us at:</p>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl space-y-3">
              <p><strong>Contact Address:</strong> {address}</p>
              <p><strong>Contact Phone Number:</strong> {phone}</p>
              <p><strong>Contact Email:</strong> <a href={`mailto:${email}`} className="text-[var(--theme-primary)] hover:underline">{email}</a></p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <ChatbotButton />
    </div>
  );
}
