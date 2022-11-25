// Models
const Tag = require('../models/Tag')
const Video = require('../models/Video')

// helpers
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

const ObjectId = require('mongoose').Types.ObjectId

module.exports = class TagController {
    static async create(req, res) {
        // Criando tag
        const { name, idOfVideos } = req.body
        const nameUpper = name.toUpperCase()

        // Pegando o usuário
        const token = getToken(req)
        const user = await getUserByToken(token)

        // Validações
        if(!name) {
            res.status(422).json({ message: 'O campo nome é obrigatório!' })
            return
        }

        if(!idOfVideos || idOfVideos.length === 0) {
            res.status(422).json({ message: 'Deve-se categorizar pelo menos 1 vídeo!' })
            return
        }

        // Aqui é a verificação para que o usuário só categorize seus vídeos
        for (let i = 0; i < idOfVideos.length; i++) {
            const videoTag = await Video.findOne({ _id: idOfVideos[i] })

            if(videoTag.user._id.toString() !== user._id.toString()) {
                res.status(422).json({ message: 'Não se pode categorizar vídeos de outros usuários!' })
                return
            }  
        }

        const nameTagVerify = await Tag.findOne({ name: nameUpper })

        if(nameTagVerify) {
            res.status(422).json({ message: 'Já existe uma tag com esse nome, por favor utilize outro!' })
            return
        }

        const tag = new Tag({
            name: nameUpper,
            user: {
                _id: user._id
            },
            video: idOfVideos,
        })

        try {
            const newTag = await tag.save()

            res.status(200).json({ message: 'Tag criada com sucesso!', newTag })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    static async getAllTags(req, res) {
        // Buscando todas as tags
        const tags = await Tag.find().sort('createdAt')

        res.status(200).json({ message: tags })
    }

    static async getByTitle(req, res) {
        // Listando vídeos pela tag
        const titleTag = req.params.title_tag

        const titleTagUpper = titleTag.toUpperCase()

        // Pegando o usuário
        const token = getToken(req)
        const user = await getUserByToken(token)

        const tag = await Tag.findOne({ name: titleTagUpper })

        if(!tag) {
            res.status(404).json({ message: 'Nenhuma tag encontrada com esse nome!' })
            return
        }

        res.status(200).json({ tag })
    }

    static async updateTag(req, res) {
        // Atualizando tag
        const { name, idOfVideos } = req.body
        const id = req.params.id
        const nameUpper = name.toUpperCase()

        // Pegando o usuário
        const token = getToken(req)
        const user = await getUserByToken(token)

        const updateData = {}

        const tag = await Tag.findOne({ _id: id })

        if(!tag) {
            res.status(404).json({ message: 'Tag não encontrada!' })
            return
        }

        if(!name) {
            res.status(422).json({ message: 'O campo nome é obrigatório!' })
            return
        } else {
            updateData.name = nameUpper
        }

        if(!idOfVideos || idOfVideos.length === 0) {
            res.status(422).json({ message: 'Deve-se categorizar pelo menos 1 vídeo!' })
            return
        }else {
            updateData.video = idOfVideos
        }

        // Verifica se o id é válido
        if(!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido!' })
            return
        }

        if(!ObjectId.isValid(idOfVideos.toString())) {
            res.status(422).json({ message: 'ID do vídeo inválido!' })
            return
        }

        // Aqui é a verificação para que o usuário só categorize seus vídeos
        for (let i = 0; i < idOfVideos.length; i++) {
            const videoTag = await Video.findOne({ _id: idOfVideos[i] })

            if(videoTag.user._id.toString() !== user._id.toString()) {
                res.status(422).json({ message: 'Não se pode categorizar vídeos de outros usuários!' })
                return
            }  
        }

        const nameTagVerify = await Tag.findOne({ name: nameUpper })

        if(nameTagVerify) {
            res.status(422).json({ message: 'Já existe uma tag com esse nome, por favor utilize outro!' })
            return
        }

        if(tag.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'Tag não pertence ao usuário, ação negada!' })
            return
        }
        
        try {
            const tagUpdate = await Tag.findByIdAndUpdate(id, updateData)

            res.status(200).json({ message: 'tag Atualizado com sucesso!', tagUpdate })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    static async deleteTag(req, res) {
        const id = req.params.id

        // Verifica se o id é válido
        if(!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido!' })
            return
        }

        const tag = await Tag.findOne({ _id: id })

        if(!tag) {
            res.status(404).json({ message: 'Tag não encontrada!' })
            return
        }

        // Verifica se a Tag pertence ao usuário
        const token = getToken(req)
        const user = await getUserByToken(token)

        if(tag.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'Tag não pertence ao usuário, ação negada!' })
            return
        }

        try {
            await Tag.findByIdAndRemove(id)

            res.status(200).json({ message: 'Tag removida com sucesso!' })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }
}