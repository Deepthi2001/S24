const router = require('express').Router();
const Chart = require('../../models/ChartData');
const auth = require('../../middleware/auth');

// GET /api/reports
// Returns all data needed for the reports page
router.get('/', auth, async (req, res) => {
  try {
    // Get battery capacity data (cycle life)
    const cycleLife = await Chart.findOne({ key: 'cycle-life' });
    
    // Get energy usage data
    const energyUsage = await Chart.findOne({ key: 'energy-usage' });
    
    // Get efficiency data
    const efficiency = await Chart.findOne({ key: 'efficiency' });
    
    // Get cost comparison data
    const costComparison = await Chart.findOne({ key: 'cost-comparison' });
    
    // Return combined data
    res.json({
      batteryCapacity: cycleLife ? cycleLife.data : [],
      energyUsage: energyUsage ? energyUsage.data : [],
      efficiency: efficiency ? efficiency.data : [],
      costComparison: costComparison ? costComparison.data : [],
      descriptions: {
        batteryCapacity: 'This chart tracks battery capacity retention over time. The data shows a gradual decline from 95% in January to 80% in July, which is significantly better than industry standards. Most EV batteries typically degrade to 70% capacity after similar usage periods. This data is collected from our fleet of monitored vehicles and represents average values across different battery technologies.',
        energyUsage: 'This chart displays the average daily energy consumption of EVs in our network. Usage peaks on Fridays (50 kWh) and is lowest on weekends (20-25 kWh), reflecting typical commuting patterns. The data is collected from charging sessions and helps optimize charging infrastructure deployment and energy distribution planning.',
        efficiency: 'This chart compares energy efficiency across different driving conditions. City driving achieves the highest efficiency (92%) due to regenerative braking opportunities, while highway driving is slightly less efficient (86%). The combined average efficiency of 89% demonstrates the overall effectiveness of modern EV powertrains compared to internal combustion engines which typically operate at 20-30% efficiency.',
        costComparison: 'This chart compares the cost per mile of different vehicle power sources. Gasoline vehicles cost approximately $0.15 per mile, while grid-charged EVs cost only $0.05 per mile. Solar-charged EVs achieve the lowest cost at just $0.02 per mile, representing a 87% cost reduction compared to gasoline vehicles. These figures are based on current energy prices and average vehicle efficiencies.'
      }
    });
  } catch (err) {
    console.error('Reports API error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
