import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Settings, Trophy, Edit3, Shuffle } from 'lucide-react';

const Label = ({ children }) => <span className="ml-1 hidden sm:inline">{children}</span>;

function MatchDayAdminActions({ matchDay }) {
  const navigate = useNavigate();

  const handleAction = (e, path) => {
    e.stopPropagation();
    navigate(path);
  };

  const btnBase = 'btn btn-xs gap-1 font-bold border-2 transition-all p-2 ';
  const iconBase = 'h-6 w-6 sm:h-4 sm:w-4';

  switch (matchDay.status) {
    case 'pending':
      return (
        <button
          onClick={(e) => handleAction(e, `/admin/match-day/${matchDay._id}/configure`)}
          className={`${btnBase} border-yellow-500 bg-yellow-50 text-yellow-700 hover:border-yellow-500 hover:bg-yellow-500 hover:text-white`}
          title="Inserisci Squadre"
        >
          <Settings className={iconBase} />
          <Label>Inserisci Squadre</Label>
        </button>
      );

    case 'pairing-pending':
      return (
        <button
          onClick={(e) => handleAction(e, `/admin/match-day/${matchDay._id}/pairings`)}
          className={`${btnBase} border-orange-500 bg-orange-50 text-orange-700 hover:border-orange-500 hover:bg-orange-500 hover:text-white`}
          title="Genera gli accoppiamenti delle partite"
        >
          <Shuffle className={iconBase} />
          <Label>Accoppia Squadre</Label>
        </button>
      );

    case 'ready':
      return (
        <button
          onClick={(e) => handleAction(e, `/admin/match-day/${matchDay._id}/play`)}
          className={`${btnBase} border-blue-600 bg-blue-50 text-blue-700 hover:border-blue-600 hover:bg-blue-600 hover:text-white`}
          title="Conferma giornata"
        >
          <Play className={iconBase} />
          <Label>Conferma</Label>
        </button>
      );
    case 'completed':
      return (
        <button
          onClick={(e) => handleAction(e, `/leaderboard?day=${matchDay.dayNumber}`)}
          className={`${btnBase} border-green-600 bg-green-50 text-green-700 hover:border-green-600 hover:bg-green-600 hover:text-white`}
          title="Visualizza risultati giornata"
        >
          <Trophy className={iconBase} />
          <Label>Visualizza Risultati</Label>
        </button>
      );

    default:
      return <span className="text-xs text-gray-300">-</span>;
  }
}

export default MatchDayAdminActions;
