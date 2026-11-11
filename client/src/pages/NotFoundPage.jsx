import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';
import Button from '../components/common/Button.jsx';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-[#000000] text-white tech-grid-dark">
      <div className="w-16 h-16 rounded-2xl bg-neutral-950 border border-[#FF007F]/40 flex items-center justify-center text-[#FF007F] mb-6 shadow-glow-pink-sm">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-6xl font-black text-white font-mono mb-2">404</h1>
      <h2 className="text-xl font-serif font-bold text-white mb-2">Coordinates Not Found</h2>
      <p className="text-sm text-neutral-400 font-sans max-w-md mb-8">
        The coordinates you entered do not exist on the WAMPIRE portal grid. The route might have moved or the URL is incorrect.
      </p>
      <div className="flex gap-4">
        <Link to="/">
          <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />} className="font-mono text-xs uppercase tracking-wider font-bold">
            Return to Arena
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
