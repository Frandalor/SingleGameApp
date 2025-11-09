import { useEffect, useState } from 'react';
function RankingPageA() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div>
      <h2>Lista giocatori</h2>
      <ul>
        {players.map((p) => (
          <li key={p._id}>{p.player}</li>
        ))}
      </ul>
    </div>
  );
}
export default RankingPageA;
