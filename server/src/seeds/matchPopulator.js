import mongoose from 'mongoose';
import { fakerIT as faker } from '@faker-js/faker';
import MatchDay from '../models/MatchDay.js';
import { calculateMatchResult, calculatePoints } from '../lib/utils.js';
import { players } from './playersId.js';
const MONGO_URI = 'mongodb://localhost:27017/single-game-app';
const NUM_MATCHDAYS = 28;
const FORMAT_ID = '691a39c5348a92cb39a5f075';
const REAL_PLAYER_IDS = players;

const MATCHES_PER_DAY = 2;
const PLAYERS_PER_TEAM = 8;
const seasonId = '69189638932296b3de834a2e'; // Questo rimane fake o puoi fissarlo se ne hai uno reale

const getRandomPlayers = (count) => {
  if (count > REAL_PLAYER_IDS.length)
    throw new Error(
      `Servono ${count} ID, ne hai solo ${REAL_PLAYER_IDS.length}`
    );
  return [...REAL_PLAYER_IDS].sort(() => 0.5 - Math.random()).slice(0, count);
};

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connesso a MongoDB');

    const matchDays = [];

    for (let i = 0; i < NUM_MATCHDAYS; i++) {
      // 1. Seleziona 32 giocatori (4 team da 8)
      const selectedIds = getRandomPlayers(32);

      const team1Players = selectedIds.slice(0, 8);
      const team2Players = selectedIds.slice(8, 16);
      const team3Players = selectedIds.slice(16, 24);
      const team4Players = selectedIds.slice(24, 32);

      // 2. Genera ID
      const team1Id = new mongoose.Types.ObjectId();
      const team2Id = new mongoose.Types.ObjectId();
      const team3Id = new mongoose.Types.ObjectId();
      const team4Id = new mongoose.Types.ObjectId();

      // 3. Crea Squadre
      const teams = [
        {
          _id: team1Id,
          name: `FC ${faker.location.city()}`,
          players: team1Players,
        },
        {
          _id: team2Id,
          name: `${faker.animal.type()} United`,
          players: team2Players,
        },
        {
          _id: team3Id,
          name: `Real ${faker.person.lastName()}`,
          players: team3Players,
        },
        {
          _id: team4Id,
          name: `ASD ${faker.word.adjective()}`,
          players: team4Players,
        },
      ];

      // 4. Prepara Pairings
      const pairingsList = [
        {
          teamA: team1Id,
          teamB: team2Id,
          scoreA: faker.number.int({ min: 0, max: 8 }),
          scoreB: faker.number.int({ min: 0, max: 8 }),
          goldenGoal: faker.datatype.boolean(),
        },
        {
          teamA: team3Id,
          teamB: team4Id,
          scoreA: faker.number.int({ min: 0, max: 8 }),
          scoreB: faker.number.int({ min: 0, max: 8 }),
          goldenGoal: faker.datatype.boolean(),
        },
      ];

      // 5. Calcola Risultati Partite (Modifica pairingsList in-place)
      calculateMatchResult(pairingsList);

      // 6. Calcola Risultati Giocatori
      const playerResults = [];
      const assignPointsToTeam = (playerIds, resultString) => {
        playerIds.forEach((pid) => {
          const usedJolly = faker.datatype.boolean({ probability: 0.1 });
          const points = calculatePoints(resultString, usedJolly);
          playerResults.push({
            player: pid,
            result: resultString,
            points,
            usedJolly,
          });
        });
      };

      assignPointsToTeam(team1Players, pairingsList[0].resultA);
      assignPointsToTeam(team2Players, pairingsList[0].resultB);
      assignPointsToTeam(team3Players, pairingsList[1].resultA);
      assignPointsToTeam(team4Players, pairingsList[1].resultB);

      // 7. Assembla MatchDay
      matchDays.push({
        season: seasonId,
        dayNumber: i + 1,
        status: 'completed',
        format: FORMAT_ID, // <--- USATO L'ID REALE QUI
        custom: 8, // <--- FIX VALIDAZIONE: 8 giocatori per squadra (non 32 totale)
        maxTeams: 4,
        teams: teams,
        pairings: pairingsList,
        jollyPlayedBy: playerResults
          .filter((p) => p.usedJolly)
          .map((p) => p.player),
        playerResult: playerResults,
      });
    }

    await MatchDay.insertMany(matchDays);
    console.log(
      `🚀 Successo! Creati ${NUM_MATCHDAYS} MatchDay con Format: ${FORMAT_ID}`
    );
  } catch (err) {
    console.error('❌ Errore:', err);
  } finally {
    await mongoose.disconnect();
  }
};

seed();
