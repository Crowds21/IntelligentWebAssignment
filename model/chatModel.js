const mongoose = require('mongoose');

/**
 * @typedef {Object} ChatDocument
 * @property {string} sight_id - Sight ID.
 * @property {string} sender_id - Sender ID.
 * @property {string} content - Chat content.
 */

const ChatSchema = new mongoose.Schema(
    {
        sight_id: { type: String, required: true },
        sender_id: { type: String, required: true, maxlength: 50 },
        content: { type: String, required: true, maxlength: 1000 },
    },
    {
        // Sets the virtuals to be true on the document object.
        toObject: { virtuals: true },
    }
);

/**
 * Chat model.
 * @typedef {import('mongoose').Model<ChatDocument>} ChatModel
 */
const ChatModel = mongoose.model('chat', ChatSchema, 'chats');

module.exports = ChatModel;