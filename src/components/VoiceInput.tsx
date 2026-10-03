import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertCircle, Loader2, RotateCcw, X, Volume2 } from 'lucide-react';

export type VoiceState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'ERROR';

interface VoiceInputProps {
  onTranscript: (text: string, autoSend?: boolean) => void;
  onInterimTranscript?: (text: string) => void;
  language?: string;
  disabled?: boolean;
  onFocusTextInput?: () => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  onInterimTranscript,
  language = 'en',
  disabled = false,
  onFocusTextInput,
}) => {
  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isPermissionDenied, setIsPermissionDenied] = useState<boolean>(false);
  const [interimText, setInterimText] = useState<string>('');
  
  const recognitionRef = useRef<any>(null);
  const accumulatedFinalRef = useRef<string>('');
  const isListeningRef = useRef<boolean>(false);

  // Map language to BCP 47 language code with fallback
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
      setErrorMessage('Voice input is not supported in this browser. Please use text chat.');
    }
  }, []);

  const stopRecognition = () => {
    if (recognitionRef.current && isListeningRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore
      }
    }
    isListeningRef.current = false;
  };

  const startListening = async () => {
    setIsPermissionDenied(false);
    setErrorMessage('');
    setInterimText('');
    accumulatedFinalRef.current = '';

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setVoiceState('ERROR');
      setErrorMessage('Voice input unavailable in this browser');
      return;
    }

    // Explicitly test & request microphone permission if mediaDevices is supported
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Close tracks immediately after permission check
        stream.getTracks().forEach((track) => track.stop());
      } catch (err: any) {
        console.warn('Microphone permission check returned error:', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setIsPermissionDenied(true);
          setVoiceState('ERROR');
          setErrorMessage('Microphone access is required for voice assistance.');
          return;
        }
      }
    }

    try {
      // Re-instantiate recognition for a fresh turn
      stopRecognition();
      const recognizer = new SpeechRecognition();
      
      // Configuration per requirements:
      recognizer.continuous = false;
      recognizer.interimResults = true;
      recognizer.maxAlternatives = 1;
      recognizer.lang = getLanguageTag(language);

      recognizer.onstart = () => {
        isListeningRef.current = true;
        setVoiceState('LISTENING');
        setErrorMessage('');
      };

      recognizer.onresult = (event: any) => {
        let currentInterim = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          const transcriptPiece = result[0].transcript;
          if (result.isFinal) {
            currentFinal += transcriptPiece;
          } else {
            currentInterim += transcriptPiece;
          }
        }

        if (currentFinal) {
          accumulatedFinalRef.current += (accumulatedFinalRef.current ? ' ' : '') + currentFinal.trim();
        }

        const displayInterim = currentInterim || accumulatedFinalRef.current;
        setInterimText(displayInterim);
        if (onInterimTranscript) {
          onInterimTranscript(displayInterim);
        }
      };

      recognizer.onerror = (event: any) => {
        console.warn('SpeechRecognition event error:', event.error);
        isListeningRef.current = false;

        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setIsPermissionDenied(true);
          setVoiceState('ERROR');
          setErrorMessage('Microphone access is required for voice assistance.');
        } else if (event.error === 'no-speech') {
          // If no speech was detected, gracefully transition to idle
          if (!accumulatedFinalRef.current) {
            setVoiceState('IDLE');
          } else {
            finalizeRecognition();
          }
        } else {
          setVoiceState('ERROR');
          setErrorMessage('Voice input unavailable. Please try again or type.');
        }
      };

      recognizer.onend = () => {
        isListeningRef.current = false;
        finalizeRecognition();
      };

      recognitionRef.current = recognizer;
      recognizer.start();
    } catch (err: any) {
      console.warn('Speech recognition initiation failed:', err);
      setVoiceState('ERROR');
      setErrorMessage('Could not activate microphone. Please try again.');
    }
  };

  const finalizeRecognition = () => {
    const finalResult = accumulatedFinalRef.current.trim() || interimText.trim();
    if (finalResult) {
      setVoiceState('PROCESSING');
      setTimeout(() => {
        onTranscript(finalResult, false);
        setVoiceState('IDLE');
        setInterimText('');
        accumulatedFinalRef.current = '';
      }, 300);
    } else {
      setVoiceState('IDLE');
      setInterimText('');
    }
  };

  const toggleListening = () => {
    if (voiceState === 'LISTENING') {
      stopRecognition();
      finalizeRecognition();
    } else {
      startListening();
    }
  };

  const handleContinueWithText = () => {
    setIsPermissionDenied(false);
    setVoiceState('IDLE');
    setErrorMessage('');
    if (onFocusTextInput) {
      onFocusTextInput();
    }
  };

  return (
    <div className="relative inline-flex items-center">
      {/* Microphone Main Button */}
      <button
        type="button"
        onClick={toggleListening}
        disabled={disabled || !isSupported}
        aria-label={
          voiceState === 'LISTENING'
            ? 'Listening... Click to stop'
            : voiceState === 'PROCESSING'
            ? 'Understanding...'
            : 'Click to speak'
        }
        className={`relative p-3 rounded-xl transition-all duration-200 flex items-center justify-center select-none shadow-xs ${
          voiceState === 'LISTENING'
            ? 'text-white shadow-md animate-pulse ring-4 ring-[#F4B6B6]'
            : voiceState === 'PROCESSING'
            ? 'text-white shadow-xs'
            : voiceState === 'ERROR'
            ? 'text-white shadow-xs hover:opacity-90'
            : 'text-white hover:opacity-95 active:scale-95'
        }`}
        style={{
          backgroundColor:
            voiceState === 'LISTENING'
              ? '#A83232' // Listening state: #A83232
              : voiceState === 'PROCESSING'
              ? '#2E9B68' // Safe/processing green
              : voiceState === 'ERROR'
              ? '#9E2020' // Emergency/error deep red
              : '#D94A4A', // Primary CTA Medical Red
        }}
        title={
          !isSupported
            ? 'Voice input unavailable'
            : voiceState === 'LISTENING'
            ? 'Listening... Click to finish'
            : voiceState === 'PROCESSING'
            ? 'Understanding...'
            : 'Click to speak'
        }
      >
        {voiceState === 'LISTENING' ? (
          <div className="flex items-center gap-1.5">
            <Mic className="w-5 h-5 text-white animate-bounce" />
            <span className="flex gap-0.5 items-end h-3">
              <span className="w-1 bg-white rounded-full animate-[voiceWave_0.8s_ease-in-out_infinite] h-2" />
              <span className="w-1 bg-white rounded-full animate-[voiceWave_0.8s_ease-in-out_0.2s_infinite] h-3" />
              <span className="w-1 bg-white rounded-full animate-[voiceWave_0.8s_ease-in-out_0.4s_infinite] h-2" />
            </span>
          </div>
        ) : voiceState === 'PROCESSING' ? (
          <Loader2 className="w-5 h-5 text-white animate-spin" />
        ) : voiceState === 'ERROR' ? (
          <MicOff className="w-5 h-5 text-white" />
        ) : (
          <Mic className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Real-time Interim Floating Banner while user is speaking */}
      {voiceState === 'LISTENING' && (
        <div
          className="absolute bottom-full mb-3 right-0 sm:left-1/2 sm:-translate-x-1/2 w-72 sm:w-80 p-3 rounded-xl border shadow-lg z-30 animate-fadeIn"
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: '#F4B6B6',
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: '#A83232' }}>
              <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: '#D94A4A' }} />
              <span>Listening...</span>
            </div>
            <span className="text-[10px] text-slate-400">
              {language === 'hi' ? 'हिंदी में बोलें' : language === 'mr' ? 'मराठीत बोला' : 'Speak clearly'}
            </span>
          </div>
          <p
            className="text-xs italic min-h-[1.5rem] leading-relaxed"
            style={{ color: interimText ? '#252525' : '#888888' }}
          >
            {interimText ? `“${interimText}”` : '“Please speak clearly...”'}
          </p>
          <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={() => {
                stopRecognition();
                finalizeRecognition();
              }}
              className="font-bold underline cursor-pointer"
              style={{ color: '#D94A4A' }}
            >
              Done Speaking
            </button>
            <span className="text-[10px] text-slate-400">Continuous voice recognition</span>
          </div>
        </div>
      )}

      {/* Permission Denied Modal / Notice */}
      {isPermissionDenied && (
        <div
          className="absolute bottom-full mb-3 right-0 sm:left-1/2 sm:-translate-x-1/2 w-80 p-4 rounded-xl border shadow-xl z-40 animate-fadeIn"
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: '#A83232',
          }}
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#9E2020' }} />
            <div className="space-y-1">
              <h4 className="font-bold text-xs" style={{ color: '#252525' }}>
                Microphone Access Required
              </h4>
              <p className="text-xs text-slate-600 leading-snug">
                Microphone access is required for voice assistance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={startListening}
              className="flex-1 py-1.5 px-3 rounded-lg text-xs font-bold text-white shadow-2xs flex items-center justify-center gap-1 transition-opacity hover:opacity-95"
              style={{ backgroundColor: '#D94A4A' }}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>TRY AGAIN</span>
            </button>
            <button
              type="button"
              onClick={handleContinueWithText}
              className="flex-1 py-1.5 px-3 rounded-lg text-xs font-bold border transition-colors hover:bg-slate-50 text-slate-700"
              style={{ borderColor: '#F4B6B6' }}
            >
              CONTINUE WITH TEXT
            </button>
          </div>
        </div>
      )}

      {/* General Error Notice */}
      {voiceState === 'ERROR' && !isPermissionDenied && errorMessage && (
        <div
          className="absolute bottom-full mb-3 right-0 sm:left-1/2 sm:-translate-x-1/2 w-72 p-3 rounded-xl border shadow-lg z-30 animate-fadeIn text-xs"
          style={{
            backgroundColor: '#FFF1F1',
            borderColor: '#F4B6B6',
            color: '#A83232',
          }}
        >
          <div className="flex items-start justify-between gap-1">
            <div className="flex items-center gap-1.5 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#9E2020]" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setVoiceState('IDLE')}
              className="text-slate-400 hover:text-slate-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={startListening}
              className="font-bold underline text-[11px]"
              style={{ color: '#D94A4A' }}
            >
              Try Again
            </button>
            <button
              type="button"
              onClick={handleContinueWithText}
              className="text-[11px] text-slate-500 hover:underline"
            >
              Type instead
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
