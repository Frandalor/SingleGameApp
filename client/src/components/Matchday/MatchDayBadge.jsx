import { CheckCircle, AlertTriangle, Play, Clock, Settings, Users ,} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import React from 'react';
const Label = ({ children }) => <span className="ml-1 hidden sm:inline">{children}</span>;

function MatchDayBadge({ status, matchDay }) {
  const navigate = useNavigate();

  const handleAction = (e, path) => {
    e.stopPropagation();
    navigate(path);
  };
  const btnBase = 'btn btn-xs gap-1 font-bold border-2 transition-all p-2 ';
  const iconBase = 'h-6 w-6 sm:h-4 sm:w-4';

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
        <button
          onClick={(e) => handleAction(e, `/admin/match-day/${matchDay._id}/match-day-teams`)}
          className={`${btnBase} border-yellow-500 bg-yellow-50 text-yellow-700 hover:border-yellow-500 hover:bg-yellow-500 hover:text-white`}
          title="Visualizza/Modifica Squadre"
        >
          <Settings className={iconBase} />
          <Label>Modifica Squadre</Label>
        </button>
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
