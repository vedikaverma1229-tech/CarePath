import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertCircle, RotateCcw, Volume2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface VoiceAssistantCardProps {
  onSpeechRecognized: (text: string) => void;
  onSendDirectly?: (text: string) => void;
  isProcessing?: boolean;
}

export const VoiceAssistantCard: React.FC<VoiceAssistantCardProps> = ({
  onSpeechRecognized,
  onSendDirectly,
  isProcessing = false,
}) => {
  const { language } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [lastFinishedSpeech, setLastFinishedSpeech] = useState('');
  
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);

  const getLanguageTag = (lang: string) => {
    switch (lang) {
      case 'hi':
        return 'hi-IN';
      case 'mr':
        return 'mr-IN';
      case 'en':
      default:
        return 'en-IN';
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  const stopListening = () => {
    if (recognitionRef.current && isListeningRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore
      }
    }
    isListeningRef.current = false;
    setIsListening(false);
  };

  const startListening = async () => {
    setPermissionDenied(false);
    setLiveTranscript('');
    setLastFinishedSpeech('');

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      } catch (err: any) {
        console.warn('Microphone permission check error:', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setPermissionDenied(true);
          return;
        }
      }
    }

    try {
      stopListening();
      const recognizer = new SpeechRecognition();
      recognizer.continuous = false;
      recognizer.interimResults = true;
      recognizer.maxAlternatives = 1;
      recognizer.lang = getLanguageTag(language);

      recognizer.onstart = () => {
        isListeningRef.current = true;
        setIsListening(true);
      };

      recognizer.onresult = (event: any) => {
        let currentFinal = '';
        let currentInterim = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          if (result.isFinal) {
            currentFinal += result[0].transcript;
          } else {
            currentInterim += result[0].transcript;
          }
        }

        const display = currentFinal || currentInterim;
        if (display) {
          setLiveTranscript(display);
        }
      };

      recognizer.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error);
        isListeningRef.current = false;
        setIsListening(false);
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setPermissionDenied(true);
        }
      };

      recognizer.onend = () => {
        isListeningRef.current = false;
        setIsListening(false);
        if (liveTranscript.trim()) {
          const finalResult = liveTranscript.trim();
          setLastFinishedSpeech(finalResult);
          onSpeechRecognized(finalResult);
        }
      };

      recognitionRef.current = recognizer;
      recognizer.start();
    } catch (err) {
      console.warn('Could not start recognition:', err);
      setIsListening(false);
    }
  };

  const toggleMic = () => {
    if (isListening) {
      stopListening();
      if (liveTranscript.trim()) {
        const finalResult = liveTranscript.trim();
        setLastFinishedSpeech(finalResult);
        onSpeechRecognized(finalResult);
      }
    } else {
      startListening();
    }
  };

  return (
    <div
      className="rounded-2xl border p-5 sm:p-6 shadow-xs relative overflow-hidden transition-all"
      style={{
        backgroundColor: '#FFFFFF',
        borderColor: '#F4B6B6',
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Left Section: Header & Status */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border"
              style={{
                backgroundColor: '#FFF1F1',
                color: '#D94A4A',
                borderColor: '#F4B6B6',
              }}
            >
              Voice Assistance
            </span>
            {isListening && (
              <span className="flex items-center gap-1 text-xs font-bold" style={{ color: '#A83232' }}>
                <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: '#D94A4A' }} />
                <span>Listening...</span>
              </span>
            )}
            {!isListening && isSupported && (
              <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#2E9B68' }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#2E9B68' }} />
                <span>Ready</span>
              </span>
            )}
          </div>

          <h3 className="font-['Outfit'] font-bold text-lg sm:text-xl" style={{ color: '#252525' }}>
            Talk naturally with CarePath
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {isListening
              ? 'Please speak clearly. Your voice is translated directly into your consultation chat.'
              : language === 'hi'
              ? 'माइक दबाएं और अपनी समस्या हिंदी में बोलें (जैसे: मुझे 3 दिन से बुखार है).'
              : language === 'mr'
              ? 'माइक दाबा आणि मराठीत बोला (उदा: मला ३ दिवसांपासून ताप आहे).'
              : 'Click the microphone and speak your symptoms. Transcribes directly to CarePath AI.'}
          </p>
        </div>

        {/* Right Section: Big Interactive Microphone Button */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={toggleMic}
              disabled={!isSupported || isProcessing}
              aria-label={isListening ? 'Stop listening' : 'Start speaking'}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-md transition-all active:scale-95 ${
                isListening
                  ? 'animate-pulse ring-4 ring-[#F4B6B6]'
                  : 'hover:opacity-95'
              }`}
              style={{
                backgroundColor: isListening
                  ? '#A83232' // Listening state: #A83232
                  : isSupported
                  ? '#D94A4A' // Primary CTA: #D94A4A
                  : '#9E2020',
              }}
              title={
                !isSupported
                  ? 'Voice input unavailable'
                  : isListening
                  ? 'Listening... Click to finish'
                  : 'Click to start speaking'
              }
            >
              {isListening ? (
                <div className="flex flex-col items-center">
                  <Mic className="w-7 h-7 text-white animate-bounce" />
                  <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Stop</span>
                </div>
              ) : isSupported ? (
                <div className="flex flex-col items-center">
                  <Mic className="w-7 h-7 text-white" />
                  <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Speak</span>
                </div>
              ) : (
                <MicOff className="w-7 h-7 text-white" />
              )}
            </button>
            <span className="text-[10px] font-bold mt-1 text-slate-500">
              {isListening ? '● Listening...' : 'Click to start speaking'}
            </span>
          </div>
        </div>

      </div>

      {/* Permission Denied UI */}
      {permissionDenied && (
        <div
          className="mt-4 p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-fadeIn"
          style={{
            backgroundColor: '#FFF1F1',
            borderColor: '#A83232',
            color: '#252525',
          }}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#9E2020] shrink-0" />
            <span>Microphone access is required for voice assistance.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={startListening}
              className="px-3 py-1.5 rounded-lg font-bold text-white text-xs shadow-2xs hover:opacity-95"
              style={{ backgroundColor: '#D94A4A' }}
            >
              TRY AGAIN
            </button>
            <button
              type="button"
              onClick={() => setPermissionDenied(false)}
              className="px-3 py-1.5 rounded-lg font-bold border text-xs bg-white hover:bg-slate-50"
              style={{ borderColor: '#F4B6B6' }}
            >
              CONTINUE WITH TEXT
            </button>
          </div>
        </div>
      )}

      {/* Live Transcript Display Box */}
      {(liveTranscript || isListening || lastFinishedSpeech) && (
        <div
          className="mt-4 p-3.5 rounded-xl border space-y-2 animate-fadeIn"
          style={{
            backgroundColor: '#FFF9F9',
            borderColor: '#F4B6B6',
          }}
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold flex items-center gap-1.5" style={{ color: '#A83232' }}>
              {isListening ? (
                <>
                  <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: '#D94A4A' }} />
                  <span>Live Transcript (Speaking...)</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#2E9B68' }} />
                  <span>Recognized Speech</span>
                </>
              )}
            </span>
            <span className="text-[10px] text-slate-400">
              Language: {language === 'hi' ? 'हिंदी (hi-IN)' : language === 'mr' ? 'मराठी (mr-IN)' : 'English (en-IN)'}
            </span>
          </div>

          <p className="text-sm font-medium text-[#252525] italic leading-relaxed">
            “{liveTranscript || lastFinishedSpeech || 'Listening for your symptoms...'}”
          </p>

          {!isListening && lastFinishedSpeech && (
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500">Speech placed in input.</span>
              {onSendDirectly && (
                <button
                  type="button"
                  onClick={() => onSendDirectly(lastFinishedSpeech)}
                  className="px-3 py-1 rounded-lg text-xs font-bold text-white shadow-2xs flex items-center gap-1 hover:opacity-95"
                  style={{ backgroundColor: '#D94A4A' }}
                >
                  <span>Send to CarePath AI</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
              <button
                type="button"
                onClick={startListening}
                className="px-3 py-1 rounded-lg text-xs font-bold border bg-white hover:bg-slate-50"
                style={{ borderColor: '#F4B6B6', color: '#252525' }}
              >
                Speak Again
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
