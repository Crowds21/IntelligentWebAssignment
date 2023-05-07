const ChatModel = require("../model/chatModel");
const ObjectId = require('mongodb').ObjectId;
async function getChatList(sight) {
    return ChatModel.find({sight_id: sight}).sort({date: 1}).exec();
}
async function insertChat(chatData){
    let chat = new ChatModel({
        sight_id: chatData.sight_id,
        sender_id: chatData.user,
        content:chatData.content
    })
    let result = await chat.save()
    console.log(result)
}
async function insertChatList(chatDataList){
    const chatList = chatDataList.map(chatData => {
        const chat = new ChatModel({
            sight_id: chatData.sight_id,
            sender_id: chatData.user,
            content: chatData.content,
        });
        return chat.save();
    });
    await Promise.all(chatList);
}

module.exports = {
    getChatList,
    insertChatList,
    insertChat
}