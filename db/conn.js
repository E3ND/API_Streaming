const mongoose = require('mongoose')

// Conexão
async function main() {
    await mongoose.connect('mongodb://localhost:27017/streaming')
    console.log('Conectado ao mongoose!')
}

main().catch((error) => console.log(error))

module.exports = mongoose