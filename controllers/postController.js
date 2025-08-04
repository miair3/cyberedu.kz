const pool = require('../db');

class PostController {
    async createPost(req, res) {
        const { title, content } = req.body
        const image = req.file ? `/uploads/${req.file.filename}` : null
        try{
            const query = `
            INSERT INTO posts (title, content, image)
            VALUES ($1, $2, $3)
            RETURNING *`

            const values = [title, content, image]
            const resultn = await pool.query(query, values)

            res.status(201).json({
                message: 'Пост добавлен в базу',
                post: resultn.rows[0],
            })
        } catch (err) {
            console.error(err)
            res.status(500).json({ message: `Неправильный месту взял ${err.messgea}` })
        }
    }
}

module.exports = new PostController()