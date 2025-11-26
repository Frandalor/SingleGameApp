import Season from '../../models/Season.js';

//-----------------------------------------------SEASON---------------------------------------------------------------

//-----------------GET ALL SEASON

export const getAllSeason = async (req, res) => {
  try {
    const season = await Season.find().sort({ startDate: -1 });
    res.status(200).json(season);
  } catch (error) {
    console.error('errore fetching seasons:', error);
    res.status(500).json({ message: 'internal error' });
  }
};

// --------NEW SEASON

export const newSeason = async (req, res) => {

  try {
    const { name, startDate } = req.validatedData.body;

    // check if there is an open season

    const activeSeason = await Season.findOne({ current: true });
    if (activeSeason) {
      return res.status(400).json({
        message: `esiste gia una stagione attiva, chiudere ${activeSeason.name} per proseguire`,
      });
    }

    // create new season

    const season = new Season({ name, startDate: startDate, current: true });
    const savedSeason = await season.save();

    res.status(201).json(savedSeason);
  } catch (error) {
    console.error('errore creating new season', error);
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return res
        .status(409)
        .json({ message: 'Il nome della stagione esiste già' });
    }
    res.status(500).json({ message: 'internal error' });
  }
};

// ===========CLOSE SEASON

export const closeSeason = async (req, res) => {
  try {
    const activeSeason = await Season.findOne({ current: true });

    if (!activeSeason) {
      return res.status(400).json({ message: 'non ci sono stagioni attive' });
    }

    activeSeason.endDate = new Date();
    activeSeason.current = false;

    await activeSeason.save();

    res.status(200).json({ message: `${activeSeason.name} terminata` });
  } catch (error) {
    console.error('errore deleting season', error);
    res.status(500).json({ message: 'internal error' });
  }
};
