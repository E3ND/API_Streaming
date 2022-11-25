const router = require('express').Router()

// Helpers
const { imageUpload } = require('../helpers/image-upload')

// Controller
const UserControler = require('../controllers/UserControler')

// Rotas publicas
router.post('/', imageUpload.single('image'), UserControler.register)
router.get('/', UserControler.login)

module.exports = router