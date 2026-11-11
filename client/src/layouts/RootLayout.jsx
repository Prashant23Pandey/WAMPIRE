import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar.jsx';
import Footer from '../components/navigation/Footer.jsx';

export const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#000000] w-full overflow-x-hidden tech-grid-light">
      <Navbar />
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
