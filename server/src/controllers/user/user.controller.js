import MatchDay from '../../models/MatchDay.js';
import Player from '../../models/Player.js';

export const playJolly = async (req, res) => {
  try {
    const { matchDayId } = req.params;
    const loggedInUserId = req.user._id;

    const player = await Player.findOne({ user: loggedInUserId });
    //-----controllo se utente ha giocatore collegato
    if (!player) {
      return res.status(403).json({
        message: 'azione non autorizata: account non collegato a giocatore',
      });
    }
    //----- controlla se giocatore ha jolly disponibili
    if (player.jolly <= 0) {
      return res.status(400).json({
        message: 'non hai jolly disponibili',
      });
    }

    // trovo la giornata
    const matchDay = await MatchDay.findById(matchDayId);
    if (!matchDay) {
      return res.status(404).json({ message: 'Giornata non trovata' });
    }

    // finestra in cui giocare il jolly
    if (matchDay.status !== 'ready') {
      return res.status(400).json({
        message: `È troppo tardi o troppo presto: la giornata non è in fase 'ready' (stato: ${matchDay.status}).`,
      });
    }

    //controllo che il giocatore sia nei team
    const isPlayerInRoster = matchDay.teams.some((team) =>
      team.players.some((playerId) => playerId.equals(player._id))
    );

    if (!isPlayerInRoster) {
      return res.status(404).json({
        message: 'Non sei in nessun team per questa giornata.',
      });
    }

    //decremento jolly
    await Player.updateOne({ _id: player._id }, { $inc: { jolly: -1 } });

    try {
      await MatchDay.updateOne(
        { _id: matchDayId },
        { $addToSet: { jollyPlayedBy: player._id } }
      );

      // 2c. TUTTO OK! Entrambe le operazioni riuscite.
      res
        .status(200)
        .json({ message: 'Jolly attivato! Sarà confermato con la giornata.' });
    } catch (matchDayError) {
      // 2d. ERRORE! L'aggiornamento della giornata è fallito.
      // Eseguiamo il ROLLBACK (ridiamo il jolly al giocatore)
      console.error(
        'ERRORE CRITICO: Rollback del jolly in corso...',
        matchDayError
      );

      await Player.updateOne(
        { _id: player._id },
        { $inc: { jolly: 1 } } // Ridai il jolly
      );

      // Invia l'errore originale
      throw matchDayError;
    }
    // aggiungo ID
    await MatchDay.updateOne(
      { _id: matchDayId },
      { $addToSet: { jollyPlayedBy: player._id } } // addto set garantisce unicita
    );

    res
      .status(200)
      .json({ message: 'Jolly attivato! Sarà confermato con la giornata.' });
  } catch (error) {
    console.error('Errore giocando il jolly', error);
    res.status(500).json({ message: 'Internal error' });
  }
};
