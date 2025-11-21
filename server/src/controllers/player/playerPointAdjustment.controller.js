import PlayerPointAdjustment from '../../models/PlayerPointAdjustment.js';
import MatchDay from '../../models/MatchDay.js';
import Player from '../../models/Player.js';

//----------------------ASSIGN PENALTY / ADJUSTMENT

export const assignPointAdjustments = async (req, res) => {
  // Ci aspettiamo un array di oggetti: [{ playerId, points, description, matchDayId? }]
  const { adjustments } = req.body;
  const successfulAdjustments = [];
  const failedAdjustments = [];

  try {
    const lastMatchDay = await MatchDay.findOne().sort({ _id: -1 });
    if (!lastMatchDay) {
      return res.status(400).json({
        message:
          'Nessuna giornata trovata. Impossibile assegnare penalità/bonus.',
      });
    }

    // Creiamo le promesse per processare ogni richiesta in parallelo
    const adjustmentPromises = adjustments.map(async (item) => {
      const { playerId, points, description, matchDayId } = item;

      try {
        // 1. Verifica esistenza giocatore
        const player = await Player.findById(playerId);
        if (!player) {
          throw new Error(`Giocatore con ID ${playerId} non trovato.`);
        }

        // 2. Crea il record nello storico (PlayerPointAdjustment)
        // Nota: 'points' può essere negativo (penalità) o positivo (bonus)
        const newAdjustment = await PlayerPointAdjustment.create({
          player: playerId,
          points: points,
          description: description,
          matchDay: lastMatchDay._id, // Opzionale
        });

        // 3. Aggiorna il saldo (balance) del giocatore
        // Usiamo $inc per sommare algebricamente (se points è -3, sottrae 3)
        const updatedPlayer = await Player.findByIdAndUpdate(
          playerId,
          { $inc: { balance: points } },
          { new: true }
        );

        // 4. Traccia successo
        successfulAdjustments.push({
          playerId,
          newBalance: updatedPlayer.balance,
          adjustmentId: newAdjustment._id,
        });
      } catch (error) {
        // Traccia fallimento specifico per questo giocatore
        failedAdjustments.push({
          playerId: item.playerId, // Potrebbe essere undefined se l'input era malformato, ma col validator a monte siamo sicuri
          reason: error.message,
        });
      }
    });

    // Eseguiamo tutto
    await Promise.all(adjustmentPromises);

    // Risposta finale
    res.status(200).json({
      message: `Operazione completata. ${successfulAdjustments.length} aggiornamenti riusciti, ${failedAdjustments.length} falliti.`,
      successful: successfulAdjustments,
      failed: failedAdjustments,
    });
  } catch (error) {
    console.error("Errore globale durante l'assegnazione penalità:", error);
    res.status(500).json({
      message:
        "Errore interno del server durante l'assegnazione delle penalità.",
    });
  }
};

//-------------------Get alla adjustments

export const getAllPointAdjustments = async (req, res) => {
  try {
    const adjustments = await PlayerPointAdjustment.find()
      .populate('player', 'name email') // Popola il campo 'player' con nome ed email
      .populate('matchDay', 'name date') // Popola il campo 'matchDay' con nome e data
      .sort({ createdAt: -1 }); // Ordina per data di creazione decrescente

    res.status(200).json({ adjustments });
  } catch (error) {
    console.error('Errore durante il recupero delle penalità:', error);
    res
      .status(500)
      .json({ message: 'internal error' });
  }
};
