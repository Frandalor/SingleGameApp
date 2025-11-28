import { CheckCircle, AlertTriangle, Play, Clock, Settings, Users } from 'lucide-react';

import React from 'react';

function MatchDayBadge({ status }) {
  const baseClasses =
    'flex items-center justify-center gap-1.5 rounded border px-2 py-1 text-[10px] font-bold uppercase shadow-sm w-fit mx-auto';

  switch (status) {
    case 'completed':
      return (
        <span className={`${baseClasses} border-green-500 bg-green-100 text-green-800`}>
          <CheckCircle className="h-3 w-3" />
          Completata
        </span>
      );

    case 'ready':
      return (
        <span className={`${baseClasses} border-blue-500 bg-blue-100 text-blue-800`}>
          <Play className="h-3 w-3" />
          Pronta
        </span>
      );
    case 'confirmed':
      return (
        <span className={`${baseClasses} border-cyan-500 bg-cyan-100 text-cyan-800`}>
          <Clock className="h-3 w-3" />
          Squadre Confermate
        </span>
      );
    case 'pairing-pending':
      return (
        <span className={`${baseClasses} border-orange-500 bg-orange-100 text-orange-800`}>
          <Users className="h-3 w-3" />
          Genera Coppie
        </span>
      );
    case 'pending':
    default:
      return (
        <span className={`${baseClasses} border-yellow-500 bg-yellow-100 text-yellow-800`}>
          <Settings className="h-3 w-3" />
          Configurazione
        </span>
      );
  }
}

export default MatchDayBadge;
