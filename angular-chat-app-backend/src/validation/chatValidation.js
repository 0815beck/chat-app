const ValidationError = require('../errors/ValidationError')
const userService = require('../services/userService')


const validateNewChatData = async (chatName, userId, memberIds) => {

    if (!memberIds) {
        throw new ValidationError(422, 'Can not create chat: ' + 
            'You have to provide a list of member ids.'
        )
    }

    if (!memberIds.includes(userId)) {
        throw new ValidationError(422, 'Can not create chat: ' + 
            'You have to be a member of any new chat which you create.'
        )
    }

    if (!await userService.exists(userId)) {
        throw new ValidationError(422, 'Can not create chat: ' + 
            'id of token bearer does not appear in the database.'
        )
    }

    for (const id of memberIds) {
        if (!await userService.exists(id)) {
            throw new ValidationError(422, 'Can not create chat: ' + 
                'Some of the ids in the memberId list do not appear in the user database.'
            )
        }
    }

    if (!chatName) {
        throw new ValidationError(422, 'Can not create chat: ' + 
            'You have to provide a chat name.'
        )
    }

    if (chatName.trim().length === 0) {
        throw new ValidationError(422, 'Can not create chat: ' +
            'Your chat name must contain some characters other than witespace.'
        )
    }
}

module.exports = { validateNewChatData }