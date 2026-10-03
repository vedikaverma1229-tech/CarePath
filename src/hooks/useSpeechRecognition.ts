import { useState, useEffect, useRef, useCallback } from 'react';

export type SpeechRecognitionState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'ERROR';

export interface UseSpeechRecognitionOptions {
  language?: string;
  onTranscriptChange?: (interim: string, final: string) => void;
  onFinalTranscript?: (finalText: string) => void;
  onError?: (error: string) => void;
}

export interface UseSpeechRecognitionReturn {
  isListening: boolean;
  isSupported: boolean;
  state: SpeechRecognitionState;
  interimTranscript: string;
  finalTranscript: string;
  error: string | null;
  permissionDenied: boolean;
  startListening: () => Promise<void>;
  stopListening: () => void;
  resetTranscript: () => void;
}

export const useSpeechRecognition = (
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn => {
  const { language = 'en', onTranscriptChange, onFinalTranscript, onError } = options;

  const [state, setState] = useState<SpeechRecognitionState>('IDLE');
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [finalTranscript, setFinalTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef<boolean>(false);
  const finalTranscriptRef = useRef<string>('');

  // Map internal language code to BCP 47 language code with central Indian dialect support
  const getLanguageTag = useCallback((lang: string): string => {
    switch (lang.toLowerCase()) {
      case 'hi':
      case 'hi-in':
        return 'hi-IN';
      case 'mr':
      case 'mr-in':
        return 'mr-IN';
      case 'en':
      case 'en-in':
      default:
        return 'en-IN';
    }
  }, []);

  // Check browser support for native Web Speech API
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setError('Web Speech API is not supported in this browser.');
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setInterimTranscript('');
    setFinalTranscript('');
    finalTranscriptRef.current = '';
    setError(null);
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListeningRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore errors on stopping an already inactive recognition
      }
    }
    isListeningRef.current = false;
  }, []);

  const startListening = useCallback(async () => {
    setError(null);
    setPermissionDenied(false);
    setInterimTranscript('');
    setFinalTranscript('');
    finalTranscriptRef.current = '';

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setState('ERROR');
      const msg = 'Web Speech Recognition is not supported by your browser.';
      setError(msg);
      onError?.(msg);
      return;
    }

    // Explicitly verify & request microphone permission if getUserMedia is present
    if (navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      } catch (err: any) {
        console.warn('Microphone permission check failed:', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setPermissionDenied(true);
          setState('ERROR');
          const msg = 'Microphone access is required for voice assistance.';
          setError(msg);
          onError?.(msg);
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
        setState('LISTENING');
        setError(null);
      };

      recognizer.onresult = (event: any) => {
        let currentInterim = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          const text = item[0]?.transcript || '';
          if (item.isFinal) {
            currentFinal += text;
          } else {
            currentInterim += text;
          }
        }

        if (currentFinal) {
          finalTranscriptRef.current = (
            finalTranscriptRef.current ? finalTranscriptRef.current + ' ' : ''
          ) + currentFinal.trim();
          setFinalTranscript(finalTranscriptRef.current);
        }

        setInterimTranscript(currentInterim);
        onTranscriptChange?.(currentInterim, finalTranscriptRef.current);
      };

      recognizer.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error);
        isListeningRef.current = false;

        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setPermissionDenied(true);
          setState('ERROR');
          const msg = 'Microphone access is required for voice assistance.';
          setError(msg);
          onError?.(msg);
        } else if (event.error === 'no-speech') {
          // If no speech, gracefully fall back without showing fatal error if we got some text
          if (finalTranscriptRef.current) {
            setState('PROCESSING');
            setTimeout(() => {
              setState('IDLE');
              onFinalTranscript?.(finalTranscriptRef.current);
            }, 200);
          } else {
            setState('IDLE');
          }
        } else {
          setState('ERROR');
          const msg = 'Voice input unavailable. Please try speaking again or type.';
          setError(msg);
          onError?.(msg);
        }
      };

      recognizer.onend = () => {
        isListeningRef.current = false;
        const result = finalTranscriptRef.current.trim();
        if (result) {
          setState('PROCESSING');
          setTimeout(() => {
            setState('IDLE');
            onFinalTranscript?.(result);
          }, 250);
        } else {
          setState('IDLE');
        }
      };

      recognitionRef.current = recognizer;
      recognizer.start();
    } catch (err: any) {
      console.warn('Speech recognition initiation error:', err);
      setState('ERROR');
      const msg = 'Could not start voice recognition. Please try again.';
      setError(msg);
      onError?.(msg);
    }
  }, [getLanguageTag, language, onError, onFinalTranscript, onTranscriptChange, stopListening]);

  return {
    isListening: state === 'LISTENING',
    isSupported,
    state,
    interimTranscript,
    finalTranscript,
    error,
    permissionDenied,
    startListening,
    stopListening,
    resetTranscript,
  };
};
