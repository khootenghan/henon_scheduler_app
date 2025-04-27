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

if (process.env.NODE_ENV == 'production') {
  const buildPath = path.resolve(__dirname, '../client/build');
  app.use(express.static(buildPath));
  
  app.get('/{*any}', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running (development mode)');
  });
}

// Sync DB and start server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});