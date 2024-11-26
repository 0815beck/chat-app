class AuthorizationError {

    status = 403

    constructor(message) {
        this.message = message
    }
}

module.exports = AuthorizationError