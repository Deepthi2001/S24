const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const authRoute = require('./routes/auth');
const chartRoute= require('./routes/chart');
const summaryRoute = require('./routes/summary');
const reportsRoute = require('./routes/reports');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

const path = require('path');
require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI;
// MongoDB connection
mongoose.connect(MONGO_URI , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));


// serve Angular’s build output
// app.use(express.static(path.join(__dirname, '../dist/ev-cleanenergy-frontend')));
// // all other non-/api requests serve index.html
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../dist/ev-cleanenergy-frontend/index.html'));
// });

// routes
app.use('/api/auth', authRoute);
app.use('/api/chart', chartRoute);
app.use('/api/summary', summaryRoute);
app.use('/api/reports', reportsRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
