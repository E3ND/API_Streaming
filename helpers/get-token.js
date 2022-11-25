const getToken = (req) => {
    // Setando o token vindo do header
    const authHeader = req.headers.authorization

    const token = authHeader.split(' ')[1]

    return token
}

module.exports = getToken