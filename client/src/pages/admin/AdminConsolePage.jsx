import { Link } from 'react-router-dom';

function AdminConsolePage() {
  return (
    <div className="flex gap-5">
      <div className="rounded-lg bg-accent1 p-6 text-center font-bold shadow-md">
        <Link to={'/admin/season'}>Crea nuova stagione</Link>
      </div>
      <div className="rounded-lg bg-accent1 p-6 text-center font-bold shadow-md">
        <Link to={'/admin/match-day-list'}>Giornate Campionato</Link>
      </div>
    </div>
  );
}

export default AdminConsolePage;
