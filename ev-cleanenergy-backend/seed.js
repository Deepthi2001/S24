// seed.js
const mongoose  = require('mongoose');
const ChartData = require('./src/models/ChartData');

const MONGO_URI = 'mongodb://localhost:27017/evCleanEnergy';

async function seed() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('🔌 Connected to MongoDB');

  // clear out old data
  await ChartData.deleteMany({});
  console.log('🗑  Cleared existing ChartData');

  // our two datasets
  const charts = [
    {
      key: 'charge-time',
      data: [
        { x: 'Standard Graphite', y: 60 },
        { x: 'Hard-C/Sn Nano',    y: 20 },
      ],
    },
    {
      key: 'cycle-life',
      data: [
        { x:   0, graphite: 100, composite: 100 },
        { x: 500, graphite:  90, composite:  98 },
        { x:1000, graphite:  80, composite:  95 },
        { x:1500, graphite:  70, composite:  92 },
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
