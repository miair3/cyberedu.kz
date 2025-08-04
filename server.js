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

// Middleware
app.use(cors());
app.use(express.json());

// API маршруты
app.use('/api/login', loginRoute);
app.use('/api/register', registerRoute);
app.use('/api', userRoutes);
app.use('/api', postRoutes);
app.use('/api', lessonRoutes);
app.use('/api/likes', likesRouter);

const likesRoutes = require("./routes/likes");
app.use("/api/likes", likesRoutes);

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

// Статика (frontend React сборка)
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
