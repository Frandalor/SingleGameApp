import Player from '../../models/Player.js';
import User from '../../models/User.js';

//------------------------------------------PLAYERS------------------------------------------------

//--------VISUALIZZA PLAYERS

export const getPlayers = async (req, res) => {
  try {
    //creo filtro per richiedere player da query ?state=....

    const filter = {};

    if (req.query.state) {
      filter.state = req.query.state;
    }

    const players = await Player.find(filter);

    res.status(200).json(players);
  } catch (error) {
    console.error('errore fetching players', error);
    res.status(500).json({ message: 'internal error' });
  }
};

//-------AGGIUNGERE PLAYER

export const addPlayer = async (req, res) => {
  try {
    const { player, category, balance, jolly, diffidato, contacts } =
      req.validatedData;

    // player already exist check

    const existingPlayer = await Player.findOne({ player });
    if (existingPlayer) {
      return res.status(409).json({ message: 'giocatore già presente' });
    }

    const newPlayer = new Player({
      player,
      category,
      balance,
      jolly,
      diffidato,
      contacts,
    });

    const savedPlayer = await newPlayer.save();
    res.status(201).json(savedPlayer);
  } catch (error) {
    console.error('Errore nel salvataggio del giocatore', error);
    res.status(500).json({ message: 'internal error' });
  }
};

// ------MODIFICA PLAYER

export const modifyPlayer = async (req, res) => {
  try {
    // cerco id selezionato dalla query
    const playerId = req.params.playerId;
    if (!playerId) {
      return res.status(400).json({ message: 'ID giocatore mancante' });
    }
    const updates = req.validatedData;

    // remove undefined data before saving updates

    Object.keys(updates).forEach(
      (key) => updates[key] === undefined && delete updates[key]
    );

    const updatedPlayer = await Player.findByIdAndUpdate(
      playerId,
      updates,
      { new: true, runValidators: true } // new serve per ricevere documento aggiornato
    ); // runvalidator serve per runnare i validator che nella modifica non si avviano

    if (!updatedPlayer) {
      return res.status(404).json({ message: 'giocatore non trovato' });
    }

    res.status(200).json(updatedPlayer);
  } catch (error) {
    console.error('errore nella modifica dei dati', error);
    res.status(500).json({ message: 'internal error' });
  }
};

//----------------SET PLAYER STATE

export const setPlayerState = async (req, res) => {
  try {
    const playerId = req.params.playerId;
    const { state } = req.body; // ci aspettiamo 'active' o 'deactivated'

    if (!['active', 'inactive', 'diffidato'].includes(state)) {
      return res.status(400).json({ message: 'Stato non valido' });
    }

    const updatedPlayer = await Player.findByIdAndUpdate(
      playerId,
      { state },
      { new: true, runValidators: true }
    );

    if (!updatedPlayer) {
      return res.status(404).json({ message: 'Giocatore non trovato' });
    }

    res.status(200).json(updatedPlayer);
  } catch (error) {
    console.error('Errore nello stato del giocatore', error);
    res.status(500).json({ message: 'Internal error' });
  }
};

//---------------------LINK PLAYER TO USER

export const linkPlayerToUser = async (req, res) => {
  try {
    const { playerId } = req.params;
    const { userId } = req.body;

    // Trova il giocatore
    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ message: 'Giocatore non trovato' });
    }

    // Trova l'utente
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    // Controlla se il giocatore è già collegato a un altro utente
    if (player.user && player.user.toString() !== userId) {
      console.warn(
        `Il giocatore ${player.player} è già collegato a un altro utente.`
      );
    }
    // Controlla se l'utente è già collegato a un altro giocatore
    const otherPlayer = await Player.findOne({ user: userId });

    if (otherPlayer && otherPlayer._id.toString() !== playerId) {
      return res.status(400).json({
        message: `Errore: L'utente ${user.email} è già collegato al giocatore ${otherPlayer.player}.`,
      });
    }
    // Collega l'utente al giocatore
    player.user = userId;
    await player.save();

    res.status(200).json({
      message: `Giocatore ${player.player} collegato all'utente ${user.email}`,
    });
  } catch (error) {
    console.error("Errore nel collegamento del giocatore all'utente", error);
    res.status(500).json({ message: 'Internal error' });
  }
};

//-------------------------UPDATE JOLLY BALANCE

export const updateJollyBalance = async (req, res) => {
  const { updates } = req.body;
  const successfulUpdates = [];
  const failedUpdates = [];

  try {
    //mantiene in memoria le promises su cui lavorare, necess perche async

    const updatePromises = updates.map(async ({ playerId, amount }) => {
      try {
        //provo ad aggiornare jolly per ogni giocatore
        const updatedPlayer = await Player.findOneAndUpdate(
          { _id: playerId },
          { $inc: { jolly: amount } },
          {
            new: true,
            runValidators: true,
          }
        );

        // se non trovo il giocatore

        if (!updatedPlayer) {
          throw new Error('Giocatore non trovato');
        }

        //push dei giocatori modificati con successo dentro array

        successfulUpdates.push({ playerId, newJolly: updatedPlayer.jolly });
      } catch (err) {
        // per i player su cui e fallito
        const reason =
          err.name === 'ValidationError'
            ? `Errore di validazione: ${err.message}`
            : err.message;

        // li butto dentro arrai failed
        failedUpdates.push({ playerId, amount, reason });
      }
    });

    await Promise.all(updatePromises); //per mandare in parallelo tutte le promises

    res.status(200).json({
      message: `${successfulUpdates.length} Jolly aggiornati con successo. ${failedUpdates.length} fallimenti.`,
      successful: successfulUpdates,
      failed: failedUpdates,
    });
  } catch (error) {
    console.error("Errore globale durante l'aggiornamento Jolly:", error);
    // Errore generico 500
    res.status(500).json({
      message: "Errore interno del server durante l'esecuzione del batch.",
    });
  }
};

//----------------------RESET JOLLY

export const resetJollyforAll = async (req, res) => {
  // ✅ 1. Destrutturazione: si aspetta solo 'playerIds' dal body (grazie a Zod)
  const { playerIds } = req.body;

  const successfulResets = [];
  const failedResets = [];

  try {
    // 2. Creazione delle Promesse di Azzeramento
    const resetPromises = playerIds.map(async (playerId) => {
      try {
        // Operazione atomica: usa $set per impostare il saldo a 0 in modo assoluto.
        const updatedPlayer = await Player.findOneAndUpdate(
          { _id: playerId },
          { $set: { jolly: 0 } },
          { new: true } // Restituisce il documento aggiornato
        );

        if (!updatedPlayer) {
          throw new Error('Giocatore non trovato.');
        }

        // Traccia il successo
        successfulResets.push({ playerId, newJolly: 0 });
      } catch (error) {
        // Traccia il fallimento (senza interrompere Promise.all)
        failedResets.push({ playerId, reason: error.message });
      }
    });

    // 3. Esecuzione Parallela e Attesa
    await Promise.all(resetPromises);

    // 4. Risposta
    res.status(200).json({
      message: `${successfulResets.length} Saldi Jolly azzerati con successo. ${failedResets.length} fallimenti.`,
      successful: successfulResets,
      failed: failedResets,
    });
  } catch (error) {
    console.error(
      "Errore globale durante l'azzeramento Jolly in batch:",
      error
    );
    res.status(500).json({ message: 'Errore interno del server.' });
  }
};

