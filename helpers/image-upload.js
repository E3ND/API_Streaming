const ObjectId = require('mongoose').Types.ObjectId

const multer = require('multer')
const path = require('path')

const Video = require('../models/Video')

const getToken = require('./get-token')
const getUserByToken = require('./get-user-by-token')

//Destino da imagem
const imageStore = multer.diskStorage({
    destination: function(req, file, cb) {
        let folder = ''

        if(file.originalname.match(/\.(png|jpg)$/)) {
            folder = 'image-user'
        } else if (file.originalname.match(/\.(mp3|mp4)$/)) {
            folder = 'video-user'
        } 

        cb(null, `public/images/${folder}`)
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + String(Math.floor(Math.random() * 1000)) + path.extname(file.originalname))
    }
})

// upload de imagens
const imageUpload = multer({
    storage: imageStore,
    fileFilter(req, file, cb) {
        if(!req.body.name || !req.body.email || !req.body.password) {
            return cb(undefined, false)
        }
        // Não deixa fazer o upload de outra extensão de image, so png e jpg
        if(!file.originalname.match(/\.(png|jpg)$/)) {
            return cb(new Error('Por favor, envie somente jpg ou png.'))
        }
        cb(undefined, true)
    }
})

// upload de videos
const videoUpload = multer({
    storage: imageStore,
    async fileFilter(req, file, cb) {
        // Não deixa fazer o upload de outra extensão de image, so png e jpg
        if(!file.originalname.match(/\.(mp3|mp4)$/)) {
            return cb(new Error('Por favor, envie video de extensão MP4 ou MP3.'))
        }
        cb(undefined, true)
    }
})

// edição de videos
const videoEdit = multer({
    storage: imageStore,
    async fileFilter(req, file, cb) {
        if(!req.body.title || !req.body.description) {
            return cb(undefined, false)
        }

        const id = req.params.id

        // Verifica se o id é válido
        if(!ObjectId.isValid(id)) {
            return cb(new Error('ID inválido!'))
        }

        const video = await Video.findOne({ _id: id })

        const token = getToken(req)
        const user = await getUserByToken(token)
        
        if(video.user._id.toString() !== user._id.toString()) {
            return cb(new Error('Vídeo não pertencem ao usuário, ação negada!'))
        }

        // Não deixa fazer o upload de outra extensão de image, so png e jpg
        if(!file.originalname.match(/\.(mp3|mp4)$/)) {
            return cb(new Error('Por favor, envie video de extensão MP4 ou MP3.'))
        }
        cb(undefined, true)
    }
})

module.exports = { imageUpload, videoUpload, videoEdit }