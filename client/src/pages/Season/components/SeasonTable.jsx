import { formatDate } from '../../../lib/utils';
import { CheckCircle, AlertTriangle, Power } from 'lucide-react';

// NOTA: Aggiunto "seasons = []" per evitare il crash su .length
const SeasonsTable = ({ seasons = [], onCloseSeason, isClosing }) => {
  return (
    <div className="overflow-x-hidden rounded-lg border-2 border-mySecondary">
      <table className="table w-full table-auto border-collapse">
        {/* HEADER */}
        <thead>
          <tr className="bg-mySecondary text-center">
            <th className="w-12 p-2">#</th>
            <th className="p-2">
              <span className="flex justify-start pl-2">Nome Stagione</span>
            </th>
            <th className="hidden p-2 sm:table-cell">Inizio</th>
            <th className="hidden p-2 sm:table-cell">Fine</th>
            <th className="p-2">Stato</th>
            <th className="p-2">Azioni</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody className="[&>tr>td]:px-1 [&>tr>td]:py-2 [&>tr]:h-12">
          {/* Ora questo controllo è sicuro perché seasons è almeno [] */}
          {!Array.isArray(seasons) || seasons.length === 0 ? (
            <tr>
              <td colSpan="6" className="py-4 text-center italic text-gray-500">
                Nessuna stagione trovata.
              </td>
            </tr>
          ) : (
            seasons.map((season, index) => (
              <tr
                key={season._id}
                className="border-b-2 border-mySecondary text-center align-middle transition-colors last:border-b-0 hover:bg-white/50"
              >
                {/* Indice */}
                <td className="w-0.5">
                  <span className="flex aspect-square h-6 w-6 items-center justify-center rounded-sm bg-mySecondary p-1 text-xs font-bold">
                    {index + 1}.
                  </span>
                </td>

                {/* Nome Stagione */}
                <td>
                  <span
                    className="flex justify-start truncate pl-2 font-semibold"
                    title={season.name}
                  >
                    {season.name}
                  </span>
                </td>

                {/* Data Inizio */}
                <td className="hidden text-sm sm:table-cell">{formatDate(season.startDate)}</td>

                {/* Data Fine */}
                <td className="hidden text-sm sm:table-cell">
                  {season.endDate ? formatDate(season.endDate) : '-'}
                </td>

                {/* Stato */}
                <td>
                  <div className="flex items-center justify-center">
                    {season.current ? (
                      <span className="flex items-center gap-1 rounded border border-green-500 bg-green-400 px-2 py-1 text-[10px] font-bold uppercase text-yellow-900 shadow-sm">
                        <AlertTriangle className="h-3 w-3" />
                        In Corso
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded border border-gray-700 bg-gray-600 px-2 py-1 text-[10px] font-bold uppercase text-white shadow-sm">
                        <CheckCircle className="h-3 w-3" />
                        Conclusa
                      </span>
                    )}
                  </div>
                </td>

                {/* Azioni */}
                <td>
                  <div className="flex items-center justify-center">
                    {season.current ? (
                      <button
                        onClick={() => onCloseSeason(season._id)}
                        disabled={isClosing}
                        className="group flex items-center gap-1 rounded-lg border-2 border-red-500 bg-red-50 px-3 py-1 text-xs font-bold text-red-600 transition-all hover:bg-red-500 hover:text-white disabled:opacity-50"
                      >
                        {isClosing ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          <>
                            <Power className="h-3 w-3" />
                            <span className="hidden md:inline">Termina</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SeasonsTable;
