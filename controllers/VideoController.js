const fs = require('fs');

// Model
const Video = require('../models/Video')

// Helpers
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

const ObjectId = require('mongoose').Types.ObjectId

module.exports = class VideoController {
    static async create(req, res) {
        const { title, description } = req.body
        let video = ''
    
        // Validações
        if(!title) {
            res.status(422).json({ message: 'O campo título é obrigatório!' })
            return
        }

        if(!description) {
            res.status(422).json({ message: 'O campo descrição é obrigatório!' })
            return
        }

        if(!req.file) {
            res.status(422).json({ message: 'É necessário um video para publicar!' })
            return
        } else {
            video = req.file.filename
        }

        // Pegando o usuário
        const token = getToken(req)
        const user = await getUserByToken(token)

        const videoCreate = new Video({
            title,
            description,
            video,
            user: {
                _id: user._id
            },
        })

        try {
            const newVideo = await videoCreate.save()

            res.status(201).json({ message: 'Vídeo cadastrado com sucesso!', newVideo })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    static async getAll(req, res) {
        // Listando todos os vídeos
        const videos = await Video.find().sort('-createdAt')

        res.status(200).json({ message: videos })
    }

    static async getOneVideo(req, res) {
        const id = req.params.id

        // Veficando se o id é válido
        if(!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido' })
            return
        }

        const video = await Video.findOne({ _id: id })

        if(!video) {
            res.status(404).json({ message: 'Vídeo não encontrado!' })
            return
        }

        res.status(200).json({ video })
    }

    static async update(req, res) {
        const { title, description } = req.body
        const id = req.params.id

        const updateData = {}

        // Verifica se o id é válido
        if(!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido' })
            return
        }


        const video = await Video.findOne({ _id: id })

        // Validações
        if(!video) {
            res.status(404).json({ message: 'Vídeo não encontrado!' })
            return
        }

        if(!title) {
            res.status(422).json({ message: 'O campo título é obrigatório!' })
            return
        } else {
            updateData.title = title
        }

        if(!description) {
            res.status(422).json({ message: 'O campo descrição é obrigatório!' })
            return
        } else {
            updateData.description = description
        }

        if(!req.file) {
            res.status(422).json({ message: 'É necessário um video para publicar!' })
            return
        } else {
            updateData.video = req.file.filename
        }

        fs.unlink(`./public/images/video-user/${video.video}`, function (err){
            if(err) {
                console.log(err)
                return
            }
        })

        try {
            const videoUpdate = await Video.findByIdAndUpdate(id, updateData)

            res.status(200).json({ message: 'Vídeo atualizado com sucesso!', videoUpdate })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    static async delete(req, res) {
        const id = req.params.id

        // Validações
        if(!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido' })
            return
        }

        const video = await Video.findOne({ _id: id })

        if(!video) {
            res.status(404).json({ message: 'Vídeo não encontrado!' })
            return
        }

        // Verifica se o vídeo  pertece ao usuário
        const token = getToken(req)
        const user = await getUserByToken(token)

        if(video.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'Vídeo não pertence ao usuário, ação negada!' })
            return
        }

        fs.unlink(`./public/images/video-user/${video.video}`, function (err){
            if(err) {
                console.log(err)
                return
            }
        })

        try {
            await Video.findByIdAndRemove(id)

            res.status(200).json({ message: 'Vídeo removido com sucesso!' })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }
}