import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newSeasonFormSchema } from '@SingleGameApp/shared';
import { useSeasonStore } from '../../../store/useSeasonStore';

function CreateSeasonModal({ isOpen, onClose }) {
  const { createSeason, isCreating } = useSeasonStore();
  //-----FORM FOR CREATE SEASON

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(newSeasonFormSchema),
    defaultValues: {
      name: '',
      startDate: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      await createSeason(data);
      reset(); //clean the form
      onClose();
    } catch (error) {
      console.error('Errore durante la creazione della stagione:', error);
    }
  };

  {
    /* =========================================================================== */
  }
  {
    /* ============== MODALE aPERTURA STAGIONE =================================== */
  }
  {
    /* =========================================================================== */
  }

  return (
    <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box border-2 border-myPrimary">
        {/* Titolo Diverso (Positivo) */}
        <h3 className="text-lg font-bold text-primary">Nuova Stagione</h3>
        <p className="py-2 text-sm text-gray-500">Inserisci i dettagli per iniziare.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-4">
          {/* Nome torneo */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Nome Stagione</span>
            </label>
            <input
              type="text"
              placeholder="Es. Stagione 25-26"
              className={`input-bordered input w-full ${errors.name ? 'input-error' : ''}`}
              {...register('name')}
            />
          </div>

          {/* Data */}

          <div>
            <label className="label">
              <span className="label-text font-semibold">Data Inizio</span>
            </label>
            <input type="date" className="input-bordered input w-full" {...register('startDate')} />
          </div>

          {/* Azioni */}
          <div className="modal-action">
            {/* ANNULLA */}
            <button
              type="button"
              className="btn"
              onClick={() => {
                reset();
                onClose();
              }}
            >
              Annulla
            </button>
            <button type="submit" className="btn btn-primary text-white" disabled={isSubmitting}>
              {isSubmitting ? <span className="loading loading-spinner"></span> : 'Crea Stagione'}
            </button>
          </div>
        </form>
      </div>

      {/* Backdrop per chiudere cliccando fuori */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}

export default CreateSeasonModal;
