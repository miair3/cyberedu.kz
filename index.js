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
const notesRoutes = require('./routes/notes');


const app = express();
const PORT = process.env.PORT || 3030;

// Статические файлы
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/uploads', express.static('uploads'));


// CORS
app.use(cors({
  origin: ['http://localhost:5173', 'https://cyberedue.netlify.app'],
  credentials: true
}));

// Helmet (с разрешением CORS ресурсов)
app.use(helmet({
  crossOriginResourcePolicy: false
}));

// Ограничение количества запросов
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 минута
  max: 10,
});
app.use(limiter);

// JSON парсер
app.use(express.json());

// Роуты
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', postRouter);
app.use('/api', likesRouter);
app.use('/games', gamesRoute);
app.use('/api', notesRoutes);


// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер работает на http://localhost:${PORT}`);
});
