import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import http from 'http';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

import doctorRoutes from './backend/routes/doctorRoutes';
import hospitalRoutes from './backend/routes/hospitalRoutes';
import appointmentRoutes from './backend/routes/appointmentRoutes';
import aiRoutes from './backend/routes/aiRoutes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      app: 'CAREPATH',
      tagline: 'From Referral to the Right Care',
      version: '1.0.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      modules: {
        aiPlaceholder: 'READY',
        doctorMatching: 'READY',
        hospitalDiscovery: 'READY',
        emergencyGateway: 'READY',
      },
    });
  });

  // REST API Routes
  app.use('/api', doctorRoutes);
  app.use('/api', hospitalRoutes);
  app.use('/api', appointmentRoutes);
  app.use('/api', aiRoutes);



  // Vite Integration in Development
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const server = http.createServer(app);

  // WebSocket Server for Gemini 3.8 Live Real-Time Voice Conversations
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    const url = new URL(request.url || '', `http://${request.headers.host || 'localhost'}`);
    if (url.pathname === '/api/live-voice') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  });

  wss.on('connection', async (clientWs: WebSocket) => {
    console.log('[Live Voice] Client connected to /api/live-voice');
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      clientWs.send(
        JSON.stringify({
          type: 'status',
          connected: false,
          fallbackRequired: true,
          message: 'Gemini API key not configured on server. Browser voice recognition active.',
        })
      );
      return;
    }

    try {
      const liveAi = new GoogleGenAI({ apiKey });
      const liveSession = await liveAi.live.connect({
        model: 'gemini-3.8-live',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction:
            'You are CarePath AI Health Assistant, an empathetic rural healthcare guidance voice assistant. Tagline: "From Referral to the Right Care". You ask 1-2 focused questions about duration and severity. You provide safe next-step guidance (Home Care, Clinic, or Urgent Hospital). Never provide a definitive diagnosis or prescribe drug doses. If severe chest pain or emergency, instruct to call 112 immediately. Speak clearly and concisely in the user\'s language (English, Hindi, or Marathi).',
          outputAudioTranscription: {},
        },
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            const textData = message.serverContent?.modelTurn?.parts?.[0]?.text;

            if (audioData && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ type: 'audio', audio: audioData }));
            }
            if (textData && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ type: 'text', text: textData }));
            }
            if (message.serverContent?.interrupted && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ type: 'interrupted' }));
            }
          },
          onclose: () => {
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ type: 'status', message: 'Live session closed' }));
            }
          },
          onerror: (err: any) => {
            console.warn('[Live Voice] Gemini error:', err?.message || err);
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(
                JSON.stringify({
                  type: 'error',
                  message: err?.message || 'Live API connection error',
                })
              );
            }
          },
        },
      });

      clientWs.send(
        JSON.stringify({
          type: 'status',
          connected: true,
          model: 'gemini-3.8-live',
          message: 'Connected to Gemini 3.8 Live API real-time voice',
        })
      );

      clientWs.on('message', (data: any) => {
        try {
          const parsed = JSON.parse(data.toString());
          if (parsed.audio) {
            liveSession.sendRealtimeInput({
              audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' },
            });
          } else if (parsed.text) {
            liveSession.sendRealtimeInput({
              text: parsed.text,
            });
          }
        } catch (msgErr) {
          console.error('[Live Voice] Error forwarding input:', msgErr);
        }
      });

      clientWs.on('close', () => {
        console.log('[Live Voice] Client disconnected');
        try {
          liveSession.close();
        } catch (e) {
          // ignore
        }
      });
    } catch (err: any) {
      console.warn('[Live Voice] Failed to initialize gemini-3.8-live:', err?.message || err);
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(
          JSON.stringify({
            type: 'status',
            connected: false,
            fallbackRequired: true,
            message: 'Live voice server unavailable. Client speech recognition active.',
          })
        );
      }
    }
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`CarePath full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start CarePath server:', err);
  process.exit(1);
});
