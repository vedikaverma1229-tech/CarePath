import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, X, AlertTriangle, Sparkles, RefreshCw, PhoneCall } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGuidanceGenerated?: (guidance: any) => void;
}

export const LiveVoiceModal: React.FC<LiveVoiceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { language } = useLanguage();
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking' | 'fallback' | 'error'>('idle');
  const [statusText, setStatusText] = useState<string>('Connecting to CarePath Voice...');
  const [transcript, setTranscript] = useState<string>('');
  const [assistantReply, setAssistantReply] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [isEmergency, setIsEmergency] = useState<boolean>(false);

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) {
      cleanup();
      return;
    }

    startLiveSession();

    return () => {
      cleanup();
    };
  }, [isOpen]);

  const cleanup = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setStatus('idle');
    setAudioLevel(0);
  };

  const startLiveSession = async () => {
    setStatus('connecting');
    setStatusText('Connecting to CarePath Live Voice API...');
    setTranscript('');
    setAssistantReply('');
    setIsEmergency(false);

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/live-voice`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = async () => {
        setStatusText('Connected to Live Voice. Activating microphone...');
        await setupMicrophone(ws);
      };

      ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'status') {
            if (data.fallbackRequired) {
              startWebSpeechFallback();
            } else if (data.connected) {
              setStatus('listening');
              setStatusText('Listening... Speak your health concern naturally.');
            }
          } else if (data.type === 'audio') {
            setStatus('speaking');
            setStatusText('CarePath is speaking...');
            playAudioChunk(data.audio);
          } else if (data.type === 'text') {
            setAssistantReply((prev) => prev + ' ' + data.text);
            checkEmergencyKeywords(data.text);
          } else if (data.type === 'interrupted') {
            setStatus('listening');
            setStatusText('Listening to you...');
            nextStartTimeRef.current = 0;
          } else if (data.type === 'error') {
            startWebSpeechFallback();
          }
        } catch (e) {
          console.warn('Live voice message parse error:', e);
        }
      };

      ws.onerror = () => {
        startWebSpeechFallback();
      };

      ws.onclose = () => {
        if (status !== 'idle' && status !== 'fallback') {
          setStatus('idle');
        }
      };
    } catch {
      startWebSpeechFallback();
    }
  };

  const setupMicrophone = async (ws: WebSocket) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      mediaStreamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass({ sampleRate: 16000 });
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const processor = audioCtx.createScriptProcessor(2048, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (isMuted || ws.readyState !== WebSocket.OPEN) return;

        const inputData = e.inputBuffer.getChannelData(0);
        let sumSquares = 0;
        for (let i = 0; i < inputData.length; i++) {
          sumSquares += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sumSquares / inputData.length);
        setAudioLevel(Math.min(100, Math.floor(rms * 400)));

        const pcm16 = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }

        const uint8 = new Uint8Array(pcm16.buffer);
        let binary = '';
        for (let i = 0; i < uint8.byteLength; i++) {
          binary += String.fromCharCode(uint8[i]);
        }
        const base64Audio = btoa(binary);

        ws.send(
          JSON.stringify({
            realtimeInput: {
              mediaChunks: [
                {
                  mimeType: 'audio/pcm;rate=16000',
                  data: base64Audio,
                },
              ],
            },
          })
        );
      };

      source.connect(processor);
      processor.connect(audioCtx.destination);
      setStatus('listening');
      setStatusText('Listening... Speak clearly in your language.');
    } catch (err) {
      console.warn('Microphone stream error, falling back to speech recognition:', err);
      startWebSpeechFallback();
    }
  };

  const playAudioChunk = (base64Data: string) => {
    try {
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
      }

      const audioCtx = audioContextRef.current;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const binaryStr = atob(base64Data);
      const len = binaryStr.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      const pcm16 = new Int16Array(bytes.buffer);

      const buffer = audioCtx.createBuffer(1, pcm16.length, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < pcm16.length; i++) {
        channelData[i] = pcm16[i] / 32768.0;
      }

      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);

      const currentTime = audioCtx.currentTime;
      if (nextStartTimeRef.current < currentTime) {
        nextStartTimeRef.current = currentTime;
      }

      source.start(nextStartTimeRef.current);
      nextStartTimeRef.current += buffer.duration;

      source.onended = () => {
        if (audioCtx.currentTime >= nextStartTimeRef.current - 0.1) {
          setStatus('listening');
          setStatusText('Listening... Feel free to ask more.');
        }
      };
    } catch (err) {
      console.warn('Audio chunk playback error:', err);
    }
  };

  const startWebSpeechFallback = () => {
    setStatus('fallback');
    setStatusText('Listening with Voice Assistant...');

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatus('error');
      setStatusText('Speech recognition not available. Please use chat.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      let langTag = 'en-IN';
      if (language === 'hi') langTag = 'hi-IN';
      if (language === 'mr') langTag = 'mr-IN';
      recognition.lang = langTag;

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
        checkEmergencyKeywords(currentText);
      };

      recognition.onerror = () => {
        setStatusText('Voice input unavailable. Please use text chat.');
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch {
      setStatus('error');
    }
  };

  const checkEmergencyKeywords = (text: string) => {
    const criticalWords = [
      'chest pain',
      'breathless',
      'heart attack',
      'unconscious',
      'severe bleeding',
      'stroke',
      'सीने में दर्द',
      'सांस नहीं',
      'छातीत दुखणे',
    ];
    if (criticalWords.some((w) => text.toLowerCase().includes(w))) {
      setIsEmergency(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative border flex flex-col items-center text-center overflow-hidden"
        style={{
          backgroundColor: '#FFFFFF',
          borderColor: '#F4B6B6',
        }}
      >
        {/* Top close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
          aria-label="Close voice assistant"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Live Badge */}
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4 border"
          style={{
            backgroundColor: '#FFF1F1',
            color: '#D94A4A',
            borderColor: '#F4B6B6',
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>CarePath Real-Time Voice Consultation</span>
        </div>

        <h3 className="font-['Outfit'] text-2xl font-bold tracking-tight" style={{ color: '#252525' }}>
          Voice Health Assistant
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          Speak naturally in Hindi, Marathi, or English. CarePath will listen and guide you in real-time.
        </p>

        {/* Emergency Alert Banner if triggered */}
        {isEmergency && (
          <div
            className="w-full mt-4 p-3 rounded-2xl border flex items-center justify-between gap-3 text-left animate-bounce"
            style={{ backgroundColor: '#FFF1F1', borderColor: '#9E2020' }}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0" style={{ color: '#9E2020' }} />
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wide block" style={{ color: '#9E2020' }}>
                  Urgent Escalation
                </span>
                <span className="text-[11px] text-slate-800">
                  Critical symptoms detected. Please dial 112 immediately.
                </span>
              </div>
            </div>
            <a
              href="tel:112"
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-white shrink-0 shadow-xs flex items-center gap-1 hover:bg-[#A83232]"
              style={{ backgroundColor: '#9E2020' }}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call 112</span>
            </a>
          </div>
        )}

        {/* Pulsing Voice Sphere */}
        <div className="relative my-8 flex items-center justify-center">
          <div
            className="absolute rounded-full transition-all duration-300 pointer-events-none"
            style={{
              width: `${140 + audioLevel * 1.2}px`,
              height: `${140 + audioLevel * 1.2}px`,
              backgroundColor: '#FFF1F1',
              opacity: 0.8,
            }}
          />

          <div
            className="relative w-28 h-28 rounded-full flex items-center justify-center text-white shadow-xl transition-transform duration-200"
            style={{
              backgroundColor: status === 'speaking' ? '#A83232' : '#D94A4A',
              transform: `scale(${1 + audioLevel * 0.003})`,
            }}
          >
            {status === 'connecting' ? (
              <RefreshCw className="w-10 h-10 animate-spin text-white" />
            ) : status === 'speaking' ? (
              <Volume2 className="w-10 h-10 animate-pulse text-white" />
            ) : isMuted ? (
              <MicOff className="w-10 h-10 text-white" />
            ) : (
              <Mic className="w-10 h-10 text-white animate-pulse" />
            )}
          </div>
        </div>

        {/* Sound Wave Bars */}
        <div className="flex items-center justify-center gap-1.5 h-8 mb-4">
          {[1, 2, 3, 4, 5, 6, 7].map((bar) => {
            const h = Math.max(6, Math.min(28, (audioLevel / 100) * 28 * (1 + Math.sin(bar * 0.8))));
            return (
              <div
                key={bar}
                className="w-1.5 rounded-full transition-all duration-100"
                style={{
                  height: `${status === 'speaking' || audioLevel > 5 ? h : 6}px`,
                  backgroundColor: status === 'speaking' ? '#A83232' : '#D94A4A',
                }}
              />
            );
          })}
        </div>

        {/* Live Status Description */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: status === 'speaking' ? '#A83232' : '#2E9B68' }}
          />
          <span className="text-xs font-semibold" style={{ color: '#252525' }}>
            {statusText}
          </span>
        </div>

        {/* Transcript Box */}
        {(transcript || assistantReply) && (
          <div
            className="w-full rounded-2xl p-4 text-left text-xs space-y-2 max-h-36 overflow-y-auto border mb-4"
            style={{ backgroundColor: '#FFF9F9', borderColor: '#F4B6B6' }}
          >
            {transcript && (
              <div>
                <span className="font-bold block text-[10px] uppercase text-slate-400">You:</span>
                <p className="font-medium text-slate-800">{transcript}</p>
              </div>
            )}
            {assistantReply && (
              <div className="pt-1 border-t border-slate-200">
                <span className="font-bold block text-[10px] uppercase" style={{ color: '#D94A4A' }}>
                  CarePath AI:
                </span>
                <p className="text-slate-800 font-medium">{assistantReply}</p>
              </div>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="px-4 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5"
            style={{
              backgroundColor: isMuted ? '#FFF1F1' : '#FFFFFF',
              color: isMuted ? '#D94A4A' : '#252525',
              borderColor: '#F4B6B6',
            }}
          >
            {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            <span>{isMuted ? 'Unmute' : 'Mute Mic'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#A83232]"
            style={{ backgroundColor: '#D94A4A' }}
          >
            Done / Close
          </button>
        </div>

        {/* Safety Footer */}
        <p className="text-[10px] text-slate-400 mt-4 leading-tight">
          CarePath provides healthcare guidance and navigation support, not a medical diagnosis.
        </p>
      </div>
    </div>
  );
};
