import Button from './Button';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import React from 'react';

function BackButton({ label = 'Indietro', fallBackRoute = '/', ...props }) {
  const location = useLocation();

  const navigate = useNavigate();

  const handleGoBack = () => {
    let currentPath = location.pathname;

    // tolgo residui alla fine di /

    if (currentPath.endsWith('/')) {
      currentPath = currentPath.slice(0, -1);
    }

    const lastSlashIndex = currentPath.lastIndexOf('/');

    if (lastSlashIndex <= 0) {
      navigate(fallBackRoute);
      return;
    }

    const parentPath = currentPath.substring(0, lastSlashIndex);

    navigate(parentPath);
  };
  return (
    <div>
      <Button
        text={
          <span className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> {label}
          </span>
        }
        onClick={handleGoBack}
        {...props}
      />
    </div>
  );
}

export default BackButton;
