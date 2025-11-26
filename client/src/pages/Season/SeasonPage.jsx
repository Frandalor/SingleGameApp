import React, { useState, useEffect } from 'react';
import SeasonsTable from './components/SeasonTable';
import { useSeasonStore } from '../../store/useSeasonStore';
import Splitter from '../../components/Splitter';
import Button from '../../components/Button';
import CloseSeasonModal from './components/CloseSeasonModal';
import CreateSeasonModal from './components/CreateSeasonModal';

function SeasonPage() {
  const { getAllSeason, seasons, isClosing } = useSeasonStore();

  // Apertura/Chiusura modali
  const [idToClose, setIdToClose] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    getAllSeason();
  }, [getAllSeason]);

  //--------------------------------------------------------------------------------------------------
  //--------------------------------- RENDERING -----------------------------------------------------
  //--------------------------------------------------------------------------------------------------
  return (
    <div className="flex flex-col">
      <div>
        <Splitter title="Gestione Stagioni" />

        {/* TABLE */}
        <SeasonsTable
          seasons={seasons}
          onCloseSeason={(id) => setIdToClose(id)}
          isClosing={isClosing}
        />

        {/* NUOVA STAGIONE */}
        <div className="my-6 flex justify-end">
          <Button text={'Nuova Stagione'} onClick={() => setIsCreateOpen(true)} />
        </div>

        {/* MODALI */}
        <CreateSeasonModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
        <CloseSeasonModal seasonId={idToClose} onClose={() => setIdToClose(null)} />
      </div>
    </div>
  );
}

export default SeasonPage;
