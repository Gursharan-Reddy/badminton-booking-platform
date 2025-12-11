const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require('./config/database');
const applyMiddleware = require('./config/middleware');
const routes = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

applyMiddleware(app);

connectDB();

app.get('/', (req, res) => res.send('Badminton Booking Platform API Running!'));

app.use('/api', routes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));