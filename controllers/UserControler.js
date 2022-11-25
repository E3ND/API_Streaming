const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/User')

// Helpers
const createUserToken = require('../helpers/create-user-token')

module.exports = class UserControler {
    static async register(req, res) {
        // Cadastro de usuário
        const { name, email, password } = req.body

        let image = ''

        if(req.file) {
            image = req.file.filename
        }

        // Validações
        if(!name) {
            res.status(422).json({ message: 'O campo nome é obrigatório!' })
            return
        }

        if(!email) {
            res.status(422).json({ message: 'O campo e-mail é obrigatório!' })
            return
        }

        if(!password) {
            res.status(422).json({ message: 'O campo senha é obrigatório!' })
            return
        }

        const userExists = await User.findOne({ email: email })

        if(userExists) {
            res.status(422).json({ message: 'E-mail já cadastrado, utilize outro e-mail!'})
            return
        }

        // Criptografando senha
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        // Criação do  usuário
        const user = new User({
            name,
            email,
            password: passwordHash,
            image,
        })

        try {
            const newUser = await user.save()

            // Criando token
            await createUserToken(newUser, req, res)

        } catch(error) {
            res.status(500).json({ message: error })
        }
    }

    static async login(req, res) {
        const { email, password } = req.body

        // Validações
        if(!email) {
            res.status(422).json({ message: 'O campo e-mail é obrigatório!' })
            return
        }

        if(!password) {
            res.status(422).json({ message: 'O campo senha é obrigatório!'})
            return
        }

        const user = await User.findOne({ email: email })

        if(!user) {
            res.status(422).json({ message: 'Não existe usuário cadastrado com este e-mail!'})
            return
        }

        const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword) {
            res.status(422).json({ message: 'Senha incorreta!' })
            return
        }

        // Se passarpelas verificações, cria o token do usuário
        await createUserToken(user, req, res)
    }
}