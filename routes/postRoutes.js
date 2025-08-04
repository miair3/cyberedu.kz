const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const PostController = require('../controllers/postController')

const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads'
        if (!fs.existsSync(dir)) fs.mkdirSync(dir)
        cb(null, dir)
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, file.fieldname + '-' + uniqueName + ext)
    }
})

const upload = multer({ storage })

router.post('/posts/create', upload.single('image'), PostController.createPost)

module.exports = router