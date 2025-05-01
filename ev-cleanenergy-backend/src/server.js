const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const authRoute = require('./routes/auth');
const chartRoute= require('./routes/chart');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/evCleanEnergy', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// routes
app.use('/api/auth', authRoute);
app.use('/api/chart', chartRoute);

const PORT = 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
