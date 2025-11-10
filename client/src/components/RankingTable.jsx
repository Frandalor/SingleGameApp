import React from 'react'
import { useEffect, useState } from 'react';

function RankingTable() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeRanking, setActiveRanking] = useState(1)

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
        <div className='flex gap-3 [&>button]:bg-mySecondary [&>button]:rounded-lg [&>button]:p-2 m-1 '>
            <button onClick={()=>setActiveRanking(1)}>Serie A</button>
            <button onClick={()=>setActiveRanking(2)}>Serie B</button>
            <button onClick={()=>setActiveRanking(3)}>Serie C</button>
            <button onClick={()=>setActiveRanking(4)}>Serie D</button>
           
        </div>
 <div className="overflow-x-hidden rounded-lg border-mySecondary border-2">
  <table className="table table-auto">
    <thead>
      <tr className='text-center bg-mySecondary'>
        <th>#</th>
        <th><span className='flex flex-start'>Player</span></th>
        <th>Punti</th>
        <th>G</th>
        <th className='hidden md:table-cell'>Vn</th>
        <th className='hidden md:table-cell'>Vm</th>
        <th className='hidden md:table-cell'>GG</th>
        <th className='hidden md:table-cell'>S</th>
        <th className='hidden md:table-cell'>Sm</th>
        <th className='hidden md:table-cell'>P</th>
        <th>Forma</th>
      </tr>
    </thead>
    <tbody className='[&>tr]:h-12 [&>tr>td]:px-4 [&>tr>td]:py-2'>

      {players.filter(p=> p.category === activeRanking)
      .map(p => ({...p, points:p.clearWins*3 +
                (p.narrowWins
                    + p.goldenGoalWins)*2
                + p.narrowLosses, numGames: p.clearWins+ p.narrowWins + p.goldenGoalWins + p.draws + p.narrowLosses + p.losses})).sort((a,b)=> b.points - a.points).map((player, id)=>(
        <tr key={player._id || id} className='text-center align-middle border-2 border-mySecondary'>
            <th className='w-0.5'>
                <span className='bg-mySecondary  rounded-sm p-1  aspect-square flex justify-center items-center w-6 h-6'>{id + 1 + '.'}</span>
                
                </th>
            <td><span className='flex justify-start'>{player.player}</span></td>
            <td>{player.points}</td>
            <td>{player.numGames}</td>
            <td className='hidden md:table-cell'>{player.clearWins}</td>
            <td className='hidden md:table-cell'>{player.narrowWins}</td>
            <td className='hidden md:table-cell'>{player.goldenGoalWins}</td>
            <td className='hidden md:table-cell'>{player.losses}</td>
            <td className='hidden md:table-cell'>{player.narrowLosses}</td>
            <td className='hidden md:table-cell'>{player.draws}</td>
            <td>Forma</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
    </div>
  )
}

export default RankingTable