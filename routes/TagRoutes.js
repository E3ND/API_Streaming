const router = require('express').Router()

// helpers
const verifyToken = require('../helpers/verify-token')

// Controller
const TagController = require('../controllers/TagController')

// Rotas privadas
router.post('/', verifyToken, TagController.create)
router.get('/', verifyToken, TagController.getAllTags)
router.get('/:title_tag/videos', verifyToken, TagController.getByTitle)
router.put('/:id', verifyToken, TagController.updateTag)
router.delete('/:id', verifyToken, TagController.deleteTag)

module.exports = router