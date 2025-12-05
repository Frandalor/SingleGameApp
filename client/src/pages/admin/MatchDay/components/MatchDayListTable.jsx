import React from 'react';
import Table from '../../../../components/Table';
import { formatDate } from '../../../../lib/utils';

//helper

import MatchDayBadge from '../../../../components/Matchday/MatchDayBadge';
import MatchDayAdminActions from './MatchDayAdminActions';

function MatchDayListTable({ matchDays, isLoading }) {
  // ==========================COLONNE==========================

  const columns = [
    // 1. INDICE

    {
      header: '#',
      className: 'w-12',
      render: (row) => (
        <div className="flex justify-center">
          <span className="flex aspect-square h-6 w-6 items-center justify-center rounded-sm bg-mySecondary p-1 text-xs font-bold">
            {row.dayNumber}
          </span>
        </div>
      ),
    },

    //2. GIORNATA

    {
      header: <span className="flex justify-start pl-2">Giornata</span>,
      render: (row) => (
        <span className="flex justify-start truncate pl-2 font-semibold">
          Giornata {row.dayNumber}
        </span>
      ),
    },

    //3. DATA

    {
      header: 'Data Creazione',
      accessor: 'createdAt',
      className: 'hidden sm:table-cell text-sm text-gray-600',
      cellClassName: 'hidden sm:table-cell text-sm text-gray-500',
      render: (row) => formatDate(row.createdAt),
    },

    //4. STATO
    {
      header: 'Stato',
      render: (row) => (
        <div className="flex items-center justify-center">
          <MatchDayBadge status={row.status} matchDay={row} />
        </div>
      ),
    },

    {
      header: 'Azioni',
      render: (row) => (
        <div className="flex items-center justify-center">
          <MatchDayAdminActions matchDay={row} />
        </div>
      ),
    },
  ];
  return (
    <Table
      data={matchDays}
      columns={columns}
      isLoading={isLoading}
      emptyMessage="Nessuna giornata trovata. Inizia creandone una!"
    />
  );
}

export default MatchDayListTable;
