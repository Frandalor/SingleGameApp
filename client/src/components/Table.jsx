import React from 'react';

/**
 * Tabella Riutilizzabile
 * * @param {object[]} data - Array di oggetti dati (es. users, seasons).
 * @param {boolean} [isLoading=false] - Mostra scheletro di caricamento.
 * @param {string} [emptyMessage="Nessun dato"] - Messaggio se data è vuoto.
 * @param {function} [onRowClick] - (row) => void. Clic sulla riga intera.
 * * @param {object[]} columns - Configurazione Colonne:
 * - header: string | JSX (Titolo colonna)
 * - accessor?: string (Chiave oggetto da mostrare, es "name")
 * - render?: (row) => JSX (Funzione custom render, vince su accessor) 
 * - className?: string (Classi per TH, es: "w-10 hidden sm:block")
 * - cellClassName?: string (Classi per TD, es: "text-right")
 */

function Table({
  data = [],
  columns = [],
  isLoading = false,
  emptyMessage = 'Nessun dato Trovato',
  onRowclick = null,
}) {
  if (isLoading) {
    return (
      <div className="w-full animate-pulse space-y-2 rounded-lg border-2 border-mySecondary p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 w-full rounded bg-gray-200 opacity-50"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden rounded-lg border-2 border-mySecondary">
      <table className="table w-full table-auto border-collapse">
        {/* ======================HEADER====================================== */}

        <thead>
          <tr className="bg-mySecondary text-center">
            {columns.map((col, index) => (
              <th key={index} className={`p-2 ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* =========================BODY===================================== */}

        <tbody className="[&>tr>td]:px-1 [&>tr>td]:py-2 [&>tr]:h-12">
          {!Array.isArray(data) || data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-4 text-center italic text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row._id || rowIndex}
                onClick={() => onRowclick && onRowclick(row)}
                className={`border-b-2 border-mySecondary text-center align-middle transition-colors last:border-b-0 hover:bg-white/50 ${onRowclick ? 'cursor-pointer' : ''}`}
              >
                {columns.map((col, colIndex) => (
                  <td key={`${rowIndex}-${colIndex}`} className={col.cellClassName || ''}>
                    {col.render ? col.render(row, rowIndex) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
