import React, { act, use, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useFetcher } from 'react-router-dom';
import { Search, Plus, X, Save, User, Swords, Unlock, Trash2, CheckCircle } from 'lucide-react';
import { usePlayerStore } from '../../../store/usePlayerStore';
import { useMatchDayStore } from '../../../store/useMatchDayStore';
import Splitter from '../../../components/Splitter';
import BackButton from '../../../components/BackButton';
import toast from 'react-hot-toast';
import PlayerSearchList from './components/PlayerSearchList';
import Button from '../../../components/Button';

function MatchDayTeamsPage() {
  const { matchDayId } = useParams();
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);

  const [activeTeamIndex, setActiveTeamIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState('');

  const { players, fetchAllPlayers, isLoading: loadingPlayers } = usePlayerStore();
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

  // -======================== RENDERING ============================

  if (loadingMatchDay || loadingPlayers)
    return <div className="p-10 text-center text-lg">Caricamento in corso...</div>;

  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* HEADER */}
      <div>
        <Splitter title="Gestione Squadre" />
        <div className="mt-4 flex items-center justify-between px-2">
          <BackButton />

          <Button
            onClick={handleSaveAll}
            className="text-white"
            text={'Salva'}
            disabled={isAddingTeams || teams.length === 0}
            Icon={Save}
          />
        </div>
      </div>

      {/* =============SEARCH BAR & TEAMS BOX ================= */}
      <div className="grid grid-cols-1 gap-6 px-2 lg:grid-cols-12">
        {/* ----- SEARCH BAR--START--- */}

        <div className="h-fit lg:sticky lg:top-4 lg:col-span-4">
          <PlayerSearchList
            players={playersToShow}
            onPlayerClick={handleAddPlayer}
            isDisabled={activeTeamIndex === -1}
            headerTitle={
              activeTeamIndex !== -1 && teams[activeTeamIndex] ? (
                <>
                  Aggiungi a:{' '}
                  <span className="ml-1 font-black text-primary underline">
                    {teams[activeTeamIndex].name}
                  </span>
                </>
              ) : (
                'Seleziona una squadra'
              )
            }
          />
        </div>

        {/* -----SEARCH BAR --END--- */}

        {/* ----- TEAM BOX GRIGLIA SQUADRE----- */}
        <div className="sm:grid-cols=2 grid h-fit grid-cols-1 gap-4 lg:col-span-8">
          {teams.map((team, index) => {
            const isActive = activeTeamIndex === index;
            const isLocked = team.isLocked;

            return (
              <div
                key={team.id}
                onClick={() => !isLocked && setActiveTeamIndex(index)}
                className={`relative rounded-xl border-2 p-3 shadow-sm transition-all duration-200 ${isActive ? ' cursor-pointer border-gray-500 ring-2 ring-accent1 ring-offset-1' : ''} ${isLocked ? 'cursor-default border-gray-200 bg-gray-50 opacity-90' : 'cursor-pointer border-gray-200 bg-accent1 hover:border-gray-300'} `}
              >
                {/* TOOLBAR SQUADRA */}
                <div className="absolute -top-3 right-3 z-10 flex gap-2">
                  <button
                    onClick={(e) => toggleLock(index, e)}
                    className={`rounded-md border-4 border-accent1 transition-all ${isLocked ? 'border-yellow-200 bg-yellow-50 text-yellow-600' : 'border-gray-200 bg-white text-gray-400 hover:bg-gray-50 '}`}
                  >
                    {isLocked ? <Lock size={18} /> : <Unlock size={18} />}
                  </button>
                  <button
                    onClick={(e) => handleDeleteTeam(index, e)}
                    disabled={isDeletingTeam || (isLocked && team.isSaved)}
                    className={`rounded-md border-4 border-accent1 transition-all ${isLocked && team.isSaved ? 'hidden' : 'border-gray-200 bg-white text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500'}`}
                  >
                    {<Trash2 size={18} />}
                  </button>
                </div>

                {/*===START=== HEADER TEAM */}

                <div className="mb-2 mt-1 flex items-center justify-between border-b border-black/5 pb-1">
                  <input
                    value={team.name}
                    onChange={(e) => {
                      if (isLocked) return;
                      const newList = [...teams];
                      newList[index].name = e.target.value;
                      setTeams(newList);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    disabled={isLocked}
                    className={`bg-transparent px-2 text-xl font-extrabold outline-none ${isLocked ? 'text-gray-500' : 'text-white'}`}
                    placeholder="Nome Squadra"
                  />
                  <div className="flex items-center gap-1">
                    {team.isSaved && <CheckCircle size={14} className="text-green-500" />}
                    <span className="badge badge-sm border-gray-200 bg-inherit text-xl">
                      {team.players.length}
                    </span>
                  </div>
                </div>
                {/*===== END === HEADER TEAM  */}

                {/* =====PLAYER LIST IN TEAM ==== START=== */}
                <ul className="flex min-h-[60px] flex-col gap-1 lg:grid lg:grid-cols-2">
                  {team.players.length === 0 && (
                    <div className="flex flex-1 items-center justify-center text-xs italic text-gray-400 lg:col-span-2">
                      {isLocked ? 'Nessun Giocatore' : 'Vuota'}
                    </div>
                  )}
                  {team.players.map((player) => (
                    <li
                      key={player._id}
                      className={`flex items-center justify-between rounded-md border px-2 py-1.5 text-xs shadow-sm ${isLocked ? 'bg-gray-50 text-gray-500' : 'bg-inherit text-white brightness-200'} `}
                    >
                      <span className="text-lg font-semibold">{player.player}</span>
                      {!isLocked && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemovePlayer(player._id, index);
                          }}
                          className="p-0.5 text-gray-400 hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          {/* =====PLAYER LIST IN TEAM ==== END === */}
          {/* ADD TEAM ===== START ==== */}
          <button
            onClick={handleAddTeam}
            disabled={isAddingTeams}
            className="gb-gray-50 flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 transition-all hover:border-primary active:scale-95 disabled:opacity-50"
          >
            <Plus size={24} />
            <span className="text-sm font-semibold">Aggiungi Squadra</span>
          </button>

          {/* ADD TEAM ===== END ==== */}
        </div>
      </div>

      {/*======================== END ======================= */}
    </div>
  );
}

export default MatchDayTeamsPage;
