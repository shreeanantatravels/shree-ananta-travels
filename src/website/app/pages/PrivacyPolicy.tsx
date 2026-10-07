"use client";
import React from 'react';
import { Topbar } from '../components/Topbar';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ChatbotButton } from '../components/ChatbotButton';
import { useAgent } from '../context/AgentContext';

export default function PrivacyPolicy() {
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
        <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Privacy Policy for {displayName}</h1>
        
        <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed text-lg bg-white dark:bg-gray-900 p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800">
          
          <p className="mb-6">
            At {displayName}, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, disclose, and protect the data we gather from our website visitors and clients. By using our services and visiting our website, you consent to the practices described in this policy.
          </p>
          
          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Information We Collect</h3>
            <p className="mb-4">We may collect the following types of information when you interact with our website and services:</p>
            
            <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">a. Personal Information:</h4>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Name</li>
              <li>Contact information (email address, phone number)</li>
              <li>Mailing address</li>
              <li>Payment information (only when booking services)</li>
            </ul>

            <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">b. Non-Personal Information:</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>IP address</li>
              <li>Cookies and usage data</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. How We Use Your Information</h3>
            <p className="mb-4">We use the information we collect for the following purposes:</p>

            <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">a. Providing Services:</h4>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>To facilitate travel bookings and reservations.</li>
              <li>To communicate with you regarding your bookings, inquiries, or requests.</li>
            </ul>

            <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">b. Improving Our Services:</h4>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>To analyze and enhance the quality of our services.</li>
              <li>To customize your experience on our website.</li>
            </ul>

            <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">c. Marketing and Promotions:</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>To send you promotional materials, offers, and updates (with your consent).</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Disclosure of Information</h3>
            <p className="mb-4">We may disclose your information to third parties under the following circumstances:</p>

            <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">a. Service Providers:</h4>
            <p className="mb-4">We may share your information with third-party service providers who help us deliver our services, such as hotels, airlines, and transportation providers.</p>

            <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">b. Legal Requirements:</h4>
            <p>We may disclose your information when required by law, or in response to a legal process.</p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Data Security</h3>
            <p>We take reasonable precautions to protect your personal information from unauthorized access, disclosure, or alteration. We use industry-standard security measures to safeguard your data.</p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Cookies</h3>
            <p>We use cookies to enhance your experience on our website. You can adjust your browser settings to control or disable cookies, but this may affect the functionality of the site.</p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Your Rights</h3>
            <p>You have the right to access, correct, or delete your personal information. If you would like to exercise these rights or have any concerns about your data, please contact us at <a href={`mailto:${email}`} className="text-[var(--theme-primary)] hover:underline">{email}</a>.</p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Changes to this Privacy Policy</h3>
            <p>We reserve the right to modify this Privacy Policy at any time. The updated policy will be posted on our website with the date of the last update.</p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Contact Us</h3>
            <p className="mb-4">If you have any questions or concerns about our Privacy Policy, please contact us at:</p>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl space-y-3">
              <p><strong>Add:</strong> {address}</p>
              <p><strong>Ph No.:</strong> {phone}</p>
              <p><strong>Email:</strong> <a href={`mailto:${email}`} className="text-[var(--theme-primary)] hover:underline">{email}</a></p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <ChatbotButton />
    </div>
  );
}
