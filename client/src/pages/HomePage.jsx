import React from 'react';
import HeroSection from '../components/landing/HeroSection.jsx';
import EventOverview from '../components/landing/EventOverview.jsx';
import EventHighlights from '../components/landing/EventHighlights.jsx';
import TimelineSection from '../components/landing/TimelineSection.jsx';
import PrizesSection from '../components/landing/PrizesSection.jsx';
import AboutSection from '../components/landing/AboutSection.jsx';
import ContactSection from '../components/landing/ContactSection.jsx';

export const HomePage = () => {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Event Overview */}
      <EventOverview />

      {/* 3. Event Highlights */}
      <EventHighlights />

      {/* 4. Hackathon Timeline */}
      <TimelineSection />

      {/* 5. Prizes Section */}
      <PrizesSection />

      {/* 6. About Section */}
      <AboutSection />

      {/* 7. Contact Section */}
      <ContactSection />
    </div>
  );
};

export default HomePage;
