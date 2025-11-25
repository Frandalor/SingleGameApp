import { use, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getMatchDayListService, getLeaderboardService } from '../services/matchDayService';

const rankings = [
  { id: 1, label: 'Serie A' },
  { id: 2, label: 'Serie B' },
  { id: 3, label: 'Serie C' },
  { id: 4, label: 'Serie D' },
];

function RankingTable({ initialRanking = 1, limit, showButton = true, activeSeasonId }) {
  const [allPlayers, setAllPlayers] = useState([]); // dati grezzi
  const [displayPlayers, setDisplayPlayers] = useState([]); //dati filtrati per clasifica
  const [matchDays, setMatchDays] = useState([]); // tendina
  const [selectedMatchDayId, setSelectedMatchDayId] = useState(''); //giornata selzionata

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Prendo parametro da URL

  const [searchParams, setSearchParams] = useSearchParams();
  const activeRanking = Number(searchParams.get('active-ranking')) || initialRanking;

  // Caricamento Lista Giornate

  useEffect(() => {
    const fetchDays = async () => {
      try {
        const data = await getMatchDayListService(activeSeasonId);
        const validDays = data.filter((d) => ['completed', 'confirmed'].includes(d.status));
        setMatchDays(validDays);
      } catch (error) {
        console.error('errore caricamento giornate', error);
      }
    };
    fetchDays();
  }, [activeSeasonId]);

  // posso aggiungere in futuro una tendina per selezionare activeSeason

  //----------Caricamento Classifica

  useEffect(() => {
    const fetchLeaderBoard = async () => {
      setLoading(true);
      try {
        const data = await getLeaderboardService(activeSeasonId, selectedMatchDayId);
        setAllPlayers(data);
        setError(null);
      } catch (error) {
        setError(error.message || 'errore nel caricamento della classifica');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderBoard();
  }, [activeSeasonId, selectedMatchDayId]);

  //-------FILTRO PER CATEGORIA

  useEffect(() => {
    let filtered = allPlayers.filter((p) => p.category === activeRanking);
    if (limit) {
      filtered = filtered.slice(0, limit);
    }
    setDisplayPlayers(filtered);
  }, [activeRanking, allPlayers]);

  //update state and url
  const handleRankingChange = (id) => {
    setSearchParams({ 'active-ranking': id });
  };

  // Helper per i colori della forma da aggiornare
  const getFormBadge = (result) => {
    switch (result) {
      case 'clearWin':
        return { label: 'Vn', style: 'bg-green-600 text-white border-green-700' }; // Vittoria Netta
      case 'narrowWin':
        return { label: 'Vm', style: 'bg-green-400 text-white border-green-500' }; // Vittoria Misura
      case 'goldenGoalWin':
        return { label: 'GG', style: 'bg-yellow-400 text-yellow-900 border-yellow-500' }; // Golden Goal
      case 'draw':
        return { label: 'P', style: 'bg-gray-400 text-white border-gray-500' }; // Pareggio
      case 'narrowLoss':
        return { label: 'Sm', style: 'bg-red-400 text-white border-red-500' }; // Sconfitta Misura
      case 'loss':
        return { label: 'S', style: 'bg-red-600 text-white border-red-700' }; // Sconfitta
      default:
        return { label: '-', style: 'bg-gray-200 text-gray-500' };
    }
  };

  // in caso di caricamento o errore

  if (loading && allPlayers.length === 0)
    return <div className="animate-pulse p-8 text-center">Caricamento classifica...</div>;
  if (error)
    return (
      <div className="rounded-lg border-2 border-red-200 p-8 text-center text-red-500">{error}</div>
    );

  return (
    <div>
      {/* HEADER: FLEX TRA BOTTONI (SINISTRA) E TENDINA (DESTRA) */}
      <div className="m-1 mb-3 flex flex-wrap items-end justify-between gap-3">
        {/* SINISTRA: Bottoni Categorie */}
        <div className="flex gap-2">
          {showButton &&
            rankings.map((r) => (
              <button
                key={r.id}
                onClick={() => handleRankingChange(r.id)}
                className={`rounded-lg p-2 px-3 text-sm font-semibold transition-colors ${
                  activeRanking === r.id ? 'bg-accent2 text-white' : 'border-2 border-mySecondary'
                }`}
              >
                {r.label}
              </button>
            ))}
        </div>

        {/* DESTRA: Controlli Storico */}
        {matchDays.length > 0 && (
          <div className="ml-auto flex items-center gap-2">
            {' '}
            {/* ml-auto spinge a destra */}
            {/* Pulsante Reset rapido */}
            {selectedMatchDayId !== '' && (
              <button
                onClick={() => setSelectedMatchDayId('')}
                className="whitespace-nowrap text-xs font-bold text-gray-500 underline hover:text-accent2"
              >
                ↺ Torna all'ultima
              </button>
            )}
            {/* Tendina con sfondo mySecondary */}
            <select
              className="min-w-[120px] cursor-pointer rounded-lg border-none bg-mySecondary p-2 text-sm font-medium focus:outline-none"
              value={selectedMatchDayId}
              onChange={(e) => setSelectedMatchDayId(e.target.value)}
            >
              <option value="">Classifica Attuale</option>
              {matchDays.map((day) => (
                <option key={day._id} value={day._id}>
                  Giornata {day.dayNumber}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* TABELLA */}
      <div id="ranking-table" className="overflow-x-hidden rounded-lg border-2 border-mySecondary">
        <table className="table w-full table-auto border-collapse">
          <thead>
            <tr className="bg-mySecondary text-center">
              <th className="p-2">#</th>
              <th className="p-2">
                <span className="flex justify-start pl-2">Player</span>
              </th>
              <th className="p-2">Punti</th>
              <th className="p-2">G</th>
              <th className="hidden p-2 md:table-cell">Vn</th>
              <th className="hidden p-2 md:table-cell">Vm</th>
              <th className="hidden p-2 md:table-cell">GG</th>
              <th className="hidden p-2 md:table-cell">S</th>
              <th className="hidden p-2 md:table-cell">Sm</th>
              <th className="hidden p-2 md:table-cell">P</th>
              <th className="p-2">Forma</th>
            </tr>
          </thead>

          <tbody className="[&>tr>td]:px-2 [&>tr>td]:py-2 [&>tr]:h-12">
            {displayPlayers.map((player, id) => (
              <tr
                key={player._id || id}
                className="border-b-2 border-mySecondary text-center align-middle last:border-b-0"
              >
                {/* Posizione */}
                <td className="w-0.5">
                  <span className="flex aspect-square h-6 w-6 items-center justify-center rounded-sm bg-mySecondary p-1 text-xs font-bold">
                    {id + 1}.
                  </span>
                </td>

                {/* Nome */}
                <td>
                  <span className="flex max-w-[120px] justify-start truncate font-semibold sm:max-w-none">
                    {player.name}
                  </span>
                </td>

                {/* Punti */}
                <td className="text-lg font-bold">{player.points}</td>
                <td>{player.numGames}</td>

                {/* Stats */}
                <td className="hidden text-green-700 md:table-cell">{player.clearWins}</td>
                <td className="hidden text-green-600 md:table-cell">{player.narrowWins}</td>
                <td className="hidden text-yellow-600 md:table-cell">{player.goldenGoalWins}</td>
                <td className="hidden text-red-600 md:table-cell">{player.losses}</td>
                <td className="hidden text-red-400 md:table-cell">{player.narrowLosses || '-'}</td>
                <td className="hidden text-gray-500 md:table-cell">{player.draws}</td>

                {/* Forma (Quadratini con Sigla) */}
                <td>
                  <div className="flex items-center justify-center gap-1">
                    {/* Controllo se player.form esiste e ha elementi */}
                    {player.form && player.form.length > 0 ? (
                      player.form.map((res, k) => {
                        const badge = getFormBadge(res);
                        // Nascondi 4° e 5° su schermi medi, mostrali su XL
                        const visibilityClass = k >= 3 ? 'hidden md:flex' : 'flex';

                        return (
                          <div
                            key={k}
                            className={` ${visibilityClass} h-5 w-5 items-center justify-center rounded border text-[9px] font-bold uppercase leading-none tracking-tighter shadow-sm ${badge.style} `}
                            title={res}
                          >
                            {badge.label}
                          </div>
                        );
                      })
                    ) : (
                      /* Fallback se non ci sono partite giocate */
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {displayPlayers.length === 0 && (
              <tr>
                <td colSpan="11" className="py-4 text-center italic text-gray-500">
                  Nessun dato disponibile.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RankingTable;
