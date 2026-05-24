import User from '../models/User.js';

// GET /api/records
export const getRecords = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({ qazaRecord: user.qazaRecord });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/records
export const updateRecords = async (req, res) => {
  try {
    const { fajr, zohar, asr, maghrib, ishaFarz, ishaWitr } = req.body;

    // Validate all values are non-negative numbers
    const fields = { fajr, zohar, asr, maghrib, ishaFarz, ishaWitr };
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined && (typeof value !== 'number' || value < 0)) {
        return res.status(400).json({ message: `Invalid value for ${key}` });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.session.userId,
      {
        $set: {
          'qazaRecord.fajr':     fajr     ?? undefined,
          'qazaRecord.zohar':    zohar    ?? undefined,
          'qazaRecord.asr':      asr      ?? undefined,
          'qazaRecord.maghrib':  maghrib  ?? undefined,
          'qazaRecord.ishaFarz': ishaFarz ?? undefined,
          'qazaRecord.ishaWitr': ishaWitr ?? undefined,
        },
      },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({ qazaRecord: user.qazaRecord });
  } catch (error) {
    console.error('Update records error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /api/records/single — update a single prayer field
export const updateSingleRecord = async (req, res) => {
  try {
    const { prayer, value } = req.body;

    const validPrayers = ['fajr', 'zohar', 'asr', 'maghrib', 'ishaFarz', 'ishaWitr'];
    if (!validPrayers.includes(prayer)) {
      return res.status(400).json({ message: 'Invalid prayer name' });
    }
    if (typeof value !== 'number' || value < 0) {
      return res.status(400).json({ message: 'Value must be a non-negative number' });
    }

    const user = await User.findByIdAndUpdate(
      req.session.userId,
      { $set: { [`qazaRecord.${prayer}`]: value } },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({ qazaRecord: user.qazaRecord });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};
