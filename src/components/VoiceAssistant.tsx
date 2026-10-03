import React, { useState, useEffect } from 'react';
import { Mic, MicOff, AlertCircle, Loader2, RotateCcw, Volume2, ArrowRight } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

export interface VoiceAssistantProps {
  /**
   * Callback invoked whenever a final speech transcript is ready to be injected into the chat input.
   */
  onInjectTranscript: (transcript: string) => void;

  /**
   * Optional ref to the chat input field to directly inject the value and focus it.
   */
  chatInputRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;

  /**
   * Current language for speech recognition ('en', 'hi', 'mr').
   */
  language?: string;

  /**
   * Whether the assistant is currently disabled (e.g., when AI is processing).
   */
  disabled?: boolean;

  /**
   * Display mode:
   * - 'button': Compact microphone control suitable for placing next to or inside the chat input bar.
   * - 'banner': Visual assistant panel with prominent 'Listening' state and real-time transcript viewer.
   */
  variant?: 'button' | 'banner';

  /**
   * Optional custom class names
   */
  className?: string;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  onInjectTranscript,
  chatInputRef,
  language = 'en',
  disabled = false,
  variant = 'button',
  className = '',
}) => {
  const [livePreview, setLivePreview] = useState<string>('');

  const injectIntoInput = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // 1. Direct DOM injection into chat input ref if supplied
    if (chatInputRef?.current) {
      const inputEl = chatInputRef.current;
      const currentVal = inputEl.value;
      const newVal = currentVal ? `${currentVal} ${trimmed}` : trimmed;
      inputEl.value = newVal;

      // Dispatch native input event so React state listeners are notified
      const event = new Event('input', { bubbles: true });
      inputEl.dispatchEvent(event);

      // Focus input field
      inputEl.focus();
    }

    // 2. Invoke callback to update parent state directly
    onInjectTranscript(trimmed);
  };

  const {
    isListening,
    isSupported,
    state,
    interimTranscript,
    finalTranscript,
    error,
    permissionDenied,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    language,
    onTranscriptChange: (interim, final) => {
      const current = final ? `${final} ${interim}` : interim;
      setLivePreview(current);
    },
    onFinalTranscript: (finalText) => {
      injectIntoInput(finalText);
      setLivePreview('');
    },
  });

  // Track live text during listening
  useEffect(() => {
    if (interimTranscript || finalTranscript) {
      const display = finalTranscript
        ? `${finalTranscript} ${interimTranscript}`.trim()
        : interimTranscript.trim();
      setLivePreview(display);
    }
  }, [interimTranscript, finalTranscript]);

  const handleToggle = () => {
    if (isListening) {
      stopListening();
      if (livePreview.trim()) {
        injectIntoInput(livePreview);
        setLivePreview('');
      }
    } else {
      resetTranscript();
      setLivePreview('');
      startListening();
    }
  };

  const handleManualInject = () => {
    if (livePreview.trim()) {
      injectIntoInput(livePreview);
      stopListening();
      setLivePreview('');
      resetTranscript();
    }
  };

  // BANNER / CARD VARIANT
  if (variant === 'banner') {
    return (
      <div
        className={`rounded-2xl border p-4 sm:p-5 transition-all shadow-xs relative overflow-hidden ${className}`}
        style={{
          backgroundColor: '#FFFFFF',
          borderColor: isListening ? '#D94A4A' : '#F4B6B6',
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border"
                style={{
                  backgroundColor: '#FFF1F1',
                  color: '#D94A4A',
                  borderColor: '#F4B6B6',
                }}
              >
                CarePath Voice Assistant
              </span>

              {/* 'Listening' visual state using #D94A4A */}
              {isListening && (
                <div
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold animate-pulse text-white shadow-xs"
                  style={{ backgroundColor: '#D94A4A' }}
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span>Listening...</span>
                </div>
              )}

              {state === 'PROCESSING' && (
                <div
                  className="flex items-center gap-1 text-xs font-semibold"
                  style={{ color: '#A83232' }}
                >
                  <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: '#D94A4A' }} />
                  <span>Processing speech...</span>
                </div>
              )}

              {!isListening && state === 'IDLE' && isSupported && (
                <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#2E9B68' }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#2E9B68' }} />
                  <span>Ready to speak</span>
                </span>
              )}
            </div>

            <h3 className="font-['Outfit'] font-bold text-base sm:text-lg" style={{ color: '#252525' }}>
              {isListening ? 'Speak naturally to describe your symptoms' : 'Voice Assistance'}
            </h3>
            <p className="text-xs text-slate-500">
              {isListening
                ? 'Your speech is captured in real-time and injected directly into the chat input.'
                : language === 'hi'
                ? 'माइक दबाकर अपनी परेशानी बताएं, विवरण सीधे चैट में लिख जाएगा।'
                : language === 'mr'
                ? 'माइक दाबा आणि बोला, तुमची समस्या थेट चॅटमध्ये नोंदवली जाईल.'
                : 'Click the microphone to speak. Transcribed speech automatically fills your consultation input.'}
            </p>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={handleToggle}
              disabled={disabled || !isSupported}
              aria-label={isListening ? 'Stop listening' : 'Start voice input'}
              className={`relative px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white flex items-center gap-2 shadow-sm transition-all active:scale-95 ${
                isListening ? 'ring-4 ring-[#F4B6B6] animate-pulse' : 'hover:opacity-95'
              }`}
              style={{
                backgroundColor: isListening ? '#D94A4A' : '#D94A4A',
              }}
            >
              <Mic className={`w-4 h-4 ${isListening ? 'animate-bounce' : ''}`} />
              <span>{isListening ? 'Stop & Inject' : 'Tap to Speak'}</span>
            </button>
          </div>
        </div>

        {/* Real-time transcript viewer in Listening or Preview state */}
        {(isListening || livePreview) && (
          <div
            className="mt-3.5 p-3 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5"
            style={{
              backgroundColor: '#FFF9F9',
              borderColor: '#D94A4A',
            }}
          >
            <div className="flex items-start gap-2.5 flex-1 min-w-0">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white mt-0.5"
                style={{ backgroundColor: '#D94A4A' }}
              >
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: '#D94A4A' }}>
                  Real-time Transcript
                </span>
                <p className="text-xs sm:text-sm font-medium text-slate-800 break-words italic">
                  "{livePreview || 'Listening for speech...'}"
                </p>
              </div>
            </div>

            {livePreview && (
              <button
                type="button"
                onClick={handleManualInject}
                className="px-3 py-1.5 rounded-lg text-white font-bold text-xs flex items-center gap-1 shrink-0 self-end sm:self-center transition-all hover:opacity-95 active:scale-95"
                style={{ backgroundColor: '#D94A4A' }}
              >
                <span>Inject to Chat</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Permission Denied / Error recovery */}
        {error && (
          <div
            className="mt-3 p-3 rounded-xl border flex items-center justify-between gap-3 text-xs"
            style={{
              backgroundColor: '#FFF1F1',
              borderColor: '#9E2020',
              color: '#9E2020',
            }}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            {permissionDenied && (
              <button
                type="button"
                onClick={() => startListening()}
                className="px-2.5 py-1 rounded-md text-white font-bold text-[11px] shrink-0"
                style={{ backgroundColor: '#D94A4A' }}
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // BUTTON / COMPACT VARIANT (Suitable for inside or next to the Chat Input Bar)
  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {/* Real-time transcript popover when listening */}
      {isListening && livePreview && (
        <div
          className="absolute bottom-full right-0 mb-3 w-72 sm:w-80 p-3 rounded-2xl border shadow-xl z-30 transition-all animate-in fade-in slide-in-from-bottom-2"
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: '#D94A4A',
          }}
        >
          {/* Header indicator in #D94A4A */}
          <div className="flex items-center justify-between mb-1.5">
            <span
              className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5"
              style={{ color: '#D94A4A' }}
            >
              <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: '#D94A4A' }} />
              Listening...
            </span>
            <span className="text-[10px] font-bold text-slate-400">Web Speech API</span>
          </div>

          {/* Captured live text */}
          <div
            className="p-2.5 rounded-xl border text-xs sm:text-sm font-medium text-slate-800 max-h-24 overflow-y-auto mb-2"
            style={{ backgroundColor: '#FFF9F9', borderColor: '#F4B6B6' }}
          >
            {livePreview}
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] text-slate-500 italic">Click stop to inject</span>
            <button
              type="button"
              onClick={handleManualInject}
              className="px-2.5 py-1 rounded-lg text-white font-bold text-xs flex items-center gap-1 transition-all active:scale-95"
              style={{ backgroundColor: '#D94A4A' }}
            >
              <span>Inject</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Main Microphone Action Button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled || !isSupported}
        aria-label={isListening ? 'Stop listening' : 'Start speaking'}
        title={
          !isSupported
            ? 'Voice input unavailable in this browser'
            : isListening
            ? 'Listening... Click to finish and inject'
            : 'Click to speak'
        }
        className={`relative p-3 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95 ${
          isListening
            ? 'text-white shadow-md ring-4 ring-[#F4B6B6]'
            : 'text-white hover:opacity-95'
        }`}
        style={{
          // Primary / CTA #D94A4A, animated listening pulse
          backgroundColor: '#D94A4A',
        }}
      >
        {isListening ? (
          <>
            {/* Listening pulse rings using #D94A4A */}
            <span
              className="absolute inset-0 rounded-xl animate-ping opacity-30"
              style={{ backgroundColor: '#D94A4A' }}
            />
            <Mic className="w-5 h-5 relative z-10 animate-bounce" />
          </>
        ) : state === 'PROCESSING' ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : !isSupported || state === 'ERROR' ? (
          <MicOff className="w-5 h-5 opacity-70" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </button>

      {/* Inline listening badge if listening */}
      {isListening && (
        <span
          className="absolute -top-2.5 -right-2 text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full text-white shadow-xs animate-pulse"
          style={{ backgroundColor: '#D94A4A' }}
        >
          LIVE
        </span>
      )}

      {/* Error popover if permission was denied */}
      {permissionDenied && (
        <div
          className="absolute bottom-full right-0 mb-3 w-64 p-3 rounded-xl border shadow-lg z-30 text-xs space-y-2"
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: '#9E2020',
          }}
        >
          <div className="flex items-center gap-1.5 font-bold" style={{ color: '#9E2020' }}>
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Microphone Access Required</span>
          </div>
          <p className="text-[11px] text-slate-600">
            Please allow microphone permissions in your browser to use voice assistance.
          </p>
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => startListening()}
              className="px-2 py-1 rounded text-white font-bold text-[10px]"
              style={{ backgroundColor: '#D94A4A' }}
            >
              Try Again
            </button>
            <button
              type="button"
              onClick={() => {
                resetTranscript();
                chatInputRef?.current?.focus();
              }}
              className="text-[10px] text-slate-500 underline font-semibold"
            >
              Type Instead
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
