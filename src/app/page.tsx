import React from 'react';
import { Hero } from '../components/home/Hero.js';
import { StatBanner } from '../components/home/StatBanner.js';
import { LiveActivityTicker } from '../components/home/LiveActivityTicker.js';
import { Features } from '../components/home/Features.js';
import { HowItWorks } from '../components/home/HowItWorks.js';
import { RoleCTA } from '../components/home/RoleCTA.js';

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
