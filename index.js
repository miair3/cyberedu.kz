const express = require('express');
const cors = require('cors');
const path = require('path');

const helmet = require('helmet');
require('dotenv').config();
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRouter = require('./routes/postRoutes');
const likesRouter = require('./routes/likes');
const gamesRoute = require('./routes/games');


const app = express();
const PORT = 3030;

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors());
app.use(helmet());
app.use('/uploads', express.static('uploads'))
app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
});
app.use(limiter);

app.use(cors({
    origin: 'http://localhost:5173'
}))

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', postRouter);
app.use('/api/likes', likesRouter);


app.use('/games', gamesRoute);


app.listen(PORT, () => {
  console.log(`Сервер работает на http://localhost:${PORT}`);
});
