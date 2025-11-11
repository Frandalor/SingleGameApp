import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const rankings = [
  { id: 1, label: 'Serie A' },
  { id: 2, label: 'Serie B' },
  { id: 3, label: 'Serie C' },
  { id: 4, label: 'Serie D' },
];

function RankingTable({ initialRanking = 1, limit, showButton = true }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeRanking = Number(searchParams.get('active-ranking')) || initialRanking;

  // loading players
  useEffect(() => {
    async function fetchPlayers() {
      try {
        const response = await fetch('http://localhost:3000/api/players');
        console.log(response);
        if (!response.ok) throw new Error('Errore nella richiesta');
        const data = await response.json();
        setPlayers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPlayers();
  }, []);
  console.log(players);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Errore: {error}</p>;

  //update state and url
  const handleRankingChange = (id) => {
    setSearchParams({ 'active-ranking': id });
  };

  // sort player for table

  const sortedPlayers = players
    .filter((p) => p.category === activeRanking)
    .map((p) => ({
      ...p,
      points: p.clearWins * 3 + (p.narrowWins + p.goldenGoalWins) * 2 + p.narrowLosses,
      numGames: p.clearWins + p.narrowWins + p.goldenGoalWins + p.draws + p.narrowLosses + p.losses,
    }))
    .sort((a, b) => b.points - a.points)
    .slice(0, limit || undefined);

  return (
    <div>
      <div className="m-1 mb-2 flex gap-3">
        {showButton &&
          rankings.map((r) => (
            <button
              key={r.id}
              onClick={() => handleRankingChange(r.id)}
              className={`rounded-lg p-2 ${
                activeRanking === r.id ? 'bg-accent2' : 'border-2 border-mySecondary'
              }`}
            >
              {r.label}
            </button>
          ))}
      </div>

      <div id="ranking-table" className="overflow-x-hidden rounded-lg border-2 border-mySecondary">
        <table className="table table-auto">
          <thead>
            <tr className="bg-mySecondary text-center">
              <th>#</th>
              <th>
                <span className="flex-start flex">Player</span>
              </th>
              <th>Punti</th>
              <th>G</th>
              <th className="hidden md:table-cell">Vn</th>
              <th className="hidden md:table-cell">Vm</th>
              <th className="hidden md:table-cell">GG</th>
              <th className="hidden md:table-cell">S</th>
              <th className="hidden md:table-cell">Sm</th>
              <th className="hidden md:table-cell">P</th>
              <th>Forma</th>
            </tr>
          </thead>
          <tbody className="[&>tr>td]:px-4 [&>tr>td]:py-2 [&>tr]:h-12">
            {sortedPlayers.map((player, id) => (
              <tr
                key={player._id || id}
                className="border-2 border-mySecondary text-center align-middle"
              >
                <th className="w-0.5">
                  <span className="flex aspect-square h-6 w-6 items-center justify-center rounded-sm bg-mySecondary p-1">
                    {id + 1 + '.'}
                  </span>
                </th>
                <td>
                  <span className="flex justify-start">{player.player}</span>
                </td>
                <td>{player.points}</td>
                <td>{player.numGames}</td>
                <td className="hidden md:table-cell">{player.clearWins}</td>
                <td className="hidden md:table-cell">{player.narrowWins}</td>
                <td className="hidden md:table-cell">{player.goldenGoalWins}</td>
                <td className="hidden md:table-cell">{player.losses}</td>
                <td className="hidden md:table-cell">{player.narrowLosses}</td>
                <td className="hidden md:table-cell">{player.draws}</td>
                <td>Forma</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RankingTable;
