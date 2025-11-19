import { Loader } from 'lucide-react';
import React from 'react';

function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader className="size-10 animate-spin" />
    </div>
  );
}

export default PageLoader;
