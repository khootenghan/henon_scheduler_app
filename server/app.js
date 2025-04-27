const express = require('express');
const cors = require('cors');
const path = require('path');
const eventRoutes = require('./routes/eventRoutes');
const sequelize = require('./models/index');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/events', eventRoutes);

// Root
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../client/build');

  app.use(express.static(buildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'), (err) => {
      if (err) {
        res.status(500).send(err);
      }
    });
  });
} else {
  app.get('/', (req, res) => {
    res.send('Event Planner API Running (development)');
  });
}


// Sync DB and start server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});