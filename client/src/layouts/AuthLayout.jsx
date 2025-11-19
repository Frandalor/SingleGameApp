import React from 'react';
import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <main className="bg-myPrimary">
      <Outlet />
    </main>
  );
}

export default AuthLayout;
