import React, { useEffect, useState } from 'react';
import MatchDayListTable from './components/MatchDayListTable';
import { useMatchDayStore } from '../../../store/useMatchDayStore';
import Splitter from '../../../components/Splitter';
import Button from '../../../components/Button';
import BackButton from '../../../components/BackButton';

function MatchDayListPage() {
  const { matchDays, fetchMatchDays, isLoading } = useMatchDayStore();

  useEffect(() => {
    fetchMatchDays();
  }, [fetchMatchDays]);

  return (
    <div className="flex flex-col">
      <div>
        <Splitter title="Gestione Giornate" />
        <div className="my-5 mt-6 flex w-full items-center justify-between">
          <div className="w-fit">
            <BackButton />
          </div>

          <div>
            <Button
              text={'Nuova Giornata'}
              onClick={() => console.log('inserire funzione creazione giornata')}
            />
          </div>
        </div>
      </div>
      <MatchDayListTable matchDays={matchDays} isLoading={isLoading} />
    </div>
  );
}

export default MatchDayListPage;
