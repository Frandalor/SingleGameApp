import React, { useEffect, useState } from 'react';
import MatchDayListTable from './components/MatchDayListTable';
import { useMatchDayStore } from '../../../store/useMatchDayStore';
import Splitter from '../../../components/Splitter';
import Button from '../../../components/Button';
import BackButton from '../../../components/BackButton';

function MatchDayListPage() {
  const { matchDays, fetchMatchDays, isLoading, isCreating, newMatchDay } = useMatchDayStore();

  useEffect(() => {
    fetchMatchDays();
  }, [fetchMatchDays]);

  const handleCreateClick = async () => {
    await newMatchDay();
  };

  return (
    <div className="flex flex-col">
      <div>
        <Splitter title="Gestione Giornate" />
        <div className="my-5 mt-6 flex w-full items-center justify-between">
          <div className="w-fit">
            <BackButton />
          </div>

          <div>
            <Button text={'Nuova Giornata'} onClick={handleCreateClick} disabled={isCreating} />
          </div>
        </div>
      </div>
      <MatchDayListTable matchDays={matchDays} isLoading={isLoading} />
    </div>
  );
}

export default MatchDayListPage;
