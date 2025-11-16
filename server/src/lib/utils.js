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

export const calculatePoints = (result) => {
  switch (result) {
    case 'clearWin':
      return 3;
    case 'narrowWin':
      return 2;
    case 'goldenGoalWin':
      return 2;
    case 'draw':
      return 1;
    case 'narrowLoss':
      return 1;
    case 'loss':
      return 0;
    default:
      return 0;
  }
};

export const calculateMatchResult = (teams) => {
  const updatedTeams = [...teams];
  for (let i = 0; i < updatedTeams.length; i += 2) {
    const teamA = updatedTeams[i];
    const teamB = updatedTeams[i + 1];
    if (!teamB) break;

    if (teamA.score === teamB.score) {
      teamA.result = 'draw';
      teamB.result = 'draw';
    } else if (teamA.score > teamB.score && teamA.score - teamB.score > 1) {
      teamA.result = 'clearWin';
      teamB.result = 'loss';
    } else if (teamB.score > teamA.score && teamB.score - teamA.score > 1) {
      teamB.result = 'clearWin';
      teamA.result = 'loss';
    } else if (teamA.score > teamB.score) {
      teamA.result = teamA.goldenGoal ? 'goldenGoalWin' : 'narrowWin';
      teamB.result = teamB.goldenGoal ? 'loss' : 'narrowLoss';
    } else if (teamB.score > teamA.score) {
      teamB.result = teamB.goldenGoal ? 'goldenGoalWin' : 'narrowWin';
      teamA.result = teamA.goldenGoal ? 'loss' : 'narrowLoss';
    }
  }
  return updatedTeams;
};
