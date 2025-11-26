import React from 'react';
import { useState, useEffect } from 'react';
import { useSeasonStore } from '../../../store/useSeasonStore';
import toast from 'react-hot-toast';

const MAGIC_WORD = 'confermo';

function CloseSeasonModal({ seasonId, onClose }) {
  const { closeSeason, isClosing } = useSeasonStore();
  const [confirmText, setConfirmText] = useState('');

  useEffect(() => {
    if (!seasonId) setConfirmText('');
  }, [seasonId]);

  const handleConfirmClose = async () => {
    if (confirmText !== MAGIC_WORD) {
      toast.error(
        `Devi digitare la parola magica "${MAGIC_WORD}" per confermare la chiusura della stagione.`,
      );
      return;
    }

    if (seasonId) {
      await closeSeason(seasonId);
      onClose();
      setConfirmText('');
    }
  };

  const isOpen = !!seasonId;
  const isButtonEnabled = confirmText === MAGIC_WORD && !isClosing;
  //--------------------------------------------------------------------------------------------------
  //--------------------------------- RENDERING -----------------------------------------------------
  //--------------------------------------------------------------------------------------------------
  return (
    <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
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
          <button className="btn" onClick={onClose} disabled={isClosing}>
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
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}

export default CloseSeasonModal;
