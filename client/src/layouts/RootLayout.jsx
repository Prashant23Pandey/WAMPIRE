import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar.jsx';
import Footer from '../components/navigation/Footer.jsx';

export const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 w-full overflow-x-hidden">
      <Navbar />
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
