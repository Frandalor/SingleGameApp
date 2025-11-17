import MatchDay from '../../models/MatchDay.js';
import Format from '../../models/Format.js';
import Season from '../../models/Season.js';
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
    const { formatId } = req.body;

    const format = await Format.findById(formatId);
    const activeSeason = await Season.findOne({ current: true });
    if (!activeSeason) {
      return res.status(400).json({ message: 'Nessuna stagione attiva' });
    }
    const lastMatchDay = await MatchDay.find({ season: activeSeason._id })
      .sort({ dayNumber: -1 })
      .limit(1);
    if (lastMatchDay.status !== 'completed') {
      return res
        .status(400)
        .json({ message: "L'ultima giornata non è ancora completata" });
    }
    const nextNumeberDay = lastMatchDay.length
      ? lastMatchDay[0].dayNumber + 1
      : 1; // [0] perche find restituisce sempre array
    const maxTeams = format?.maxTeams || REGULAR_FORMAT[maxTeams];
    const maxPlayersPerTeam =
      format?.maxPlayersPerTeam || REGULAR_FORMAT[maxPlayersPerTeam];
    const matchDay = new MatchDay({
      season: activeSeason._id,
      dayNumber: nextNumeberDay,
      format: format._id,
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

//--------INSERT RESULTS

export const insertResults = async (req, res) => {
  try {
    const { matchDayId } = req.params;
    // Il frontend deve inviare: { "results": [ { "pairingId": "...", "scoreA": 5, "scoreB": 2, ... }, ... ] }
    const { results } = req.body;

    if (!Array.isArray(results) || results.length === 0) {
      return res.status(400).json({ message: 'Formato risultati non valido' });
    }

    const matchDay = await MatchDay.findById(matchDayId);
    if (!matchDay) {
      return res.status(404).json({ message: 'Giornata non trovata' });
    }

    if (matchDay.status !== 'ready') {
      return res.status(400).json({
        message: 'La giornata non è pronta per i risultati (stato non "ready")',
      });
    }

    //-------UPDATE PAIRING RESULT

    for (const result of results) {
      const pairing = matchDay.pairings.id(result.pairingId);

      if (pairing) {
        pairing.scoreA = result.scoreA;
        pairing.scoreB = result.scoreB;
        pairing.goldenGoal = result.goldenGoal || false;
      } else {
        return res.status(404).json({
          message: `accoppiamento con id ${result.pairingId} non trovato`,
        });
      }
    }

    // CALCULATE RESULTS
    matchDay.pairings = calculateMatchResult(matchDay.pairings);

    // SET MATCH DAY STATUS

    matchDay.status = 'completed';

    // UPDATE PLAYER RESULTS

    matchDay.playerResult = [];
  } catch (error) {
    console.error('errore inserendo risultati', error);
    res.status(500).json({ message: 'internal error' });
  }
};

export const confirmPlayers = async (req, res) => {
  try {
    const { matchDayId } = req.params;
    const matchDay = await MatchDay.findById(matchDayId);
    if (!matchDay) {
      return res.status(4404).json({ message: 'Giornata non trovata' });
    }

    if (matchDay.status !== 'ready') {
      return res.status(400).json({
        message: `La giornata is not ready`,
      });
    }
    matchDay.playerResult = [];

    // itarate on every player of every team
    for (const team of matchDay.teams) {
      for (const playerId of team.players) {
        matchDay.playerResult.push({
          player: playerId,
          result: 'pending',
          points: 0,
          usedJolly: false,
        });
      }
    }

    const savedMatchDay = await matchDay.save();
    res.status(201).json({
      message: `Lista giocatori confermata. Creato/aggiornato l'elenco in 'playerResult' (${savedMatchDay.playerResult.length} giocatori).`,
      playerResult: savedMatchDay.playerResult,
    });
  } catch (error) {
    console.error('Errore confermando i giocatori', error);
    res.status(500).json({ message: 'Internal error' });
  }
};
