import React from 'react';
import { Link } from 'react-router-dom';
import RankingTable from './RankingTable';

function CardClassifica({ title = 'Serie A', ranking, teleport }) {
  return (
    <div className="flex w-full flex-col rounded-xl border-2 border-mySecondary p-3">
      <span className="p-2 text-xl font-semibold">{title}</span>
      <RankingTable initialRanking={ranking} showButton={false} limit={3} />
      <Link
        onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}
        to={`/classifiche?active-ranking=${ranking}`}
        className="flex justify-end p-2"
      >
        <span className="py1 mt-0.5 rounded-md bg-accent2 px-2 py-1 font-medium">vai...</span>
      </Link>
    </div>
  );
}

export default CardClassifica;
