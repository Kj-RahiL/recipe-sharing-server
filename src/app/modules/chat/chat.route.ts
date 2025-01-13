import { Router } from 'express';
import { Auth } from '../../middlewares/auth';
import { ChatController } from './chat.controller';

const router = Router();

// send chat room message
// router.post('/message', auth());

// Get All chat room messages
router.get('/', Auth(), ChatController.getAllMessage);
// edit message
router.put('/:id', Auth(), ChatController.updateChatMessage);
// delete message
router.delete('/:id', Auth(), ChatController.deleteChatMessage);

export const ChatRoutes = router;