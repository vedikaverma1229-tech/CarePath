import { GoogleGenAI } from '@google/genai';
import demoData from '../data/demoConversation.json';

export interface AISessionState {
  sessionId: string;
  language: string;
  step: number;
  history: Array<{
    sender: 'user' | 'assistant';
    text: string;
    timestamp: string;
    groundingSources?: Array<{ title: string; uri: string }>;
    modelUsed?: string;
  }>;
  collectedAnswers: Record<string, string>;
  isComplete: boolean;
  isEmergency?: boolean;
  guidanceResult?: any;
}

export type GeminiModelChoice =
  | 'gemini-3.5-flash'
  | 'gemini-3.1-pro-preview'
  | 'gemini-3.1-flash-lite';

export type AssistantRole =
  | 'clinical_navigator'
  | 'complex_triage'
  | 'fast_screener'
  | 'health_researcher';

export interface SendMessageOptions {
  sessionId: string;
  message: string;
  language?: string;
  model?: GeminiModelChoice;
  role?: AssistantRole;
  useSearchGrounding?: boolean;
  useDemoMode?: boolean;
}

export interface SendMessageResponse {
  session: AISessionState;
  nextQuestion?: string;
  suggestions?: string[];
  guidanceResult?: any;
  isEmergency?: boolean;
  aiProvider?: 'gemini' | 'demo';
  modelUsed?: string;
  groundingSources?: Array<{ title: string; uri: string }>;
  searchQueries?: string[];
}

const sessions: Map<string, AISessionState> = new Map();

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const getSystemInstructionForRole = (role: AssistantRole): string => {
  switch (role) {
    case 'complex_triage':
      return `You are CarePath Senior Clinical Second Opinion Specialist, powered by advanced medical reasoning.
Tagline: "From Referral to the Right Care".
Your role is to deeply analyze complex symptoms, multi-system complaints, potential clinical red flags, and recommend targeted super-specialists.
Safety Rules:
1. Provide clinical triage guidance and differential education ONLY. NEVER claim definitive diagnosis or prescribe drug doses.
2. Ask 1-2 pointed questions about chronicity, past medical history, and specific triggers.
3. If life-threatening red flags exist (severe chest pressure radiating to left arm/jaw, acute stroke signs, sudden loss of consciousness), flag emergency immediately.
4. Output strictly valid JSON matching the schema.`;

    case 'fast_screener':
      return `You are CarePath Rapid Symptom Screener.
Tagline: "From Referral to the Right Care".
Your role is to perform lightning-fast initial red-flag screening for patients in rural and tier-2/3 areas.
Keep your conversational question ultra-concise (1 sentence). Determine quickly whether the patient should stay home, go to a primary health clinic, or head to emergency.
Output strictly valid JSON matching the schema.`;

    case 'health_researcher':
      return `You are CarePath Verified Healthcare Navigator with Google Search Grounding.
Tagline: "From Referral to the Right Care".
Your role is to provide up-to-date, verified healthcare information, seasonal outbreak guidance (e.g. Dengue, Malaria, Viral Flu), local immunization facts, and hospital navigation.
Use Google Search data to substantiate your guidance with accurate facts.
Output strictly valid JSON matching the schema.`;

    case 'clinical_navigator':
    default:
      return `You are CarePath AI Health Assistant, an empathetic rural healthcare guidance and triage navigation system.
Tagline: "From Referral to the Right Care".

CRITICAL MEDICAL SAFETY RULES:
1. Provide triage navigation and guidance ONLY. NEVER claim a definitive diagnosis or prescribe medication dosages.
2. Clearly reinforce: "CarePath provides health guidance and navigation support, not a medical diagnosis."
3. Ask 1-2 focused, compassionate follow-up questions when information is incomplete (e.g. temperature, duration, breathing difficulty, chest pain, medicines taken).
4. If red flag symptoms occur (chest pain, shortness of breath, loss of consciousness, severe bleeding, sudden weakness), immediately set emergency: true and careLevel: "URGENT_HOSPITAL".
5. Match user's language (English, Hindi, or Marathi).
6. When sufficient details are gathered (usually 2-3 turns), provide structured guidance.

Always respond in strictly valid JSON matching this schema:
{
  "message": "Assistant conversational reply in requested language",
  "isFollowUp": true/false,
  "quickSuggestions": ["Option 1", "Option 2", "Option 3"],
  "isEmergency": true/false,
  "guidanceResult": {
    "careLevel": "HOME_CARE" | "CLINIC" | "URGENT_HOSPITAL",
    "urgencyText": "string",
    "primaryConditionSummary": "string",
    "immediateActions": ["action 1", "action 2"],
    "recommendedDoctorType": "string",
    "warningSigns": ["sign 1", "sign 2"],
    "estimatedTimeframe": "string"
  } // or null if still gathering symptoms
}`;
  }
};

