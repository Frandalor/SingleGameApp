import MatchDay from '../../models/MatchDay.js';

//-----------------CREATE PAIRINGS

export const createPairings = async (req, res) => {
  try {
    const { matchDayId } = req.params;
    //mandare dal frontend oggetto { "pairings": [ { "teamA": "id...", "teamB": "id..." }, ... ] }
    const { pairings } = req.body;
    if (!Array.isArray(pairings) || pairings.length === 0) {
      return res
        .status(400)
        .json({ message: 'formato accoppiamenti non valido' });
    }

    const matchDay = await MatchDay.findById(matchDayId);
    if (!matchDay) {
      return res.status(404).json({ message: 'giornata non trovata' });
    }

    // check if it is ready for pairing

    if (matchDay.status !== 'pairing-pending') {
      return res.status(400).json({
        message: 'la giornata non è pronta per gli accoppiamenti',
      });
    }
    // all teams are inserted?

    if (matchDay.teams.length !== matchDay.maxTeams) {
      return res.status(400).json({
        message: 'Il roster non è completo. Impossibile creare accoppiamenti.',
      });
    }
    // -------------------VALIDAZIONE-----------------------------------------------------
    const allTeamsId = matchDay.teams.map((t) => t._id.toString());
    // crep registro con tutti i team gia accoppiati
    const pairedTeamsId = new Set();
    matchDay.pairings.forEach((p) => {
      pairedTeamsId.add(p.teamA.toString());
      pairedTeamsId.add(p.teamB.toString());
    });

    for (const p of pairings) {
      const teamAId = p.teamA?.toString();
      const teamBId = p.teamB?.toString();
      // controllo che gli id delle squadre esistano nella giornata

      if (!allTeamsId.includes(teamAId) || !allTeamsId.includes(teamBId)) {
        return res
          .status(400)
          .json({ message: 'uno degli id squadra non esiste nella giornata' });
      }

      // Controllo che  i team non siano uguali
      if (teamAId === teamBId) {
        return res.status(400).json({
          message: 'una squadra non può essere accoppiata con se stessa',
        });
      }

      // controllo che un team non sia in un altro pairing

      if (pairedTeamsId.has(teamAId) || pairedTeamsId.has(teamBId)) {
        return res
          .status(400)
          .json({ message: 'una delle squadre è già stata accoppiata' });
      }

      pairedTeamsId.add(teamAId);
      pairedTeamsId.add(teamBId);
    }
    // =============================================================================

    //===================AGGIORNAMENTO DATI

    matchDay.pairings.push(...pairings);

    // verifica cambio stato in matchday

    const totalTeams = matchDay.teams.length;
    const totalPairedTeams = matchDay.pairings.flatMap((p) => [
      p.teamA,
      p.teamB,
    ]).length;

    if (totalPairedTeams === totalTeams) {
      matchDay.status = 'ready';
    }

    const savedMatchDay = await matchDay.save();
    res.status(201).json(savedMatchDay);
  } catch (error) {
    console.error('Errore creando accoppiammenti', error);
    res.status(500).json({ message: 'internal error' });
  }
};

//-----------------------RESET PAIRING

export const resetPairing = async (req, res) => {
  try {
    const { matchDayId } = req.params;

    const matchDay = await MatchDay.findById(matchDayId);
    if (!matchDay) {
      return res.status(404).json({ message: 'giornata non trovata' });
    }

    if (matchDay.status === 'completed') {
      return res
        .status(400)
        .json({ message: 'impossibile cancellare: giornata terminata' });
    }
    if (matchDay.pairings.length === 0) {
      return res.status(400).json({
        message: 'impossibile cancellare: nessun accoppiamento presente',
      });
    }

    matchDay.pairings = [];
    if (matchDay.status === 'ready' || matchDay.status === 'confirmed') {
      matchDay.status = 'pairing-pending';
    }
    const savedMatchDay = await matchDay.save();
    res.status(200).json(savedMatchDay);
  } catch (error) {
    console.error('Errore resettando accoppiamenti', error);
    res.status(500).json({ message: 'internal error' });
  }
};

//-----------------GET ALL PAIRINGS

export const getAllPairings = async (req, res) => {
  try {
    const { matchDayId } = req.params;

    const matchDay = await MatchDay.findById(matchDayId).populate({
      path: 'teams.players',
      select: 'player',
    });
    if (!matchDay) {
      return res.status(404).json({ message: 'giornata non trovata' });
    }

    const populatePairings = matchDay.pairings.map((pairing) => {
      const teamA = matchDay.teams.id(pairing.teamA);
      const teamB = matchDay.teams.id(pairing.teamB);

      return {
        _id: pairing._id,
        teamA: {
          _id: teamA ? teamA.id : null,
          name: teamA ? teamA.name : 'squadra non presente',
          players: teamA ? teamA.players : [],
        },
        teamB: {
          _id: teamB ? teamB.id : null,
          name: teamB ? teamB.name : 'squadra non presente',
          players: teamB ? teamB.players : [],
        },
        scoreA: pairing.scoreA,
        scoreB: pairing.scoreB,
        goldenGoal: pairing.goldenGoal,
      };
    });

    res.status(200).json(populatePairings);
  } catch (error) {
    console.error('Errore fetching pairings:', error);
    res.status(500).json({ message: 'internal error' });
  }
};
