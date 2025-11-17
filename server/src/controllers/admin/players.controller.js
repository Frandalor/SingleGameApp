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
    const playerId = req.params.id;
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
    const playerId = req.params.id;
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
