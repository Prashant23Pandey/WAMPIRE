import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';
import Button from '../components/common/Button.jsx';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-6 shadow-soft-sm">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-6xl font-black text-slate-900 font-mono mb-2">404</h1>
      <h2 className="text-xl font-extrabold text-slate-800 mb-2">Page Not Found</h2>
      <p className="text-sm text-slate-600 max-w-md mb-8">
        The coordinates you entered do not exist on the CODE-A-NOVA portal grid. The route might have moved or the URL is incorrect.
      </p>
      <div className="flex gap-4">
        <Link to="/">
          <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
            Return to Portal Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
