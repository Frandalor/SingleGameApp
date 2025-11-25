import React, { use, useEffect, useState } from 'react';
import SeasonsTable from '../../components/SeasonTable';
import { useSeasonStore } from '../../store/useSeasonStore';
import Splitter from '../../components/Splitter';
import Button from '../../components/Button';
import toast from 'react-hot-toast';
function SeasonPage() {
  const { getAllSeason, seasons, isLoading, closeSeason, isClosing, createSeason, isCreating } =
    useSeasonStore();

  // CONCLUDI STAGIONE--------------

  const [confirmText, setConfirmText] = useState('');
  const [idToClose, setIdToClose] = useState(null);
  const MAGIC_WORD = 'confermo';

  //------NUOVA STAGIONE----------------

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newSeasonName, setNewSeasonName] = useState('');
  const [newSeasonStartDate, setNewSeasonStartDate] = useState('');

  const handleConfirmCreate = async () => {
    if (!newSeasonName.trim()) {
      return toast.error('Il nome della stagione è obbligatorio.');
    }

    await createSeason({
      name: newSeasonName,
      startDate: newSeasonStartDate,
    });

    setIsCreateOpen(false);
    setNewSeasonName('');
    setNewSeasonStartDate('');
  };

  useEffect(() => {
    getAllSeason();
  }, [getAllSeason]);

  const handleOpenModal = (seasonId) => {
    setIdToClose(seasonId);
    setConfirmText('');
  };

  const handleConfirmClose = async () => {
    if (confirmText !== MAGIC_WORD) {
      toast.error(
        `Devi digitare la parola magica "${MAGIC_WORD}" per confermare la chiusura della stagione.`,
      );
      return;
    }

    if (idToClose) {
      await closeSeason(idToClose);
      setIdToClose(null);
      setConfirmText('');
    }
  };
  const isButtonEnabled = confirmText === MAGIC_WORD && !isClosing;

  //--------------------------------------------------------------------------------------------------
  //--------------------------------- RENDERING -----------------------------------------------------
  //--------------------------------------------------------------------------------------------------
  return (
    <div className="flex flex-col">
      <div>
        <Splitter title="Gestione Stagioni" />
        <SeasonsTable seasons={seasons} onCloseSeason={handleOpenModal} isClosing={isClosing} />
        <div className="my-6 flex justify-end">
          <Button text={'Nuova Stagione'} onClick={() => setIsCreateOpen(true)} />
        </div>

        {/* =========================================================================== */}
        {/* ============== MODALE CHIUSURA STAGIONE =================================== */}
        {/* =========================================================================== */}

        <dialog className={`modal ${idToClose ? 'modal-open' : ''}`}>
          <div className="modal-box border-2 border-mySecondary">
            {/* Titolo */}
            <h3 className="text-lg font-bold text-error">Chiusura Stagione In Corso</h3>

            {/* Testo */}
            <p className="py-4">
              Stai per terminare questa stagione. L'operazione è irreversibile. Sei sicuro di voler
              procedere?
            </p>

            <div className="alert alert-warning mb-4 shadow-sm">
              <span className="text-xs">
                Per confermare, scrivi <strong>{MAGIC_WORD}</strong> qui sotto.
              </span>
            </div>

            <input
              type="text"
              placeholder={`Scrivi "${MAGIC_WORD}"`}
              className="input-bordered input w-full"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              onPaste={(e) => e.preventDefault()}
            />

            {/* Pulsanti (Modal Action) */}
            <div className="modal-action">
              {/* Tasto ANNULLA */}
              <button className="btn" onClick={() => setIdToClose(null)} disabled={isClosing}>
                Annulla
              </button>

              {/* Tasto CONFERMA */}
              <button
                className="btn btn-error text-white"
                onClick={handleConfirmClose}
                disabled={!isButtonEnabled}
              >
                {isClosing ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Chiusura...
                  </>
                ) : (
                  'Conferma Chiusura'
                )}
              </button>
            </div>
          </div>

          {/* BACKDROP: Questo permette di chiudere cliccando fuori */}
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setIdToClose(null)}>close</button>
          </form>
        </dialog>
        {/* --- FINE MODALE --- */}
      </div>
      {/* =========================================================================== */}
      {/* ============== MODALE aPERTURA STAGIONE =================================== */}
      {/* =========================================================================== */}
      <dialog className={`modal ${isCreateOpen ? 'modal-open' : ''}`}>
        <div className="modal-box border-2 border-myPrimary">
          {/* Titolo Diverso (Positivo) */}
          <h3 className="text-lg font-bold text-primary">Nuova Stagione</h3>
          <p className="py-2 text-sm text-gray-500">Inserisci i dettagli per iniziare.</p>

          {/* FORM INPUT */}
          <div className="mt-4 flex flex-col gap-4">
            {/* Campo Nome */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Nome Stagione</span>
              </label>
              <input
                type="text"
                placeholder="Es. Torneo Inverno 2025"
                className="input-bordered input w-full"
                value={newSeasonName}
                onChange={(e) => setNewSeasonName(e.target.value)}
                autoFocus // Mette il cursore qui appena apri
              />
            </div>

            {/* Campo Data (Opzionale) */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Data Inizio</span>
              </label>
              <input
                type="date"
                className="input-bordered input w-full"
                value={newSeasonStartDate}
                onChange={(e) => setNewSeasonStartDate(e.target.value)}
              />
            </div>
          </div>

          {/* AZIONI */}
          <div className="modal-action">
            {/* Tasto Annulla */}
            <button className="btn" onClick={() => setIsCreateOpen(false)}>
              Annulla
            </button>

            {/* Tasto Crea */}
            <button
              className="btn btn-primary text-white"
              onClick={handleConfirmCreate}
              disabled={!newSeasonName || isCreating} // Disabilitato se manca il nome
            >
              {isCreating ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Creazione...
                </>
              ) : (
                'Crea Stagione'
              )}
            </button>
          </div>
        </div>

        {/* Backdrop per chiudere cliccando fuori */}
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsCreateOpen(false)}>close</button>
        </form>
      </dialog>
    </div>
  );
}

export default SeasonPage;
