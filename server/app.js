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

if (process.env.NODE_ENV === 'production') {
  const buildPath = path.resolve(__dirname, '../client/build');
  console.log('Serving static files from:', buildPath);

  app.use(express.static(buildPath));

  console.log('serving next files from:', path.join(buildPath, 'index.html'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running (development mode)');
  });
}

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Static serving from:', path.join(__dirname, '../client/build'));

// Sync DB and start server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});