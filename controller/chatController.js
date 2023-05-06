const ChatModel = require("../model/chatModel");
const SightModel = require("../model/sightModel");
const path = require("path");
const ObjectId = require('mongodb').ObjectId;

async function getChatList(sight) {
    return ChatModel.find({sight: sight}).sort({date: 1}).exec();
}
async function insertChat(chatData){
    let chat = new ChatModel({
        sight: chatData.sight,
        sender_id: chatData.sender_id,
        content:chatData.content,
        date: chatData.date
    })
    let result = await chat.save()
}
async function insertChatList(chatDataList){
    const chatList = chatDataList.map(chatData => {
        const chat = new ChatModel({
            sight: chatData.sight,
            sender_id: chatData.sender_id,
            content: chatData.content,
            date: chatData.date
        });
        return chat.save();
    });
    await Promise.all(chatList);
}