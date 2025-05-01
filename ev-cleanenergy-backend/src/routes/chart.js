const router = require('express').Router();
const Chart  = require('../models/ChartData');
const auth   = require('../middleware/auth');

// GET /api/chart/:key
router.get('/:key', auth, async (req, res) => {
  try {
    const chart = await Chart.findOne({ key: req.params.key });
    if (!chart) return res.status(404).json({ message: 'Not found' });
    res.json(chart.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
