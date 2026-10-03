import React from 'react';
import { HeartPulse, User, AlertTriangle, ExternalLink, Globe, Sparkles } from 'lucide-react';
import { ChatMessageItem } from '../types';

interface ChatMessageProps {
  message: ChatMessageItem;
  onSelectSuggestion?: (suggestion: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onSelectSuggestion }) => {
  const isAssistant = message.sender === 'assistant';

  return (
    <div className={`flex items-start gap-3 my-3.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      {/* Assistant Avatar */}
      {isAssistant && (
        <div
          className="w-8 h-8 rounded-xl text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5"
          style={{ backgroundColor: '#D94A4A' }}
        >
          <HeartPulse className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Message Bubble Container */}
      <div className={`max-w-[85%] sm:max-w-[75%] space-y-2 ${isAssistant ? 'items-start' : 'items-end'}`}>
        <div
          className="p-4 rounded-2xl text-sm leading-relaxed border shadow-xs"
          style={{
            backgroundColor: isAssistant
              ? message.isEmergencyAlert
                ? '#FFF1F1'
                : '#FFFFFF'
              : '#D94A4A',
            color: isAssistant
              ? message.isEmergencyAlert
                ? '#9E2020'
                : '#252525'
              : '#FFFFFF',
            borderColor: isAssistant
              ? message.isEmergencyAlert
                ? '#A83232'
                : '#F4B6B6'
              : '#A83232',
            borderTopLeftRadius: isAssistant ? '4px' : '16px',
            borderTopRightRadius: !isAssistant ? '4px' : '16px',
          }}
        >
          {message.isEmergencyAlert && (
            <div
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide mb-1.5"
              style={{ color: '#9E2020' }}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Critical Health Escalation Notice</span>
            </div>
          )}
          
          <p className="whitespace-pre-line font-medium">{message.text}</p>

          {/* Google Search Grounding Sources */}
          {isAssistant && message.groundingSources && message.groundingSources.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-1.5 font-bold mb-1.5 text-[#252525]">
                <Globe className="w-3.5 h-3.5 text-[#D94A4A]" />
                <span className="text-[11px] uppercase tracking-wider text-slate-500">Google Search Sources:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {message.groundingSources.map((source, sIdx) => (
                  <a
                    key={sIdx}
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors hover:underline"
                    style={{
                      backgroundColor: '#FFF9F9',
                      borderColor: '#F4B6B6',
                      color: '#D94A4A',
                    }}
                  >
                    <span className="truncate max-w-[200px]">{source.title}</span>
                    <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Model info tag */}
          {isAssistant && message.modelUsed && message.modelUsed !== 'emergency-safeguard' && (
            <div className="mt-2 pt-1 flex items-center justify-between text-[10px] text-slate-400">
              <span className="inline-flex items-center gap-1 font-mono">
                <Sparkles className="w-2.5 h-2.5 text-[#D94A4A]" />
                <span>{message.modelUsed}</span>
              </span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Response Buttons */}
        {isAssistant && message.suggestions && message.suggestions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {message.suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectSuggestion && onSelectSuggestion(suggestion)}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all text-left hover:scale-[1.02] shadow-2xs"
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#252525',
                  borderColor: '#F4B6B6',
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <div
          className={`text-[10px] text-slate-400 px-1 ${
            isAssistant ? 'text-left' : 'text-right'
          }`}
        >
          {message.timestamp}
        </div>
      </div>

      {/* User Avatar */}
      {!isAssistant && (
        <div
          className="w-8 h-8 rounded-xl text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5"
          style={{ backgroundColor: '#252525' }}
        >
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
