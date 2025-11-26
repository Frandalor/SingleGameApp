import MatchDay from '../../models/MatchDay.js';
import Format from '../../models/Format.js';
import Season from '../../models/Season.js';
import { REGULAR_FORMAT } from '../../lib/constants.js';
import { calculatePoints, calculateMatchResult } from '../../lib/utils.js';
import mongoose, { Types } from 'mongoose';
import { logger } from '../../lib/logger.js';

//-------------------------MATCH DAY--------------------------------------------------------------

//----------GET ALL MATCHDAY

export const getAllMatchDay = async (req, res) => {
  try {
    //filter lo prendo dalla query ?
    const { season, fields } = req.query;
    const filter = {};
    if (season) {
      filter.season = season;
    }
    let query = MatchDay.find(filter).sort({ dayNumber: 1 });

    if (fields) {
      const fieldsList = fields.split(',').join(' ');
      query = query.select(fieldsList);
    } else {
      query = query
        .populate('season', 'name')
        .populate('teams.players', 'player');
    }

    const matchDays = await query;
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
    if (lastMatchDay.length > 0 && lastMatchDay.status !== 'completed') {
      return res
        .status(400)
        .json({ message: "L'ultima giornata non è ancora completata" });
    }
    const nextNumeberDay = lastMatchDay.length
      ? lastMatchDay[0].dayNumber + 1
      : 1; // [0] perche find restituisce sempre array
    const maxTeams = format?.maxTeams || REGULAR_FORMAT.maxTeams;
    const maxPlayersPerTeam =
      format?.maxPlayersPerTeam || REGULAR_FORMAT.maxPlayersPerTeam;
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

    if (matchDay.status === 'completed') {
      return res.status(400).json({
        message: 'I risultati di questa giornata sono già stati inseriti',
      });
    }

    if (matchDay.status !== 'confirmed') {
      return res.status(400).json({
        message: 'La giornata non è stata confermata',
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

    for (const pairing of matchDay.pairings) {
      const teamA = matchDay.teams.id(pairing.teamA);
      const teamB = matchDay.teams.id(pairing.teamB);

      for (const playerDoc of teamA.players) {
        //cerco giocarore in playerResults
        const playerEntry = matchDay.playerResult.find((pr) =>
          pr.player.equals(playerDoc)
        );
        if (playerEntry) {
          const hasJolly = playerEntry.usedJolly;
          const points = calculatePoints(pairing.resultA, hasJolly);
          // update data

          playerEntry.result = pairing.resultA;
          playerEntry.points = points;
        }
      }
      for (const playerDoc of teamB.players) {
        //cerco giocarore in playerResults
        const playerEntry = matchDay.playerResult.find((pr) =>
          pr.player.equals(playerDoc._is)
        );
        if (playerEntry) {
          const hasJolly = player.Entry.usedJolly;
          const points = calculatePoints(pairing.resultB, hasJolly);
          // update data

          playerEntry.result = pairing.resultB;
          playerEntry.points = points;
        }
      }
    }
    const savedMatchDay = await matchDay.save();

    res.status(200).json(savedMatchDay);
  } catch (error) {
    console.error('errore inserendo risultati', error);
    res.status(500).json({ message: 'internal error' });
  }
};

//------------------CONFIRM PLAYERS

export const confirmPlayers = async (req, res) => {
  try {
    const { matchDayId } = req.params;
    const matchDay = await MatchDay.findById(matchDayId);
    if (!matchDay) {
      return res.status(404).json({ message: 'Giornata non trovata' });
    }

    if (matchDay.status !== 'ready') {
      return res.status(400).json({
        message: `La giornata is not ready`,
      });
    }
    matchDay.playerResult = [];
    //registro dei jolly
    const jollySet = new Set(matchDay.jollyPlayedBy.map((id) => id.toString()));
    // itarate on every player of every team
    for (const team of matchDay.teams) {
      for (const playerId of team.players) {
        const hasJolly = jollySet.has(playerId.toString());
        matchDay.playerResult.push({
          player: playerId,
          result: 'pending',
          points: 0,
          usedJolly: hasJolly,
        });
      }
    }

    matchDay.status = 'confirmed';

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

export const getLeaderboard = async (req, res) => {
  try {
    const { season, matchDayId } = req.validatedData.query || {};

    let seasonId = season;

    //se non ho nessuna season prendo quella corrente

    if (!seasonId) {
      const activeSeason = await Season.findOne({ current: true });
      if (!activeSeason) {
        return res
          .status(404)
          .json({ message: 'Nessuna stagione attiva trovata' });
      }
      seasonId = activeSeason._id;
    }

    //Filtro

    let dayLimitFilter = {};
    if (matchDayId) {
      const targetMatchDay = await MatchDay.findById(matchDayId);
      if (targetMatchDay) {
        dayLimitFilter = { dayNumber: { $lte: targetMatchDay.dayNumber } };
      }
    }

    const pipeline = [
      //filtro delle giornate valide
      {
        $match: {
          season: new mongoose.Types.ObjectId(seasonId),
          status: { $in: ['completed', 'confirmed'] },
          ...dayLimitFilter,
        },
      },
      //da un documento ne creo n per ogni player result
      { $unwind: '$playerResult' },
      //raggruppo per giocatore
      {
        $group: {
          _id: '$playerResult.player',
          points: { $sum: '$playerResult.points' },

          //conto le presenze
          numGames: { $sum: 1 },

          //con delle condizioni conto i risultati

          clearWins: {
            $sum: {
              $cond: [{ $eq: ['$playerResult.rusult', 'clearWin'] }, 1, 0],
            },
          },
          // Quante Vittorie Misura (Vm)?
          narrowWins: {
            $sum: {
              $cond: [{ $eq: ['$playerResult.result', 'narrowWin'] }, 1, 0],
            },
          },

          // Quante Golden Goal (GG)?
          goldenGoalWins: {
            $sum: {
              $cond: [{ $eq: ['$playerResult.result', 'goldenGoalWin'] }, 1, 0],
            },
          },
          narrowLosses: {
            $sum: {
              $cond: [{ $eq: ['$playerResult.result', 'narrowLoss'] }, 1, 0],
            },
          },
          draws: {
            $sum: {
              $cond: [{ $eq: ['$playerResult.result', 'draw'] }, 1, 0],
            },
          },
          losses: {
            $sum: {
              $cond: [{ $eq: ['$playerResult.result', 'loss'] }, 1, 0],
            },
          },

          allResults: { $push: '$playerResult.result' },
        },
      },

      // Recupero il nome del giocatore
      {
        $lookup: {
          from: 'players',
          localField: '_id',
          foreignField: '_id',
          as: 'playerInfo',
        },
      },

      { $unwind: '$playerInfo' },

      //fomatto uscita

      {
        $project: {
          _id: 1, // 1 significa includi campo
          name: '$playerInfo.player',
          category: '$playerInfo.category',
          points: 1,
          numGames: 1,
          clearWins: 1,
          narrowWins: 1,
          goldenGoalWins: 1,
          losses: 1,
          narrowLosses: 1,
          draws: 1,
          form: { $slice: ['$allResults', -5] },
        },
      },

      //ordino
      { $sort: { points: -1 } },
    ];

    const leaderboard = await MatchDay.aggregate(pipeline);
    res.status(200).json(leaderboard);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'errore classifica' });
  }
};
