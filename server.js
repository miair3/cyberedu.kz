const express = require('express');
const cors = require('cors');
const path = require('path');

const loginRoute = require('./routes/login');
const lessonRoutes = require('./routes/lessonRoutes');
const registerRoute = require('./routes/register');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const likesRouter = require('./routes/likes');

const app = express();

// Разрешённые домены
const allowedOrigins = [
  'http://localhost:5173',           // локальная разработка
  'https://cyberedue.netlify.app'    // твой фронтенд на Netlify
];

// Настройка CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API маршруты
app.use('/api/login', loginRoute);
app.use('/api/register', registerRoute);
app.use('/api', userRoutes);
app.use('/api', postRoutes);
app.use('/api', lessonRoutes);
app.use('/api/likes', likesRouter);

// Роут для лайков/дизлайков
const db = require('./db'); // убедись, что ты подключаешь db
app.get("/api/lessons/:id", async (req, res) => {
  const { id } = req.params;
  const result = await db.query(
    `SELECT 
      COUNT(*) FILTER (WHERE liked = true) AS likesCount,
      COUNT(*) FILTER (WHERE liked = false) AS dislikesCount
     FROM likes WHERE lesson_id = $1`,
    [id]
  );
  res.json(result.rows[0]);
});

// Статика (React build)
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// React Router SPA поддержка
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
