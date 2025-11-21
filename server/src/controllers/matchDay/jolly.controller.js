import MatchDay from '../../models/MatchDay.js';
import Player from '../../models/Player.js';

export const playJollyForPlayer = async (req, res) => {
  try {
    const { playerId, matchDayId } = req.params;

    //check player exists

    const player = await Player.findById(playerId);

    if (!player) {
      return res.status(404).json({ message: 'Giocatore non trovato' });
    }

    // check jolly available
    if (player.jolly <= 0) {
      return res.status(400).json({ message: 'jolly non sufficienti' });
    }

    //check match day

    const matchDay = await MatchDay.findById(matchDayId);

    if (!matchDay) {
      return res.status(400).json({ message: 'Giornata non trovata' });
    }

    // check if matchday is ready

    if (matchDay.status !== 'ready') {
      return res.status(403).json({
        message: 'Impossibile assegnare jolly, partita non pronta',
      });
    }

    // check if player is in matchday

    const isPlayerInMatchDay = matchDay.teams.some((team) =>
      team.players.some((pObjId) => pObjId.toString() === playerId)
    );

    if (!isPlayerInMatchDay) {
      return res
        .status(404)
        .json({ message: 'Giocatore non presente nella giornata' });
    }

    //  -----inizio transazione critica ----> da modificare in atomica

    await Player.updateOne({ _id: playerId }, { $inc: { jolly: -1 } });
    try {
      await MatchDay.updateOne(
        { _id: matchDayId },
        { $addToSet: { jollyPlayedBy: playerId } }
      );
      res.status(200).json({
        message: `Jolly attivato per il giocatore ${
          player.name || playerId
        }. Jolly rimanenti: ${player.jolly - 1}.`,
      });
    } catch (matchDayError) {
      console.error(
        'ERRORE CRITICO: Rollback del jolly in corso...',
        matchDayError
      );
      await Player.updateOne({ _id: playerId }, { $inc: { jolly: 1 } });
      throw matchDayError;
    }
  } catch (error) {
    console.error('Errore assegnando il jollly (admin)', error);
    res.status(500).json({ message: 'internal error' });
  }
};
