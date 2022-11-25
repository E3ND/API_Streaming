const express = require('express')
const cors = require('cors')

//Importando rotas
const UserRoutes = require('./routes/UserRoutes')
const VideoRoutes = require('./routes/VideoRoutes')
const TagRoutes = require('./routes/TagRoutes')

const app = express()

//Conexão
const conn = require('./db/conn').run

// Configuração do JSON
app.use(express.json())

// Permissão para qualquer siteacessar a API
app.use(cors())

// Caminho publico para as images
app.use(express.static('public'))

//Rotas
app.use('/users', UserRoutes)
app.use('/videos', VideoRoutes)
app.use('/tags', TagRoutes)

app.listen(3333)