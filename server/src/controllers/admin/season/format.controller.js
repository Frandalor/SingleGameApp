import Format from '../../../models/Format.js';

export const newFormat = async (req, res) => {
  try {
    const { name, maxTeams, maxPlayersPerTeam } = req.body;
    const format = new Format({
      name,
      maxTeams,
      maxPlayersPerTeam,
    });
    const savedFormat = await format.save();
    res.status(201).json(savedFormat);
  } catch (error) {
    console.error('Errore creando nuovo format:', error);
    res.status(500).json({ message: 'Internal error' });
  }
};