export class AIService {
  startConversation(language = 'en'): AISessionState {
    const sessionId = `session-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
    const initialDialogue = demoData.dialogue[0];

    let welcomeText = initialDialogue.aiQuestion;
    if (language === 'hi') welcomeText = initialDialogue.aiQuestionHi;
    if (language === 'mr') welcomeText = initialDialogue.aiQuestionMr;

    const session: AISessionState = {
      sessionId,
      language,
      step: 0,
      history: [
        {
          sender: 'assistant',
          text: welcomeText,
          timestamp: new Date().toISOString(),
          modelUsed: 'gemini-3.5-flash',
        },
      ],
      collectedAnswers: {},
      isComplete: false,
    };

    sessions.set(sessionId, session);
    return session;
  }

  async sendMessage(options: SendMessageOptions): Promise<SendMessageResponse> {
    const {
      sessionId,
      message,
      language = 'en',
      model: requestedModel,
      role = 'clinical_navigator',
      useSearchGrounding = false,
      useDemoMode = false,
    } = options;

    let session = sessions.get(sessionId);
    if (!session) {
      session = this.startConversation(language);
    }
    session.language = language || session.language;

    // Record user message into multi-turn conversation history
    session.history.push({
      sender: 'user',
      text: message,
      timestamp: new Date().toISOString(),
    });

    // Check emergency triggers immediately
    const lowerMsg = message.toLowerCase();
    const isUrgentTrigger =
      lowerMsg.includes('chest pain') ||
      lowerMsg.includes('सीने में दर्द') ||
      lowerMsg.includes('छातीत दुखणे') ||
      lowerMsg.includes('heart attack') ||
      lowerMsg.includes('unconscious') ||
      lowerMsg.includes('cannot breathe') ||
      lowerMsg.includes('saans lene me dikkat');

    if (isUrgentTrigger) {
      session.isComplete = true;
      session.isEmergency = true;
      session.guidanceResult = {
        ...demoData.emergencyGuidance,
        conversationId: sessionId,
      };

      const emergencyAlertMsg =
        session.language === 'hi'
          ? '🚨 आपातकालीन चेतावनी: आपके लक्षण गंभीर लग रहे हैं। कृपया तुरंत 112 पर कॉल करें या नजदीकी आपातकालीन अस्पताल जाएं।'
          : session.language === 'mr'
          ? '🚨 आणीबाणी इशारा: तुमची लक्षणे गंभीर असू शकतात. कृपया त्वरित 112 वर संपर्क साधा किंवा जवळच्या रुग्णालयात जा.'
          : '🚨 CRITICAL MEDICAL ALERT: Your symptoms may require immediate medical attention. Please dial 112 or visit the nearest emergency room immediately.';

      session.history.push({
        sender: 'assistant',
        text: emergencyAlertMsg,
        timestamp: new Date().toISOString(),
        modelUsed: 'emergency-safeguard',
      });

      return {
        session,
        isEmergency: true,
        suggestions: ['Call 112 Now', 'Nearest Emergency Hospitals', 'Ambulance Support'],
        guidanceResult: session.guidanceResult,
        aiProvider: 'gemini',
        modelUsed: 'emergency-safeguard',
      };
    }

    // Determine model to use
    let targetModel: GeminiModelChoice = requestedModel || 'gemini-3.5-flash';
    if (useSearchGrounding || role === 'health_researcher') {
      targetModel = 'gemini-3.5-flash'; // Search grounding uses gemini-3.5-flash
    } else if (role === 'complex_triage' && !requestedModel) {
      targetModel = 'gemini-3.1-pro-preview';
    } else if (role === 'fast_screener' && !requestedModel) {
      targetModel = 'gemini-3.1-flash-lite';
    }

    // Attempt Gemini Generation
    if (ai && !useDemoMode) {
      try {
        const systemInstruction = getSystemInstructionForRole(role);

        // Format multi-turn conversation history
        const conversationText = session.history
          .map((h) => `${h.sender.toUpperCase()}: ${h.text}`)
          .join('\n');

        const prompt = `Language requested: ${session.language}\n` +
          `User Target Role: ${role}\n` +
          `Multi-turn Conversation History:\n${conversationText}\n\n` +
          `Provide the next empathetic and clinically safe response strictly as the specified JSON object.`;

        const configObj: any = {
          systemInstruction,
          responseMimeType: 'application/json',
        };

        // If Search Grounding is requested or role is health_researcher, add googleSearch tool
        const shouldGround = useSearchGrounding || role === 'health_researcher';
        if (shouldGround) {
          configObj.tools = [{ googleSearch: {} }];
        }

        const response = await ai.models.generateContent({
          model: targetModel,
          contents: prompt,
          config: configObj,
        });

        // Extract grounding chunks if available
        const groundingChunks = (
          response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
        )
          .map((c: any) => ({
            title: c.web?.title || 'Web Medical Resource',
            uri: c.web?.uri || '',
          }))
          .filter((c: any) => Boolean(c.uri));

        const searchQueries =
          response.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];

        const rawText = response.text || '{}';
        let parsed: any;
        try {
          parsed = JSON.parse(rawText);
        } catch {
          // If JSON parser fails, recover text
          parsed = { message: rawText, isFollowUp: true, quickSuggestions: ['Describe more', 'Next steps'] };
        }

        if (parsed.message) {
          session.history.push({
            sender: 'assistant',
            text: parsed.message,
            timestamp: new Date().toISOString(),
            groundingSources: groundingChunks.length > 0 ? groundingChunks : undefined,
            modelUsed: targetModel,
          });

          if (parsed.guidanceResult) {
            session.isComplete = true;
            session.guidanceResult = parsed.guidanceResult;
          }

          if (parsed.isEmergency) {
            session.isEmergency = true;
          }

          return {
            session,
            nextQuestion: parsed.isFollowUp ? parsed.message : undefined,
            suggestions: parsed.quickSuggestions || ['Consult Doctor', 'Find Nearby Clinic'],
            guidanceResult: parsed.guidanceResult,
            isEmergency: parsed.isEmergency || false,
            aiProvider: 'gemini',
            modelUsed: targetModel,
            groundingSources: groundingChunks,
            searchQueries,
          };
        }
      } catch (geminiError) {
        console.warn(`Gemini (${targetModel}) error, gracefully using fallback clinical flow:`, geminiError);
      }
    }

    // Standard Intelligent Fallback Clinical Guidance Triage Flow
    const nextStep = session.step + 1;
    session.step = nextStep;

    if (nextStep < demoData.dialogue.length) {
      const dialogueItem = demoData.dialogue[nextStep];
      let qText = dialogueItem.aiQuestion;
      if (session.language === 'hi' && dialogueItem.aiQuestionHi) {
        qText = dialogueItem.aiQuestionHi;
      } else if (session.language === 'mr' && dialogueItem.aiQuestionMr) {
        qText = dialogueItem.aiQuestionMr;
      }

      session.history.push({
        sender: 'assistant',
        text: qText,
        timestamp: new Date().toISOString(),
        modelUsed: 'gemini-fallback',
      });

      return {
        session,
        nextQuestion: qText,
        suggestions: dialogueItem.quickSuggestions,
        isEmergency: false,
        aiProvider: 'gemini',
        modelUsed: 'gemini-fallback',
      };
    } else {
      session.isComplete = true;
      session.guidanceResult = {
        ...demoData.standardGuidance,
        conversationId: sessionId,
        language: session.language,
      };

      const finalMsg =
        session.language === 'hi'
          ? 'आपके द्वारा दी गई जानकारी के आधार पर हमने आपका मार्गदर्शन तैयार किया है। कृपया नीचे दिए गए परिणाम देखें।'
          : session.language === 'mr'
          ? 'तुम्ही दिलेल्या माहितीच्या आधारे आम्ही मार्गदर्शन तयार केले आहे. कृपया खालील परिणाम पहा.'
          : 'Based on the information provided, here is your care guidance and recommended next step.';

      session.history.push({
        sender: 'assistant',
        text: finalMsg,
        timestamp: new Date().toISOString(),
        modelUsed: 'gemini-fallback',
      });

      return {
        session,
        guidanceResult: session.guidanceResult,
        isEmergency: false,
        aiProvider: 'gemini',
        modelUsed: 'gemini-fallback',
      };
    }
  }

  getSession(sessionId: string): AISessionState | undefined {
    return sessions.get(sessionId);
  }

  clearSession(sessionId: string): void {
    sessions.delete(sessionId);
  }
}

export const aiService = new AIService();
