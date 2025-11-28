import React, { use, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useFetcher } from 'react-router-dom';
import { Search, Plus, X, Save, User, Swords } from 'lucide-react';
import { usePlayerStore } from '../../../store/usePlayerStore';
import { useMatchDayStore } from '../../../store/useMatchDayStore';
import Splitter from '../../../components/Splitter';
import BackButton from '../../../components/BackButton';
import toast from 'react-hot-toast';
import PlayerSearchList from './components/PlayerSearchList';

function MatchDayTeamsPage() {
  const { matchDayId } = useParams();
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);

  const [activeTeamIndex, setActiveTeamIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState('');

  const { players, fetchAllPlayers } = usePlayerStore();
  const {
    addTeams,
    isAddingTeams,
    fetchMatchDayById,
    clearSelectedMatchDay,
    isLoading: loadingMatchDay,
    selectedMatchDay,
    isDeletingTeam,
    deleteTeam,
  } = useMatchDayStore();

  useEffect(() => {
    fetchAllPlayers();
    fetchMatchDayById(matchDayId);
    return () => {
      clearSelectedMatchDay(); // in useeffect il return avviene quando viene smontato componente
    };
  }, [matchDayId, fetchAllPlayers, fetchMatchDayById, clearSelectedMatchDay]);

  // -----SYNC in caso di squadre già inserite
  console.log(players);
  useEffect(() => {
    if (selectedMatchDay && selectedMatchDay.teams?.length > 0) {
      const dbTeams = selectedMatchDay.teams.map((dbTeam, index) => ({
        id: dbTeam._id || Date.now() + index,
        name: dbTeam.name || 'squadra',
        players: dbTeam.players || [],
        isLocked: true,
        isSaved: true,
      }));
      setTeams(dbTeams);
      setActiveTeamIndex(-1);
    }
  }, [selectedMatchDay]);

  // ======================================================

  //----------ADD TEAM

  const handleAddTeam = () => {
    const newTeam = {
      id: Date.now(),
      name: '',
      players: [],
      isLocked: false,
      isSaved: false,
    };

    const newList = [...teams, newTeam];
    setTeams(newList);
    setActiveTeamIndex(newList.length - 1);
  };

  //--------------DELETE TEAM

  const handleDeleteTeam = async (index, e) => {
    e.stopPropagation();

    if (isDeletingTeam) return;

    const teamToDelete = teams[index];

    //Se team is in DB

    if (teamToDelete.isSaved) {
      const confirm = window.confirm(
        `Sei sicuro di voler eliminare definitivamente "${teamToDelete.name}"`,
      );
      if (!confirm) return;
      const success = await deleteTeam(matchDayId, teamToDelete.id);

      if (success) {
        const newList = teams.filter((_, i) => i !== index);
        setTeams(newList);
        setActiveTeamIndex(-1);
      }
    } else {
      const newList = teams.filter((_, i) => i !== index);
      setTeams(newList);
      setActiveTeams(newList);
      setActiveTeamIndex(-1);
      toast.success('Bozza rimossa');
    }
  };
  //===========BLOCCA/SBLOCCA TEAM

  const toggleLock = (index, e) => {
    e.stopPropagation();
    const newTeams = [...teams];
    const team = newTeams[index];

    if (!team.isLocked) {
      if (team.players.length === 0) return toast.error('Non puoi bloccare una squadra vuota');
      if (!team.name.trim()) return toast.error('La squadra deve avere un nome');
      if (activeTeamIndex === index) setActiveTeamIndex(-1);
    }
    team.isLocked = !team.isLocked;
    setTeams(newTeams);
  };

  // Helper costruzione Payload

  const handleSaveAll = async () => {
    if (teams.length < 1) return toast.error('Nessuna nuova squadra aggiunta');
    if (teams.some((t) => t.players.length === 0))
      return toast.error('Tutte le squadre devono avere giocatori');

    const payload = teams.map((t) => ({
      _id: t.isSaved ? t._id : undefined,
      name: t.name,
      players: t.players.map((p) => p._id),
    }));
    const success = await addTeams(matchDayId, payload);
    if (success) {
      toast.success('Tutte le squadre salvate');
    }

    //Aggiungere logica per stabiire se si puo procedere al pairing
  };

  //===========================AZIONI GIOCATORI=================================

  //------------ADD PLAYER TO TEAM

  const handleAddPlayer = (player) => {
    if (activeTeamIndex === -1) {
      return toast.error('Seleziona una squadra');
    }
    const currentTeam = teams[activeTeamIndex];

    if (currentTeam.isLocked) return toast.error('Squadra bloccata. Sbloccala per modificarla');

    //controllo duplicati
    if (currentTeam.players.some((p) => p._id === player._id)) {
      return toast.error('Giocatore già presente in questa squadra');
    }
    const newTeams = [...teams];
    newTeams[activeTeamIndex].players.push(player);
    setTeams(newTeams);
  };

  // --------REMOVE PLAYER FROM TEAM

  const handleRemovePlayer = (playerId, teamIndex) => {
    const currentTeam = teams[teamIndex];
    if (currentTeam.isLocked) return;

    const newTeams = [...teams];
    newTeams[teamIndex].players = newTeams[teamIndex].players.filter((p) => p._id !== playerId);
    setTeams(newTeams);
  };

  // ================== FILTRI ==============================

  const usedPlayerIds = useMemo(() => {
    const ids = new Set();
    teams.forEach((t) => t.players?.forEach((p) => ids.add(p._id)));
    return ids;
  }, [teams]);

  const playersToShow = useMemo(() => {
    return players.filter((p) => {
      if (!p || !p._id) return false;

      const isUsed = usedPlayerIds.has(p._id);
      return !isUsed;
    });
  }, [players, usedPlayerIds]);

  return (
    <div>
      <PlayerSearchList headerTitle={'Aggiungi Giocatore'} players={playersToShow} />
    </div>
  );
}

export default MatchDayTeamsPage;
