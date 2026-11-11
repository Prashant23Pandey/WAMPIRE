import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import EventsPage from './pages/EventsPage.jsx';
import TimelinePage from './pages/TimelinePage.jsx';
import PrizesPage from './pages/PrizesPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import Signup from './pages/Signup.jsx';
import VerifyOTP from './pages/VerifyOTP.jsx';
import Login from './pages/Login.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import HackathonRegisterPage from './pages/HackathonRegisterPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ScrollToTop from './components/common/ScrollToTop.jsx';

export function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Main Multi-Page Layout Routes */}
        <Route element={<RootLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/prizes" element={<PrizesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/register" element={<HackathonRegisterPage />} />
          <Route path="/register-hackathon" element={<HackathonRegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Auth Layout Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/verify" element={<VerifyOTP />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<Login />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
