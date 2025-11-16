import Player from '../../models/Player.js';

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
