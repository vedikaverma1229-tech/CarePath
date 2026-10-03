import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { aiService, GeminiModel, AIRole } from '../services/aiService';
import { ChatMessageItem, ConversationState, StructuredGuidanceResult } from '../types';
import { ChatMessage } from '../components/ChatMessage';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { GuidanceResult } from '../components/GuidanceResult';
import { EmergencyCard } from '../components/EmergencyCard';
import { LiveVoiceModal } from '../components/LiveVoiceModal';
import { db, collection, addDoc } from '../lib/firebase';
import {
  Send,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  HeartPulse,
  Info,
  CheckCircle,
  AlertTriangle,
  Stethoscope,
  Calendar,
  Radio,
  ArrowRight,
  Globe,
  SlidersHorizontal,
  Bot,
  Zap,
  BrainCircuit,
} from 'lucide-react';

export const Guidance: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [conversationState, setConversationState] = useState<ConversationState>('IDLE');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [guidanceResult, setGuidanceResult] = useState<StructuredGuidanceResult | null>(null);
  const [emergencyResult, setEmergencyResult] = useState<StructuredGuidanceResult | null>(null);
  const [reportedObservations, setReportedObservations] = useState<string[]>([]);
  const [isLiveVoiceOpen, setIsLiveVoiceOpen] = useState(false);

  // Model & Role Controls per user prompt requirements
  const [selectedModel, setSelectedModel] = useState<GeminiModel>('gemini-3.5-flash');
  const [selectedRole, setSelectedRole] = useState<AIRole>('clinical_navigator');
  const [useSearchGrounding, setUseSearchGrounding] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, statusMessage]);

  // Sync role with model selection
  const handleRoleChange = (role: AIRole) => {
    setSelectedRole(role);
    if (role === 'complex_triage') {
      setSelectedModel('gemini-3.1-pro-preview');
      setUseSearchGrounding(false);
    } else if (role === 'fast_screener') {
      setSelectedModel('gemini-3.1-flash-lite');
      setUseSearchGrounding(false);
    } else if (role === 'health_researcher') {
      setSelectedModel('gemini-3.5-flash');
      setUseSearchGrounding(true);
    } else {
      setSelectedModel('gemini-3.5-flash');
    }
  };

  // Initialize or reset session
  const initializeChat = async () => {
    setConversationState('PROCESSING');
    setStatusMessage('Connecting to CarePath AI Health Assistant...');
    setGuidanceResult(null);
    setEmergencyResult(null);
    setReportedObservations([]);

    try {
      const response = await aiService.startConversation(language);
      setSessionId(response.sessionId);
      setMessages([
        {
          id: 'msg-init',
          sender: 'assistant',
          text:
            language === 'hi'
              ? 'नमस्ते! मैं CarePath AI Health Assistant हूँ। आज आपकी स्वास्थ्य सम्बन्धी क्या समस्या है? बोलें या नीचे दिए गए विकल्पों में से चुनें।'
              : language === 'mr'
              ? 'नमस्कार! मी CarePath AI Health Assistant आहे. आज तुम्हाला आरोग्याची काय अडचण आहे? कृपया सांगा किंवा खालील पर्याय निवडा.'
              : 'Namaste! I am CarePath AI Health Assistant. Tell me what health concern is bothering you today, or describe your symptoms.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: selectedModel,
          suggestions:
            language === 'hi'
              ? ['मुझे 3-4 दिन से बुखार है', 'सीने में दर्द या भारीपन', 'खांसी और सांस लेने में तकलीफ', 'पेट दर्द']
              : language === 'mr'
              ? ['मला ३-४ दिवसांपासून ताप आहे', 'छातीत दुखणे', 'खोकला आणि श्वास घेण्यास त्रास', 'पोटदुखी']
              : ['I have fever from 3-4 days', 'Chest pain or heavy breathing', 'Cough & throat irritation', 'Stomach ache'],
        },
      ]);
      setConversationState('AI_ASKING');
    } catch (err) {
      console.error(err);
      setConversationState('ERROR');
      setStatusMessage('Something went wrong connecting to the session. Please try again.');
    }
  };

  useEffect(() => {
    initializeChat();
  }, [language]);

  // Handle sending a message in the multi-turn thread
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || conversationState === 'PROCESSING') return;

    // Add user message to conversation history
    const userMsg: ChatMessageItem = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setReportedObservations((prev) => [...prev, text]);

    // Update state to processing
    setConversationState('PROCESSING');
    setStatusMessage(
      useSearchGrounding
        ? 'Searching Google & analyzing clinical guidance with Gemini 3.5 Flash...'
        : selectedModel === 'gemini-3.1-pro-preview'
        ? 'Deep clinical analysis with Gemini 3.1 Pro...'
        : selectedModel === 'gemini-3.1-flash-lite'
        ? 'Fast triage check with Gemini 3.1 Flash-Lite...'
        : 'CarePath AI is analyzing your symptoms with Gemini 3.5 Flash...'
    );

    try {
      const response = await aiService.sendMessage({
        message: text,
        sessionId,
        language,
        model: selectedModel,
        role: selectedRole,
        useSearchGrounding,
      });

      if (response.isEmergency) {
        setConversationState('EMERGENCY');
        setEmergencyResult(response.guidanceResult || null);
        const emergencyMsg: ChatMessageItem = {
          id: `ai-emg-${Date.now()}`,
          sender: 'assistant',
          text:
            language === 'hi'
              ? '🚨 आपातकालीन चेतावनी: आपके लक्षण गंभीर लग रहे हैं। कृपया तुरंत 112 पर कॉल करें या नजदीकी आपातकालीन अस्पताल जाएं।'
              : '🚨 CRITICAL MEDICAL ALERT: Your symptoms indicate an urgent medical situation. Please dial 112 or visit the nearest emergency trauma facility immediately.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isEmergencyAlert: true,
          modelUsed: 'emergency-safeguard',
        };
        setMessages((prev) => [...prev, emergencyMsg]);
        return;
      }

      if (response.guidanceResult) {
        setGuidanceResult(response.guidanceResult);
        setConversationState('GUIDANCE_READY');
        const finalMsg: ChatMessageItem = {
          id: `ai-done-${Date.now()}`,
          sender: 'assistant',
          text:
            language === 'hi'
              ? 'आपके लक्षणों के आधार पर हमने अगला सुरक्षित कदम तैयार किया है। कृपया नीचे दिए गए परिणाम और डॉक्टरों की सूची देखें।'
              : 'Based on the details provided, here is your care guidance and recommended next step.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          guidanceResult: response.guidanceResult,
          modelUsed: response.modelUsed || selectedModel,
          groundingSources: response.groundingSources,
        };
        setMessages((prev) => [...prev, finalMsg]);

        // Persist consultation to Firestore if user is logged in
        if (user) {
          try {
            await addDoc(collection(db, 'consultations'), {
              userId: user.uid,
              sessionId,
              language,
              symptomsSummary: text,
              careLevel: response.guidanceResult.careLevel,
              recommendedDoctorType: response.guidanceResult.recommendedSpecialty || '',
              isEmergency: false,
              modelUsed: response.modelUsed || selectedModel,
              createdAt: new Date().toISOString(),
            });
          } catch (fireErr) {
            console.warn('Failed to persist consultation to Firestore:', fireErr);
          }
        }
      } else if (response.nextQuestion) {
        setConversationState('AI_ASKING');
        const nextMsg: ChatMessageItem = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: response.nextQuestion,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: response.suggestions,
          modelUsed: response.modelUsed || selectedModel,
          groundingSources: response.groundingSources,
          searchQueries: response.searchQueries,
        };
        setMessages((prev) => [...prev, nextMsg]);
      }
    } catch (err) {
      console.error(err);
      setConversationState('ERROR');
      setStatusMessage('Unable to reach AI assistant. Please try again.');
    }
  };

  // Called when voice recognition finishes speech-to-text
  const handleVoiceTranscript = (recognizedText: string, autoSend: boolean = false) => {
    setInputValue(recognizedText);
    if (autoSend) {
      handleSendMessage(recognizedText);
    } else {
      chatInputRef.current?.focus();
    }
  };

  // Emergency sample trigger for clinical testing
  const triggerEmergencyTest = () => {
    handleSendMessage('I have sudden severe chest pain with left arm radiation and breathless sweating!');
  };

  return (
    <div className="min-h-screen py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" style={{ backgroundColor: '#FFF9F9' }}>
      
      {/* Header Banner - Central Feature of CAREPATH */}
      <div
        className="rounded-3xl p-6 sm:p-8 mb-8 border shadow-xs"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#F4B6B6' }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
              style={{
                backgroundColor: '#FFF1F1',
                color: '#D94A4A',
                borderColor: '#F4B6B6',
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>CarePath AI Health Assistant</span>
            </div>
            
            <h1
              className="font-['Outfit'] text-2xl sm:text-4xl font-extrabold tracking-tight"
              style={{ color: '#252525' }}
            >
              CarePath AI Health Assistant
            </h1>
            
            <p
              className="text-sm sm:text-base font-medium max-w-2xl leading-relaxed"
              style={{ color: '#A83232' }}
            >
              “Tell me about your health concern and I'll help you understand the next step.”
            </p>
          </div>

          {/* Quick Action Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Live Real-Time Voice Consultation with gemini-3.8-live */}
            <button
              onClick={() => setIsLiveVoiceOpen(true)}
              className="px-4 py-2.5 rounded-xl font-bold text-xs text-white shadow-xs transition-all hover:bg-[#A83232] flex items-center gap-2"
              style={{ backgroundColor: '#D94A4A' }}
            >
              <Radio className="w-3.5 h-3.5 animate-pulse text-white" />
              <span>Live Voice (gemini-3.8-live)</span>
            </button>

            {/* Reset Conversation */}
            <button
              onClick={initializeChat}
              className="px-3 py-2.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 hover:bg-[#FFF1F1]"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#252525',
                borderColor: '#F4B6B6',
              }}
              title="Reset Conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" style={{ color: '#D94A4A' }} />
              <span>Restart Chat</span>
            </button>
          </div>
        </div>

        {/* Safety Disclaimer Banner */}
        <div
          className="mt-4 p-3.5 rounded-2xl flex items-center gap-2.5 text-xs border"
          style={{ backgroundColor: '#FFF1F1', borderColor: '#F4B6B6', color: '#252525' }}
        >
          <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: '#2E9B68' }} />
          <span>
            <strong>Safety Notice:</strong> CarePath provides healthcare guidance and navigation support. It does not replace professional medical diagnosis or treatment. In life-threatening emergencies, dial 112 immediately.
          </span>
        </div>
      </div>

      {/* Prominent Voice Assistance Panel */}
      <div className="mb-8">
        <VoiceAssistant
          variant="banner"
          chatInputRef={chatInputRef}
          onInjectTranscript={(text) => {
            setInputValue((prev) => (prev ? `${prev} ${text}` : text));
            chatInputRef.current?.focus();
          }}
          language={language}
          disabled={conversationState === 'PROCESSING'}
        />
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Conversational AI Interface */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          
          {/* Chat Window Card */}
          <div
            className="rounded-3xl border shadow-xs overflow-hidden flex flex-col h-[660px]"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#F4B6B6' }}
          >
            {/* Chat Control Toolbar: Roles, Models, and Google Search Grounding */}
            <div
              className="px-4 sm:px-5 py-3 border-b flex flex-wrap items-center justify-between gap-3 text-xs"
              style={{ backgroundColor: '#FFF9F9', borderColor: '#F4B6B6' }}
            >
              {/* Role & Model Selector */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-[11px] text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Bot className="w-3.5 h-3.5 text-[#D94A4A]" />
                  Mode:
                </span>
                
                <button
                  type="button"
                  onClick={() => handleRoleChange('clinical_navigator')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    selectedRole === 'clinical_navigator' && !useSearchGrounding
                      ? 'text-white border-transparent shadow-xs'
                      : 'bg-white hover:bg-slate-50'
                  }`}
                  style={{
                    backgroundColor: selectedRole === 'clinical_navigator' && !useSearchGrounding ? '#D94A4A' : '#FFFFFF',
                    borderColor: '#F4B6B6',
                    color: selectedRole === 'clinical_navigator' && !useSearchGrounding ? '#FFFFFF' : '#252525',
                  }}
                  title="General Clinical Triage with gemini-3.5-flash"
                >
                  General (3.5 Flash)
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('complex_triage')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1 ${
                    selectedRole === 'complex_triage'
                      ? 'text-white border-transparent shadow-xs'
                      : 'bg-white hover:bg-slate-50'
                  }`}
                  style={{
                    backgroundColor: selectedRole === 'complex_triage' ? '#D94A4A' : '#FFFFFF',
                    borderColor: '#F4B6B6',
                    color: selectedRole === 'complex_triage' ? '#FFFFFF' : '#252525',
                  }}
                  title="Complex tasks with gemini-3.1-pro-preview"
                >
                  <BrainCircuit className="w-3 h-3" />
                  Complex (3.1 Pro)
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('fast_screener')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1 ${
                    selectedRole === 'fast_screener'
                      ? 'text-white border-transparent shadow-xs'
                      : 'bg-white hover:bg-slate-50'
                  }`}
                  style={{
                    backgroundColor: selectedRole === 'fast_screener' ? '#D94A4A' : '#FFFFFF',
                    borderColor: '#F4B6B6',
                    color: selectedRole === 'fast_screener' ? '#FFFFFF' : '#252525',
                  }}
                  title="Fast symptom screener with gemini-3.1-flash-lite"
                >
                  <Zap className="w-3 h-3" />
                  Fast (3.1 Lite)
                </button>
              </div>

              {/* Google Search Grounding Toggle */}
              <button
                type="button"
                onClick={() => setUseSearchGrounding(!useSearchGrounding)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs border transition-all shadow-xs ${
                  useSearchGrounding ? 'text-white shadow-xs' : 'bg-white'
                }`}
                style={{
                  backgroundColor: useSearchGrounding ? '#D94A4A' : '#FFFFFF',
                  borderColor: '#F4B6B6',
                  color: useSearchGrounding ? '#FFFFFF' : '#252525',
                }}
                title="Ground responses with real-time Google Search data using gemini-3.5-flash"
              >
                <Globe className={`w-3.5 h-3.5 ${useSearchGrounding ? 'text-white' : 'text-[#D94A4A]'}`} />
                <span>Google Search Grounding</span>
                {useSearchGrounding && <span className="text-[10px] font-extrabold uppercase bg-white/20 px-1 rounded">ON</span>}
              </button>
            </div>

            {/* Scrollable Message Thread */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  onSelectSuggestion={(sugg) => handleSendMessage(sugg)}
                />
              ))}

              {/* In-Flight Processing Indicator */}
              {conversationState === 'PROCESSING' && (
                <div
                  className="flex items-center gap-2 p-3.5 rounded-2xl max-w-[80%] text-xs border shadow-xs animate-pulse"
                  style={{ backgroundColor: '#FFF1F1', borderColor: '#F4B6B6', color: '#252525' }}
                >
                  <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#D94A4A' }} />
                  <span className="w-2 h-2 rounded-full animate-bounce [animation-delay:0.2s]" style={{ backgroundColor: '#D94A4A' }} />
                  <span className="w-2 h-2 rounded-full animate-bounce [animation-delay:0.4s]" style={{ backgroundColor: '#D94A4A' }} />
                  <span className="ml-1 font-medium">{statusMessage || 'Understanding your symptoms...'}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Emergency Escalation Option */}
            <div
              className="px-5 py-2 border-t flex items-center justify-between text-xs"
              style={{ backgroundColor: '#FFF9F9', borderColor: '#F4B6B6' }}
            >
              <span className="text-slate-500">Sudden acute pain, bleeding, or breathless?</span>
              <button
                type="button"
                onClick={triggerEmergencyTest}
                className="font-bold underline text-xs cursor-pointer hover:opacity-80"
                style={{ color: '#9E2020' }}
              >
                Emergency Assistance (112)
              </button>
            </div>

            {/* Input Bar */}
            <div
              className="p-4 border-t flex items-center gap-2"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#F4B6B6' }}
            >
              <input
                ref={chatInputRef}
                type="text"
                placeholder={
                  language === 'hi'
                    ? 'अपनी समस्या यहाँ लिखें या माइक पर बोलें...'
                    : language === 'mr'
                    ? 'तुमची अडचण येथे लिहा किंवा बोला...'
                    : useSearchGrounding
                    ? 'Ask with Google Search Grounding (e.g. Dengue symptoms in Nagpur)...'
                    : 'Type symptoms or click mic to speak...'
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                disabled={conversationState === 'PROCESSING'}
                className="flex-1 text-sm px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#F4B6B6] transition-all bg-white"
                style={{
                  borderColor: '#F4B6B6',
                  color: '#252525',
                }}
              />

              {/* Voice recognition microphone input powered by browser-native Web Speech API */}
              <VoiceAssistant
                variant="button"
                chatInputRef={chatInputRef}
                onInjectTranscript={(text) => {
                  setInputValue((prev) => (prev ? `${prev} ${text}` : text));
                  chatInputRef.current?.focus();
                }}
                language={language}
                disabled={conversationState === 'PROCESSING'}
              />

              {/* Send Button */}
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || conversationState === 'PROCESSING'}
                className="p-3 rounded-xl text-white shadow-xs transition-transform active:scale-95 disabled:opacity-40 hover:bg-[#A83232]"
                style={{ backgroundColor: '#D94A4A' }}
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Structured Guidance Result (When Complete) */}
          {guidanceResult && (
            <div className="mt-4">
              <GuidanceResult result={guidanceResult} />
            </div>
          )}

          {/* Emergency Card Display if triggered */}
          {emergencyResult && (
            <div className="mt-4">
              <EmergencyCard reason={emergencyResult.reason} />
            </div>
          )}
        </div>

        {/* Right Column: "Current Understanding" Panel on Desktop */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Understanding Status Card */}
          <div
            className="rounded-3xl border p-5 sm:p-6 shadow-xs"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#F4B6B6' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-4 h-4" style={{ color: '#D94A4A' }} />
              <h2 className="font-['Outfit'] font-bold text-base" style={{ color: '#252525' }}>
                Current Understanding
              </h2>
            </div>

            {/* Care Level Gauge */}
            <div
              className="mb-4 p-3.5 rounded-2xl border"
              style={{ backgroundColor: '#FFF9F9', borderColor: '#F4B6B6' }}
            >
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Triage Progression
              </span>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span style={{ color: guidanceResult ? '#2E9B68' : '#252525' }}>
                  {guidanceResult ? 'Guidance Ready' : conversationState === 'PROCESSING' ? 'Understanding...' : 'Gathering Symptoms'}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {reportedObservations.length} logged
                </span>
              </div>
              <div className="w-full bg-[#FFF1F1] h-2 rounded-full mt-2 overflow-hidden border border-[#F4B6B6]">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: guidanceResult ? '100%' : `${Math.min(90, reportedObservations.length * 30 + 20)}%`,
                    backgroundColor: guidanceResult ? '#2E9B68' : '#D94A4A',
                  }}
                />
              </div>
            </div>

            {/* Collected Observations */}
            <div className="space-y-2 mb-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Reported Symptoms
              </span>
              {reportedObservations.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  No symptoms logged yet. Speak or type to begin.
                </p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {reportedObservations.map((obs, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium border"
                      style={{
                        backgroundColor: '#FFF1F1',
                        color: '#D94A4A',
                        borderColor: '#F4B6B6',
                      }}
                    >
                      {obs.slice(0, 32)}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Active Gemini Architecture Summary */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                AI Engine
              </span>
              <div className="p-2.5 rounded-xl border flex items-center justify-between text-xs" style={{ backgroundColor: '#FFF9F9', borderColor: '#F4B6B6' }}>
                <span className="font-semibold text-slate-600">Active Model</span>
                <span className="font-mono font-bold text-[#D94A4A]">{selectedModel}</span>
              </div>
              <div className="p-2.5 rounded-xl border flex items-center justify-between text-xs" style={{ backgroundColor: '#FFF9F9', borderColor: '#F4B6B6' }}>
                <span className="font-semibold text-slate-600">Search Grounding</span>
                <span className="font-bold" style={{ color: useSearchGrounding ? '#2E9B68' : '#A83232' }}>
                  {useSearchGrounding ? 'Google Search Active' : 'Off'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Doctor Recommendations CTA */}
          <div
            className="rounded-3xl border p-5 sm:p-6 shadow-xs text-center space-y-3"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#F4B6B6' }}
          >
            <Stethoscope className="w-8 h-8 mx-auto" style={{ color: '#D94A4A' }} />
            <h3 className="font-['Outfit'] font-bold text-base" style={{ color: '#252525' }}>
              Prefer Speaking with a Doctor?
            </h3>
            <p className="text-xs text-slate-600">
              Browse verified doctors in Central India across General Medicine, Cardiology, and Pediatrics.
            </p>
            <Link
              to="/doctors"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-xs"
              style={{ backgroundColor: '#D94A4A' }}
            >
              <span>Explore Verified Doctors</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>

      {/* Live Voice Consultation Modal for gemini-3.8-live */}
      <LiveVoiceModal
        isOpen={isLiveVoiceOpen}
        onClose={() => setIsLiveVoiceOpen(false)}
        onGuidanceGenerated={(result) => {
          setGuidanceResult(result);
          setIsLiveVoiceOpen(false);
        }}
      />
    </div>
  );
};
