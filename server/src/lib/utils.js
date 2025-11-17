import jwt from 'jsonwebtoken';
import { ENV } from './env.js';

export const generateToken = (userId, res) => {
  const { JWT_SECRET } = ENV;
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: '7d',
  });

  res.cookie('jwt', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, //prevent XXS
    sameSite: 'Strict', //CSRF
    secure: ENV.NODE_ENV === 'development' ? false : true,
  });

  return token;
};

export const calculatePoints = (result, hasjolly) => {
  let basePoints = 0;

  switch (result) {
    case 'clearWin':
      basePoints = 3;
      break;
    case 'narrowWin':
      basePoints = 2;
      break;
    case 'goldenGoalWin':
      basePoints = 2;
      break;
    case 'draw':
      basePoints = 1;
      break;
    case 'narrowLoss':
      basePoints = 1;
      break;
    case 'loss':
      basePoints = 0;
      break;
    default:
      basePoints = 0;
      break;
  }
  if (hasjolly) {
    return basePoints * 2;
  } else {
    return basePoints;
  }
};

export const calculateMatchResult = (pairings) => {
  for (const pairing of pairings) {
    if (pairing.scoreA === undefined || pairing.scoreB === undefined) {
      continue; // Salta questo pairing se mancano i punteggi
    }

    const diff = pairing.scoreA - pairing.scoreB;

    if (diff === 0) {
      // Pareggio
      pairing.resultA = 'draw';
      pairing.resultB = 'draw';
    } else if (diff > 1) {
      // Vittoria netta Team A
      pairing.resultA = 'clearWin';
      pairing.resultB = 'loss';
    } else if (diff < -1) {
      // Vittoria netta Team B
      pairing.resultB = 'clearWin';
      pairing.resultA = 'loss';
    } else if (diff === 1) {
      // Vittoria di misura Team A
      pairing.resultA = pairing.goldenGoal ? 'goldenGoalWin' : 'narrowWin';
      pairing.resultB = 'narrowLoss'; // B perde di misura
    } else if (diff === -1) {
      // Vittoria di misura Team B
      pairing.resultB = pairing.goldenGoal ? 'goldenGoalWin' : 'narrowWin';
      pairing.resultA = 'narrowLoss'; // A perde di misura
    }
  }

  // Restituisce l'array 'pairings' aggiornato
  return pairings;
};
