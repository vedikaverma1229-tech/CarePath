import { StructuredGuidanceResult } from '../types';

export type GeminiModel = 'gemini-3.5-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite';
export type AIRole = 'clinical_navigator' | 'complex_triage' | 'fast_screener' | 'health_researcher';

export interface AIServiceResponse {
  sessionId: string;
  nextQuestion?: string;
  suggestions?: string[];
  guidanceResult?: StructuredGuidanceResult;
  isEmergency?: boolean;
  modelUsed?: string;
  groundingSources?: Array<{ title: string; uri: string }>;
  searchQueries?: string[];
}

export interface SendMessageParams {
  message: string;
  sessionId?: string;
  language?: string;
  model?: GeminiModel;
  role?: AIRole;
  useSearchGrounding?: boolean;
}

const DEMO_QUESTIONS = [
  {
    step: 1,
    questionEn: 'How long have you had the fever? (Fever kab se hai?)',
    questionHi: 'बुखार कब से है? कितने दिनों से तापमान बढ़ा हुआ है?',
    questionMr: 'ताप कधीपासून आहे? किती दिवसांपासून कणकण वाटते आहे?',
    suggestions: ['2 din se (Since 2 days)', 'Aaj subah se (Today)', 'More than 4 days'],
  },
  {
    step: 2,
    questionEn: 'What is the recorded body temperature? (Temperature kitna hai?)',
    questionHi: 'तापमान कितना है? क्या थर्मामीटर से नापा है?',
    questionMr: 'अंदाजे किती तापमान मोजले आहे?',
    suggestions: ['101°F', '100°F (Mild)', '102°F or higher', 'Not measured'],
  },
  {
    step: 3,
    questionEn: 'Are there severe danger symptoms like chest pain, heavy breathing difficulty, or fainting?',
    questionHi: 'क्या सीने में तेज दर्द, सांस लेने में तकलीफ या बेहोशी है?',
    questionMr: 'छातीत दुखणे किंवा श्वास घेण्यास खूप त्रास होत आहे का?',
    suggestions: ['No', 'Yes, severe breathing difficulty', 'Mild body weakness only'],
  },
];

const STANDARD_DEMO_RESULT: StructuredGuidanceResult = {
  conversationId: 'carepath-001',
  status: 'guidance_complete',
  careLevel: 'CLINIC',
  reason: 'Based on the fever duration and reported symptoms, an in-person consultation with a General Physician is advised for clinical evaluation and routine screening.',
  emergency: false,
  symptoms: ['Fever', 'Mild weakness', 'No acute chest distress'],
  recommendedSpecialty: 'General Medicine',
  location: 'Nagpur',
  budget: 500,
  language: 'English',
};

const EMERGENCY_DEMO_RESULT: StructuredGuidanceResult = {
  conversationId: 'carepath-urgent-999',
  status: 'emergency_escalation',
  careLevel: 'URGENT_HOSPITAL',
  reason: 'Reported chest pain or respiratory distress are potential acute red flags. Immediate emergency evaluation is urgently required.',
  emergency: true,
  symptoms: ['Acute Chest Pain', 'Severe Breathing Distress'],
  recommendedSpecialty: 'Emergency / Cardiology',
  location: 'Nagpur',
  budget: 1000,
  language: 'English',
};

class AIService {
  private currentStep = 0;
  private currentSessionId = 'session-' + Date.now();
  private userAnswers: string[] = [];

  async startConversation(language = 'en'): Promise<AIServiceResponse> {
    this.currentStep = 0;
    this.userAnswers = [];
    this.currentSessionId = 'session-' + Date.now();

    try {
      const res = await fetch('/api/ai/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language }),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          sessionId: data.sessionId,
          nextQuestion: data.session?.history[0]?.text,
        };
      }
    } catch {
      // Fallback
    }

    let initialQ = 'Namaste! Tell me about your health concern and I will help you understand the next step.';
    if (language === 'hi') initialQ = 'नमस्ते! आज आपको क्या स्वास्थ्य परेशानी हो रही है?';
    if (language === 'mr') initialQ = 'नमस्कार! आज आपल्याला आरोग्याविषयी काय त्रास होत आहे?';

    return {
      sessionId: this.currentSessionId,
      nextQuestion: initialQ,
      suggestions: [
        'I have fever and body ache',
        'Severe chest pain & breathless',
        'Stomach ache and nausea',
        'Knee joint pain & swelling',
      ],
    };
  }

  async sendMessage(params: SendMessageParams | string, sessionIdParam?: string, langParam = 'en'): Promise<AIServiceResponse> {
    let message = '';
    let sId = '';
    let language = 'en';
    let model: GeminiModel = 'gemini-3.5-flash';
    let role: AIRole = 'clinical_navigator';
    let useSearchGrounding = false;

    if (typeof params === 'string') {
      message = params;
      sId = sessionIdParam || this.currentSessionId;
      language = langParam;
    } else {
      message = params.message;
      sId = params.sessionId || this.currentSessionId;
      language = params.language || 'en';
      model = params.model || 'gemini-3.5-flash';
      role = params.role || 'clinical_navigator';
      useSearchGrounding = Boolean(params.useSearchGrounding);
    }

    this.userAnswers.push(message);

    const lower = message.toLowerCase();
    const isEmergency =
      lower.includes('chest pain') ||
      lower.includes('breathless') ||
      lower.includes('heart attack') ||
      lower.includes('behoshi') ||
      lower.includes('unconscious') ||
      lower.includes('saans lene me dikkat');

    try {
      const res = await fetch('/api/ai/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sId,
          message,
          language,
          model,
          role,
          useSearchGrounding,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        return {
          sessionId: sId,
          nextQuestion: json.data?.nextQuestion,
          suggestions: json.data?.suggestions,
          guidanceResult: json.data?.guidanceResult,
          isEmergency: json.data?.isEmergency,
          modelUsed: json.modelUsed,
          groundingSources: json.groundingSources,
          searchQueries: json.searchQueries,
        };
      }
    } catch {
      // Fallback
    }

    if (isEmergency) {
      return {
        sessionId: sId,
        isEmergency: true,
        guidanceResult: { ...EMERGENCY_DEMO_RESULT, conversationId: sId },
      };
    }

    if (this.currentStep < DEMO_QUESTIONS.length) {
      const q = DEMO_QUESTIONS[this.currentStep];
      this.currentStep++;

      let text = q.questionEn;
      if (language === 'hi') text = q.questionHi;
      if (language === 'mr') text = q.questionMr;

      return {
        sessionId: sId,
        nextQuestion: text,
        suggestions: q.suggestions,
        isEmergency: false,
      };
    } else {
      return {
        sessionId: sId,
        guidanceResult: { ...STANDARD_DEMO_RESULT, conversationId: sId },
        isEmergency: false,
      };
    }
  }
}

export const aiService = new AIService();
