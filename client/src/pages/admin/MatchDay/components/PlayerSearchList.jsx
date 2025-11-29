import React, { useMemo, useState } from 'react';
import { Search, Plus, User } from 'lucide-react';

function PlayerSearchList({
  players = [],
  onPlayerClick,
  headerTitle,
  isDisabled = false,
  emptyMessage = 'Nessun giocatore disponibile',
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlayers = useMemo(() => {
    return players.filter((p) => {
      if (!p || !p.player) return false;
      return p.player.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [players, searchTerm]);

  return (
    <div className="flex h-full max-h-[30vh] flex-col gap-3 rounded-xl border bg-mySecondary p-4 shadow-md md:max-h-[80vh]">
      {/* HEADER */}

      <div className="flex min-h-[20px] items-center gap-1 truncate text-sm font-bold text-gray-700">
        <User size={16} />
        {headerTitle}
      </div>

      {/* SEARCHBAR */}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 z-30 h-5 w-5 -translate-y-1/2 text-white" />
        <input
          type="text"
          placeholder="Cerca per nome..."
          className="input-bordered input input-sm flex w-full items-center p-5 pl-11 text-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Lista Giocatori */}
      <div className="scrollbar-thin flex min-h-[70px] flex-1 flex-col gap-2 overflow-y-auto pr-1 text-white">
        {filteredPlayers.length === 0 && (
          <div className="py-4 text-center text-xs text-gray-400">
            {searchTerm ? 'Nessun risultato per la ricerca' : emptyMessage}
          </div>
        )}

        {filteredPlayers.map((player) => (
          <div
            key={player._id}
            onClick={() => !isDisabled && onPlayerClick(player)}
            className={`group flex items-center justify-between rounded-lg border border-gray-100 p-2 pl-4 transition-all ${
              isDisabled
                ? 'cursor-not-allowed bg-gray-50 opacity-60'
                : 'hover:bg-primary/5 hover:border-primary/30 cursor-pointer'
            } `}
          >
            <span
              className={`text-md font-medium ${isDisabled ? 'text-gray-500' : 'text-white group-hover:text-primary'}`}
            >
              {player.player}
            </span>

            {/* Icona Plus: visibile solo se abilitato */}
            {!isDisabled && <Plus size={16} className="text-gray-300 group-hover:text-primary" />}
          </div>
        ))}
      </div>

      {/* Footer info se disabilitato */}
      {isDisabled && (
        <div className="mt-auto rounded border border-yellow-100 bg-yellow-50 p-2 pt-2 text-center text-xs text-gray-500">
          Seleziona una squadra per aggiungere.
        </div>
      )}

      {/* END */}
    </div>
  );
}


export default PlayerSearchList;
