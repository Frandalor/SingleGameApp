// components/ui/LogoutButton.jsx

import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const { logout, isLoggingOut } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      // Reindirizza l'utente alla pagina di login dopo la disconnessione
      navigate('/');
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="w-full rounded bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50"
    >
      {isLoggingOut ? 'Uscita...' : 'Logout'}
    </button>
  );
}

export default LogoutButton;
