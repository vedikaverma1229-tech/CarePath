import { Request, Response } from 'express';
import { aiService } from '../services/aiService';

/**
 * =========================================================================
 * AI MODULE PLACEHOLDER
 * TO BE IMPLEMENTED BY PROJECT OWNER
 * =========================================================================
 */

export const startAISession = (req: Request, res: Response) => {
  try {
    const { language = 'en' } = req.body;
    const session = aiService.startConversation(language);
    res.json({
      success: true,
      sessionId: session.sessionId,
      session,
      message: 'AI session initialized (Integration Placeholder)',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to start AI session', error: error?.message });
  }
};

export const postAIMessage = async (req: Request, res: Response) => {
  try {
    const {
      sessionId,
      message,
      demoMode = false,
      language = 'en',
      model,
      role,
      useSearchGrounding,
    } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const result = await aiService.sendMessage({
      sessionId: sessionId || '',
      message,
      useDemoMode: demoMode,
      language,
      model,
      role,
      useSearchGrounding,
    });

    res.json({
      success: true,
      data: result,
      aiProvider: result.aiProvider,
      modelUsed: result.modelUsed,
      groundingSources: result.groundingSources,
      searchQueries: result.searchQueries,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to process AI message', error: error?.message });
  }
};

export const postAIAnswer = async (req: Request, res: Response) => {
  return postAIMessage(req, res);
};

export const getAISession = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const session = aiService.getSession(id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }
    res.json({ success: true, session });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve session', error: error?.message });
  }
};

export const clearAISession = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    aiService.clearSession(id);
    res.json({ success: true, message: 'Session cleared' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to clear session', error: error?.message });
  }
};
