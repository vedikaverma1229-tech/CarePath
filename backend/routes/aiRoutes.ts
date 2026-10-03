import { Router } from 'express';
import { startAISession, postAIMessage, postAIAnswer, getAISession, clearAISession } from '../controllers/aiController';

const router = Router();

router.post('/ai/start', startAISession);
router.post('/ai/message', postAIMessage);
router.post('/ai/answer', postAIAnswer);
router.get('/ai/session/:id', getAISession);
router.delete('/ai/session/:id', clearAISession);

export default router;
