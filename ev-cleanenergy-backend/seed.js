// seed.js
const mongoose  = require('mongoose');
const ChartData = require('./src/models/ChartData');
require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI;

async function seed() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connected to MongoDB');

  // clear out old data
  await ChartData.deleteMany({});
  console.log(' Cleared existing ChartData');

  // All chart datasets for the application
  const charts = [
    {
      key: 'charging-time',
      data: [
        { x: '0%', y: 0 },
        { x: '20%', y: 10 },
        { x: '40%', y: 18 },
        { x: '60%', y: 25 },
        { x: '80%', y: 35 },
        { x: '100%', y: 45 }
      ],
    },
    {
      key: 'cycle-life',
      data: [
        { x: 'Jan', y: 95 },
        { x: 'Feb', y: 92 },
        { x: 'Mar', y: 90 },
        { x: 'Apr', y: 87 },
        { x: 'May', y: 85 },
        { x: 'Jun', y: 83 },
        { x: 'Jul', y: 80 }
      ],
    },
    {
      key: 'energy-usage',
      data: [
        { x: 'Mon', y: 45 },
        { x: 'Tue', y: 38 },
        { x: 'Wed', y: 42 },
        { x: 'Thu', y: 35 },
        { x: 'Fri', y: 50 },
        { x: 'Sat', y: 25 },
        { x: 'Sun', y: 20 }
      ],
    },
    {
      key: 'efficiency',
      data: [
        { x: 'City', y: 92 },
        { x: 'Highway', y: 86 },
        { x: 'Combined', y: 89 }
      ],
    },
    {
      key: 'energy-distribution',
      data: [
        { x: 'Solar', y: 45 },
        { x: 'Wind', y: 25 },
        { x: 'Hydro', y: 15 },
        { x: 'Geothermal', y: 10 },
        { x: 'Biomass', y: 5 }
      ],
    },
    {
      key: 'carbon-savings',
      data: [
        { x: 'Q1', y: 120 },
        { x: 'Q2', y: 150 },
        { x: 'Q3', y: 180 },
        { x: 'Q4', y: 210 }
      ],
    },
    {
      key: 'cost-comparison',
      data: [
        { x: 'Gasoline', y: 0.15 },
        { x: 'EV (Grid)', y: 0.05 },
        { x: 'EV (Solar)', y: 0.02 }
      ],
    },
  ];

  await ChartData.insertMany(charts);
  console.log('✅ Seeding complete');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
