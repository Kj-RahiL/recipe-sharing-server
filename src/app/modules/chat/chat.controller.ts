import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ChatServices } from './chat.service';

// get All chat message
const getAllMessage = catchAsync(async (req, res) => {
  const result = await ChatServices.getAllChatMessageFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'message retrieved successfully',
    data: result,
  });
});

const updateChatMessage = catchAsync(async (req, res) => {
  const messageId = req.params.id;
  const userId = req.params.id;
  const { message } = req.body;

  // console.log(groupId, userId, req.body);
  const result = await ChatServices.updateChatMessageIntoDb(
    messageId,
    userId,
    message,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success:true,
    message: 'Chat Message Updated successfully',
    data: result,
  });
});

const deleteChatMessage = catchAsync(async (req, res) => {
  const messageId = req.params.id;
  const userId = req.params.id;
  const result = await ChatServices.deleteChatMessageIntoDb(
    messageId,
    userId,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success:true,
    message: 'Chat Message deleted successfully',
    data: result,
  });
});

export const ChatController = {
  getAllMessage,
  updateChatMessage,
  deleteChatMessage,
};