import { Server, Socket } from 'socket.io';
import { Chat } from '../modules/chat/chat.model';

const singleChatHandler = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('Single Chat: User connected:', socket.id);

    // User joins their private room
    socket.on('joinChat', data => {
      const { userId, otherUserId } = data;

      const roomId = [userId, otherUserId].sort().join('-'); // Example: "user1-user2"
      socket.join(roomId);
      console.log(`User ${userId} joined room ${roomId}`);
    });

    // Listen for loading messages
    socket.on('loadMessage', async (data) => {
      const { senderId, receiverId } = data;

      const roomId = [senderId, receiverId].sort().join('-');
      console.log(`Loading messages for room ${roomId}`);

      try {
        // Fetch messages for the room from the database
        const messages = await Chat.find({
          $or: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId },
          ],
        }).sort({ createdAt: 1 }); // Sort messages by creation date (oldest to newest)

        // Send messages back to the client
        socket.emit('loadMessageSuccess', { roomId, messages });
      } catch (error) {
        console.error('Error loading messages:', error);
        socket.emit('loadMessageError', { error: 'Failed to load messages' });
      }
    });

    // Listen for sending a single chat message
    socket.on('sendMessage', async data => {
      const { senderId, receiverId, message } = data;
      console.log(data);

      const roomId = [senderId, receiverId].sort().join('-');
      console.log(`Message sent to room ${roomId}:`, message);

      try {
        // Save the message in the database
        const chatMessage = await Chat.create({
          senderId,
          receiverId,
          content: message,
        });

        // Send the message to the receiver
        io.to(roomId).emit('receiveMessage', chatMessage);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('sendMessageError', { error: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('typing', data => {
      const { senderId, receiverId } = data;
      const roomId = [senderId, receiverId].sort().join('-');

      socket.to(roomId).emit('userTyping', { senderId });
    });

    // Read receipts
    socket.on('markAsRead', async data => {
      const { messageIds } = data;

      try {
        // Mark messages as read in the database
        await Chat.updateMany(
          { _id: { $in: messageIds } },
          { isRead: true }
        );

        // Notify others in the chat room
        socket.emit('messagesRead', { messageIds });
      } catch (error) {
        console.error('Error marking messages as read:', error);
        socket.emit('markAsReadError', { error: 'Failed to mark messages as read' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Single Chat: User disconnected:', socket.id);
    });
  });
};

export default singleChatHandler;
