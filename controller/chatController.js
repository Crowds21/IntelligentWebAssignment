// Import the required modules
const ChatModel = require("../model/chatModel");
const ObjectId = require('mongodb').ObjectId;

/**
 * Fetches the chat messages for one of the particular sights
 * @param {string} sight - The ID of the sight for which you want to fetch all the chat messages
 * @returns {Promise<Array>} - An array of chat messages for the sight
 */
async function getChatList(sight) {
    // Use the ChatModel to find all chat messages for the specified sight and sort them by date
    return ChatModel.find({sight_id: sight}).sort({date: 1}).exec();
}

/**
 * Inserts a single chat message into the database
 * @param {Object} chatData - The data for the chat message to be inserted
 * @param {string} chatData.sight_id - The ID of the sight for which the chat message was sent
 * @param {string} chatData.user - The ID of the user who sent the chat message
 * @param {string} chatData.content - The content of the chat message
 */
async function insertChat(chatData){
    // Create a new ChatModel instance using the provided chatData
    let chat = new ChatModel({
        sight_id: chatData.sight_id,
        sender_id: chatData.user,
        content:chatData.content
    })
    // Save the new chat message to the database and log the result
    let result = await chat.save()
    console.log(result)
}

/**
 * Inserts multiple chat messages into the database
 * @param {Array<Object>} chatDataList - An array of chat messages to be inserted
 */
async function insertChatList(chatDataList){
    // Create an array of Promises that will save each chat message to the database
    const chatList = chatDataList.map(chatData => {
        const chat = new ChatModel({
            sight_id: chatData.sight_id,
            sender_id: chatData.user,
            content: chatData.content,
        });
        return chat.save();
    });
    // Wait for all Promises to resolve before returning
    await Promise.all(chatList);
}

// Export the functions for use in other modules
module.exports = {
    getChatList,
    insertChatList,
    insertChat
}
