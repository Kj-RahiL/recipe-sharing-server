import AppError from "../../errors/appError";
import { Chat } from "./chat.model";

// Get All Chat Messages
const getAllChatMessageFromDB = async () => {
  const chatMessages = await Chat.find()
    .populate("senderId", "firstName lastName email profilePicture isSubscribed role")
    .populate("receiverId", "firstName lastName email profilePicture isSubscribed role");

  if (!chatMessages || chatMessages.length === 0) {
    throw new AppError(404, "No chat messages found");
  }

  return chatMessages;
};

// Update a Chat Message
const updateChatMessageIntoDb = async (id: string, userId: string, content: string) => {
  // Find the chat message by ID
  const chatMessage = await Chat.findById(id);
  if (!chatMessage) {
    throw new AppError(404, "Chat message not found");
  }

  // Check if the user is the sender of the message
  if (chatMessage.senderId.toString() !== userId) {
    throw new AppError(403, "You are not authorized to update this chat message");
  }

  // Update the chat message content
  const updateChat= await Chat.findByIdAndUpdate(id, {content}, {new:true} ) 


  return updateChat;
};

// Delete a Chat Message
const deleteChatMessageIntoDb = async (id: string, userId: string) => {
  // Find the chat message by ID
  const chatMessage = await Chat.findById(id);

  if (!chatMessage) {
    throw new AppError(404, "Chat message not found");
  }

  // Check if the user is the sender of the message
  if (chatMessage.senderId.toString() !== userId) {
    throw new AppError(403, "You are not authorized to delete this chat message");
  }

  // Delete the chat message
  await chatMessage.deleteOne();

  return { message: "Chat message deleted successfully" };
};

export const ChatServices = {
  getAllChatMessageFromDB,
  updateChatMessageIntoDb,
  deleteChatMessageIntoDb,
};
