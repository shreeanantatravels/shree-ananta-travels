"use client";
import { Topbar } from '../components/Topbar';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { ServicesSection } from '../components/ServicesSection';
import { TrendingPackages } from '../components/TrendingPackages';
import { KailashPackages } from '../components/KailashPackages';
import { DomesticPackages } from '../components/DomesticPackages';
import { InternationalPackages } from '../components/InternationalPackages';
import { DestinationsCarousel } from '../components/DestinationsCarousel';
import { PlanTourForm } from '../components/PlanTourForm';
import { WhyTrustUs } from '../components/WhyTrustUs';
import { Testimonials } from '../components/Testimonials';
import { FAQ } from '../components/FAQ';
import { SeoOverviewSection } from '../components/SeoOverviewSection';
import { SocialShareBar } from '../components/SocialShareBar';
import { Footer } from '../components/Footer';
import dynamic from 'next/dynamic';

const LeadCaptureModal = dynamic(() => import('../components/LeadCaptureModal').then(mod => mod.LeadCaptureModal), { ssr: false });
const ChatbotButton = dynamic(() => import('../components/ChatbotButton').then(mod => mod.ChatbotButton), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <Topbar />
      <Navbar />
      <main id="main-content" className="flex-1">
        <HeroSection />
        <ServicesSection />
        <TrendingPackages />
        <KailashPackages />
        <DomesticPackages />
        <InternationalPackages />
        <DestinationsCarousel />
        <PlanTourForm />
        <WhyTrustUs />
        <Testimonials />
        <FAQ />
        <SeoOverviewSection />
        <SocialShareBar />
      </main>
      <Footer />
      <LeadCaptureModal />
      <ChatbotButton />
    </div>
  );
}

