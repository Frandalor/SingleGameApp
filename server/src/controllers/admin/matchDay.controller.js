import MatchDay from '../../models/MatchDay.js';
import Format from '../../models/Format.js';
import { REGULAR_FORMAT } from '../../lib/constants.js';
import { calculatePoints, calculateMatchResult } from '../../lib/utils.js';

//-------------------------MATCH DAY--------------------------------------------------------------

//----------GET ALL MATCHDAY

export const getAllMatchDay = async (req, res) => {
  try {
    //filter lo prendo dalla query ?
    const filter = {};
    if (req.query.season) {
      filter.season = req.query.season;
    }
    const matchDays = await MatchDay.find(filter)
      .sort({ dayNumber: 1 })
      .populate('season', 'name')
      .populate('teams.players', 'player');

    res.status(200).json(matchDays);
  } catch (error) {
    console.error('errore fetching giornate', error);
    res.status(500).json({ message: 'internal error' });
  }
};

//------------GET MATCHDAY

export const getMatchDay = async (req, res) => {
  try {
    const { matchDayId } = req.params;

    const matchDay = await MatchDay.findById(matchDayId)
      .populate('season', 'name startDate endDate') // info stagione
      .populate('teams.players', 'player category state'); // info giocatori

    if (!matchDay) {
      return res.status(404).json({ message: 'Giornata non trovata' });
    }

    res.status(200).json(matchDay);
  } catch (error) {
    console.error('Errore fetching match day:', error);
    res.status(500).json({ message: 'Internal error' });
  }
};

//------------NEW MATCH DAY

export const newMatchDay = async (req, res) => {
  try {
    const format = await Format.findOne({ name: 'regular' });
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
    const maxTeams = format?.maxTeams || REGULAR_FORMAT[maxTeams];
    const maxPlayersPerTeam =
      format?.maxPlayersPerTeam || REGULAR_FORMAT[maxPlayersPerTeam];
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
    const existingPlayers = matchDay.teams.flatMap((t) =>
      t.players.map((p) => p.toString())
    );
    const duplicates = allNewPlayers
      .map((p) => p.toString())
      .filter((p) => existingPlayers.includes(p));
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

//------DELETE TEAM FROM MATCH DAY

export const deleteTeamfromMatchDay = async (req, res) => {
  try {
    const { name } = req.params;
    const { matchDayId } = req.body;

    //trovo giornata

    const matchDay = await MatchDay.findById(matchDayId);
    if (!matchDay) {
      return res.status(404).json({ message: 'Giornata non trovata' });
    }

    // block if matchDay completed

    if (matchDay.status === 'completed') {
      return res.status(400).json({
        message: 'impossibile eliminare squadre: la giornata è terminata',
      });
    }

    const beforeTeamsLength = matchDay.teams.length;

    matchDay.teams = matchDay.teams.filter(
      (t) => t.name.toLowerCase() !== name.toLowerCase
    );

    const afterTeamsLength = matchDay.teams.length;

    if (beforeTeamsLength === afterTeamsLength) {
      return res.status(404).json({ message: 'Squadra non trovata' });
    }

    await matchDay.save();

    res.json({ message: 'squadra eliminata con successo' });
  } catch (error) {
    console.error('errore eliminando squadra', error);
    res.status(500).json({ message: 'internal error' });
  }
};

//--------INSERT RESULTS

export const insertResults = async (req, res) => {
  try {
    const { matchId } = req.params;
    //scores array di oggetti
    const { scores } = req.body;

    const matchDay = await MatchDay.findById(matchId);
    if (!matchDay) {
      return res.status(404).json({
        message: 'Giornata non trovata',
      });
    }
    if (matchDay.status !== 'ready') {
      return res
        .status(400)
        .json({ message: 'le squadre non sono state completate' });
    }

    if (!Array.isArray(scores) || scores.length !== matchDay.teams.length) {
      return res
        .status(400)
        .json({
          message: 'Numero di punteggi non corrispondono al nuemro di squadre',
        });
    }

    matchDay.teams.forEach((team, idx) => {
      team.score = scores[idx].score;
      team.goldenGoal = scores[idx.goldenGoal];
    });
  } catch (error) {}
};
