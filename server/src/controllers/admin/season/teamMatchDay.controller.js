import MatchDay from '../../../models/MatchDay.js';

//----------TEAM INSERTION

export const getAllTeamsDayMatch = async (req, res) => {
  try {
    const { matchDayId } = req.params;
    const matchDay = await MatchDay.findById(matchDayId).populate({
      path: 'teams.players',
      select: 'player',
    });
    if (!matchDay) {
      return res.status(404).json({ message: 'giornata non trovata' });
    }
    res.status(200).json(matchDay.teams);
  } catch (error) {
    console.error('errore nel recuperare le squadre', error);
    res.status(500).json({ message: 'internal error' });
  }
};

export const createTeams = async (req, res) => {
  try {
    const matchDayId = req.params.matchDayId;
    const { teams } = req.body;

    const matchDay = await MatchDay.findById(matchDayId);
    if (matchDay.teams.length >= matchDay.maxTeams) {
      return res
        .status(400)
        .json({ message: 'Numero massimo di squadre già raggiunto' });
    }
    if (!matchDay)
      return res.status(404).json({ message: 'Giornata non trovata' });
    if (matchDay.status === 'pairing-pending')
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
      matchDay.status = 'pairing-pending';
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
    console.log(req.params);
    const { teamId, matchDayId } = req.params;

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

    const teamToDelete = matchDay.teams.id(teamId);
    if (!teamToDelete) {
      return res.status(400).json({ message: 'squadra non trovata' });
    }

    // rimuovo eventuale pairing

    matchDay.pairings.pull({
      $or: [{ teamA: teamId }, { teamB: teamId }],
    });

    matchDay.teams.pull({ _id: teamId });

    if (matchDay.status === 'ready') {
      matchDay.status = 'pending';
    }
    await matchDay.save();

    res.json({ message: 'squadra eliminata con successo' });
  } catch (error) {
    console.error('errore eliminando squadra', error);
    res.status(500).json({ message: 'internal error' });
  }
};
