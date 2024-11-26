class AuthenticationError {
    
    status = 401

    constructor(message) {
        this.message = message
    }
}

module.exports = AuthenticationError