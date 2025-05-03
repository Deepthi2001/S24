const router = require('express').Router();
const Chart = require('../../models/ChartData');
const auth = require('../../middleware/auth');

// GET /api/summary
// Returns all data needed for the summary page
router.get('/', auth, async (req, res) => {
  try {
    // Get energy distribution data
    const energyDistribution = await Chart.findOne({ key: 'energy-distribution' });
    
    // Get charging time data
    const chargingTime = await Chart.findOne({ key: 'charging-time' });
    
    // Return combined data
    res.json({
      energyDistribution: energyDistribution ? energyDistribution.data : [],
      chargingTime: chargingTime ? chargingTime.data : [],
      metrics: {
        batteryHealth: {
          value: 92,
          trend: 2,
          trendDirection: 'up'
        },
        energyEfficiency: {
          value: 4.2,
          unit: 'mi/kWh',
          trend: 0.3,
          trendDirection: 'up'
        },
        co2Avoided: {
          value: 1240,
          unit: 'kg',
          trend: 120,
          trendDirection: 'up'
        },
        costSavings: {
          value: 345,
          unit: '$',
          trend: 42,
          trendDirection: 'up'
        }
      },
      benefits: [
        {
          icon: '🌍',
          title: 'Environmental Impact',
          description: 'Your EV has prevented 1.2 tons of CO₂ emissions this year, equivalent to planting 60 trees.'
        },
        {
          icon: '💸',
          title: 'Financial Savings',
          description: 'You\'ve saved approximately $1,200 in fuel costs compared to a conventional vehicle.'
        },
        {
          icon: '⚙️',
          title: 'Maintenance Reduction',
          description: 'EVs require 50% less maintenance than conventional vehicles, saving you time and money.'
        },
        {
          icon: '🔄',
          title: 'Energy Independence',
          description: 'Your clean energy sources provide 85% of your charging needs, reducing grid dependency.'
        }
      ]
    });
  } catch (err) {
    console.error('Summary API error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
