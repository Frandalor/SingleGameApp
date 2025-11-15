import Season from '../models/Season.js';
import Player from '../models/Player.js';
import MatchDay from '../models/MatchDay.js';
import { FORMAT_MAX_TEAMS } from '../lib/constants.js';

//-----------------------------------------------SEASON---------------------------------------------------------------

// --------NEW SEASON

export const newSeason = async (req, res) => {
  try {
    const { name } = req.validatedData;

    // check if there is an open season

    const activeSeason = await Season.findOne({ current: true });
    if (activeSeason) {
      return res.status(400).json({
        message: `esiste gia una stagione attiva, chiudere ${activeSeason.name} per proseguire`,
      });
    }

    // create new season

    const season = new Season({ name, startDate: new Date(), current: true });
    const savedSeason = await season.save();

    res.status(201).json(savedSeason);
  } catch (error) {
    console.error('errore creating new season', error);
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return res
        .status(409)
        .json({ message: 'Il nome della stagione esiste già' });
    }
    res.status(500).json({ message: 'internal error' });
  }
};

// ===========CLOSE SEASON

export const closeSeason = async (req, res) => {
  try {
    const activeSeason = await Season.findOne({ current: true });

    if (!activeSeason) {
      return res.status(400).json({ message: 'non ci sono stagioni attive' });
    }

    activeSeason.endDate = new Date();
    activeSeason.current = false;

    await activeSeason.save();

    res.status(200).json({ message: `${activeSeason.name} terminata` });
  } catch (error) {
    console.error('errore deleting season', error);
    res.status(500).json({ message: 'internal error' });
  }
};

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

//-------------------------MATCH DAY--------------------------------------------------------------

//------------NEW MATCH DAY

export const newMatchDay = async (req, res) => {
  try {
    const { format } = req.body;
    const activeSeason = await Season.findOne({ current: true });
    if (!activeSeason) {
      return res.status(400).json({ message: 'Nessuna stagione attiva' });
    }
    const lastMatchDay = await MatchDay.find({ season: activeSeason._id })
      .sort({ dayNumber: -1 })
      .limit(1);
    const nextNumeberDay = lastMatchDay.length
      ? lastMatchDay[0].dayNumber + 1
      : 1; // [0] perche find restituisce sempre array
    const maxTeams = FORMAT_MAX_TEAMS[format];
    const matchDay = new MatchDay({
      season: activeSeason._id,
      dayNumber: nextNumeberDay,
      format,
      maxTeams,
      status: 'pending',
    });

    const savedMatchDay = await matchDay.save();
    res.status(201).json(savedMatchDay);
  } catch (error) {
    console.error('errore creando nuova giornata', error);
    res.status(500).json({ message: 'internal error' });
  }
};

//----------TEAM INSERTION

export const createTeams = async (req, res) => {
  try {
    const matchDayId = req.params.id;
    const { teams } = req.body;

    const matchDay = await MatchDay.findById(matchDayId);
    if (matchDay.teams.length >= matchDay.maxTeams) {
      return res
        .status(400)
        .json({ message: 'Numero massimo di squadre già raggiunto' });
    }
    if (!matchDay)
      return res.status(404).json({ message: 'Giornata non trovata' });
    if (matchDay.status === 'completed')
      return res.status(400).json({ message: 'Giornata già completa' });

    if (!Array.isArray(teams) || teams.length === 0) {
      return res
        .status(400)
        .json({ message: 'Devi fornire almeno una squadra' });
    }

    // Controllo duplicati interni
    const allNewPlayers = teams.flatMap((t) => t.players);
    const uniquePlayers = new Set(allNewPlayers);
    if (uniquePlayers.size !== allNewPlayers.length) {
      return res
        .status(400)
        .json({ message: 'Ci sono giocatori duplicati tra le squadre' });
    }

    // Controllo duplicati rispetto alle squadre esistenti
    const existingPlayers = matchDay.teams.flatMap((t) => t.players);
    const duplicates = allNewPlayers.filter((p) => existingPlayers.includes(p));
    if (duplicates.length > 0) {
      return res.status(400).json({
        message: `I seguenti giocatori sono stati già inseriti: ${duplicates.join(
          ', '
        )}`,
      });
    }

    // Controllo singole squadre
    for (const team of teams) {
      if (!Array.isArray(team.players) || !team.name) {
        return res.status(400).json({ message: 'Squadra non valida' });
      }
    }

    // Aggiungi le squadre
    matchDay.teams.push(...teams);

    // Aggiorna lo status se raggiunge maxTeams
    if (matchDay.teams.length >= matchDay.maxTeams) {
      matchDay.status = 'ready';
    }

    const savedMatchDay = await matchDay.save();
    res.status(200).json(savedMatchDay);
  } catch (error) {
    console.error('Errore aggiungendo squadra', error);
    res.status(500).json({ message: 'Internal error' });
  }
};
