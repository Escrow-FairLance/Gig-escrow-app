import React from 'react';
import { Hero } from '../components/home/Hero';
import { StatBanner } from '../components/home/StatBanner';
import { LiveActivityTicker } from '../components/home/LiveActivityTicker';
import { Features } from '../components/home/Features';
import { HowItWorks } from '../components/home/HowItWorks';
import { RoleCTA } from '../components/home/RoleCTA';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <Hero />
      <StatBanner />
      <div className="mt-8">
        <LiveActivityTicker />
      </div>
      <Features />
      <HowItWorks />
      <RoleCTA />
    </div>
  );
}
