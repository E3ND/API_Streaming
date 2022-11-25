const router = require('express').Router()

// Helpers
const { videoUpload, videoEdit } = require('../helpers/image-upload')
const verifyToken = require('../helpers/verify-token')

// Controller
const VideoController = require('../controllers/VideoController')

// rotas privadas
router.post('/', verifyToken, videoUpload.single('video'), VideoController.create)
router.get('/', verifyToken, VideoController.getAll)
router.get('/:id', verifyToken, VideoController.getOneVideo)
router.put('/:id', verifyToken, videoEdit.single('video'), VideoController.update)
router.delete('/:id', verifyToken, VideoController.delete)

module.exports = router