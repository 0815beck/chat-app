class DatabaseError {
    
    status = 500

    constructor(message) {
        this.message = message
    }
}

module.exports = DatabaseError