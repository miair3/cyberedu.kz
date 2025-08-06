const pool = require('../db');

class UserController {
  async getAllUsers(req, res) {
    try {
      const users = await pool.query('SELECT id, username, email, avatar FROM users');
      res.json(users.rows);
    } catch (err) {
      res.status(500).json({ error: 'Ошибка при получении пользователей' });
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await pool.query(
        'SELECT id, username, email, avatar FROM users WHERE id = $1',
        [id]
      );
      if (user.rows.length === 0) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }
      res.json(user.rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Ошибка при получении пользователя' });
    }
  }

  async getProfile(req, res) {
    const userId = req.user.id;
    try {
      const result = await pool.query(
        'SELECT id, username, email, avatar FROM users WHERE id = $1',
        [userId]
      );
      const user = result.rows[0];

      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }

      res.json(user);
    } catch (error) {
      console.error('Ошибка при получении профиля:', error);
      res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
  }

  // 🔹 Новый метод для обновления профиля
  async updateProfile(req, res) {
    const userId = req.user.id;
    const { username, email } = req.body;

    try {
      let avatarUrl = null;
      if (req.file) {
        avatarUrl = `/uploads/avatars/${req.file.filename}`;
      }

      const result = await pool.query(
        `UPDATE users
         SET username = COALESCE($1, username),
             email = COALESCE($2, email),
             avatar = COALESCE($3, avatar)
         WHERE id = $4
         RETURNING id, username, email, avatar`,
        [username || null, email || null, avatarUrl || null, userId]
      );

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      res.status(500).json({ message: 'Ошибка при обновлении профиля' });
    }
  }
}

module.exports = new UserController();
