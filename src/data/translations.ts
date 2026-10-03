export interface TranslationStrings {
  brandName: string;
  tagline: string;
  heroSubtext: string;
  talkToCarepath: string;
  findHealthcare: string;
  emergencyHelp: string;
  howItWorks: string;
  whyCarePath: string;
  multilingualTitle: string;
  safetyDisclaimer: string;
  finalCtaTitle: string;
  finalCtaSubtext: string;
  
  // Navigation
  navHome: string;
  navGuidance: string;
  navDoctors: string;
  navHospitals: string;
  navEmergency: string;
  
  // Steps
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;

  // Guidance Screen
  yourNextStep: string;
  whyExplanation: string;
  whatYouCanDoNext: string;
  findNearbyDoctors: string;
  findNearbyHospitals: string;
  homeCareAdvice: string;
  clinicVisitAdvice: string;
  urgentHospitalAdvice: string;

  // Emergency
  emergencyBannerTitle: string;
  emergencyBannerDesc: string;
  call112: string;
  callAmbulance: string;
  findNearestHospital: string;
  getDirections: string;

  // Filters & Discovery
  searchDoctorPlaceholder: string;
  filterByCity: string;
  filterBySpecialty: string;
  filterByBudget: string;
  filterByAvailability: string;
  bestMatch: string;
  viewProfile: string;
  bookAppointment: string;
  demoNotice: string;
  prototypeDisclaimer: string;
  
  // Hospital
  generalBeds: string;
  icuBeds: string;
  requestBedAssistance: string;
  viewHospital: string;

  // Chat
  chatPlaceholder: string;
  listening: string;
  processing: string;
  demoModeBadge: string;
  voiceTooltip: string;
}

export const translations: Record<'en' | 'hi' | 'mr', TranslationStrings> = {
  en: {
    brandName: 'CAREPATH',
    tagline: 'From Referral to the Right Care',
    heroSubtext: 'Talk to CarePath, understand your next step, and find the right healthcare option near you.',
    talkToCarepath: 'Talk to CarePath',
    findHealthcare: 'Find Healthcare',
    emergencyHelp: 'Emergency Help',
    howItWorks: 'How CarePath Works',
    whyCarePath: 'Why Rural Healthcare Needs CarePath',
    multilingualTitle: 'Healthcare in Your Own Language',
    safetyDisclaimer: 'CarePath provides guidance and healthcare navigation support. It does not replace professional medical diagnosis or treatment.',
    finalCtaTitle: 'Not sure what to do next?',
    finalCtaSubtext: 'Start a confidential guided conversation in English, Hindi, or Marathi.',

    navHome: 'Home',
    navGuidance: 'Health Guidance',
    navDoctors: 'Find Doctors',
    navHospitals: 'Hospitals & Beds',
    navEmergency: 'Emergency 112',

    step1Title: '1. Talk',
    step1Desc: 'Describe what is bothering you in plain words or spoken regional voice.',
    step2Title: '2. Understand',
    step2Desc: 'Answer simple follow-up questions adapted to your reported concerns.',
    step3Title: '3. Guide',
    step3Desc: 'Receive a structured next-step recommendation (Home Care, Clinic, or Urgent Hospital).',
    step4Title: '4. Connect',
    step4Desc: 'Discover verified nearby doctors and hospitals matched to your location and budget.',

    yourNextStep: 'YOUR NEXT STEP',
    whyExplanation: 'WHY THIS RECOMMENDATION?',
    whatYouCanDoNext: 'WHAT YOU CAN DO NEXT',
    findNearbyDoctors: 'Find Nearby Doctors',
    findNearbyHospitals: 'Find Nearby Hospitals',
    homeCareAdvice: 'Self-Care & Observation Recommended',
    clinicVisitAdvice: 'Consult a Local Healthcare Professional',
    urgentHospitalAdvice: 'Seek Urgent Hospital Evaluation Immediately',

    emergencyBannerTitle: 'URGENT MEDICAL ATTENTION',
    emergencyBannerDesc: 'Your responses indicate a possible emergency. Please seek urgent medical care immediately. Do not delay.',
    call112: 'CALL 112 (National Emergency)',
    callAmbulance: 'Call 108 (Ambulance)',
    findNearestHospital: 'Find Nearest Emergency Hospital',
    getDirections: 'Get Directions',

    searchDoctorPlaceholder: 'Search by doctor name, specialty, or clinic...',
    filterByCity: 'Location City',
    filterBySpecialty: 'Medical Specialty',
    filterByBudget: 'Max Consultation Fee',
    filterByAvailability: 'Availability',
    bestMatch: 'Best Match',
    viewProfile: 'View Profile',
    bookAppointment: 'Book Appointment',
    demoNotice: 'CarePath Verified Regional Health Directory.',
    prototypeDisclaimer: 'CarePath provides healthcare navigation and verified appointment scheduling.',

    generalBeds: 'General Beds',
    icuBeds: 'ICU Beds',
    requestBedAssistance: 'Request Bed Assistance',
    viewHospital: 'View Hospital Details',

    chatPlaceholder: 'Type your symptoms or tap the microphone...',
    listening: 'Listening... Please speak clearly',
    processing: 'Understanding your response...',
    demoModeBadge: 'Demo Mode Active',
    voiceTooltip: 'Speak in Hindi, Marathi, or English',
  },

  hi: {
    brandName: 'CAREPATH',
    tagline: 'सही सलाह से सही इलाज तक',
    heroSubtext: 'CarePath से बात करें, अपना अगला कदम समझें और अपने निकटतम सही स्वास्थ्य सेवा खोजें।',
    talkToCarepath: 'CarePath से बात करें',
    findHealthcare: 'डॉक्टर व अस्पताल खोजें',
    emergencyHelp: 'आपातकालीन सहायता (112)',
    howItWorks: 'CarePath कैसे काम करता है',
    whyCarePath: 'ग्रामीण स्वास्थ्य में CarePath क्यों आवश्यक है',
    multilingualTitle: 'अपनी भाषा में स्वास्थ्य मार्गदर्शन',
    safetyDisclaimer: 'CarePath केवल मार्गदर्शन और नेविगेशन सहायता प्रदान करता है। यह डॉक्टरी निदान या उपचार का विकल्प नहीं है।',
    finalCtaTitle: 'समझ नहीं आ रहा कि आगे क्या करें?',
    finalCtaSubtext: 'हिंदी, मराठी या अंग्रेजी में CarePath के साथ बातचीत शुरू करें।',

    navHome: 'होम',
    navGuidance: 'स्वास्थ्य मार्गदर्शन',
    navDoctors: 'डॉक्टर खोजें',
    navHospitals: 'अस्पताल व बेड',
    navEmergency: 'आपातकाल 112',

    step1Title: '1. बात करें',
    step1Desc: 'अपनी परेशानी आसान शब्दों में लिखकर या बोलकर बताएं।',
    step2Title: '2. समझें',
    step2Desc: 'अपनी स्थिति से जुड़े 2-3 सीधे और सरल सवालों के उत्तर दें।',
    step3Title: '3. मार्गदर्शन',
    step3Desc: 'जानें कि क्या घर पर आराम करना है, क्लीनिक जाना है या तुरंत अस्पताल।',
    step4Title: '4. संपर्क',
    step4Desc: 'अपने शहर, बजट और ज़रूरत के अनुसार निकटतम डॉक्टर या अस्पताल से जुड़ें।',

    yourNextStep: 'आपका अगला कदम',
    whyExplanation: 'यह सलाह क्यों दी गई है?',
    whatYouCanDoNext: 'अब आप क्या कर सकते हैं',
    findNearbyDoctors: 'निकटतम डॉक्टर खोजें',
    findNearbyHospitals: 'निकटतम अस्पताल देखें',
    homeCareAdvice: 'घरेलू देखभाल व निगरानी की सलाह',
    clinicVisitAdvice: 'नजदीकी डॉक्टर से परामर्श लें',
    urgentHospitalAdvice: 'तुरंत अस्पताल जाएं - आपातकालीन स्थिति',

    emergencyBannerTitle: 'तत्काल आपातकालीन चिकित्सा सहायता',
    emergencyBannerDesc: 'आपके लक्षणों से गंभीर स्थिति का संकेत मिलता है। कृपया बिना देरी किए तुरंत अस्पताल जाएं।',
    call112: '112 पर कॉल करें (आपातकाल)',
    callAmbulance: '108 पर कॉल करें (एम्बुलेंस)',
    findNearestHospital: 'निकटतम आपातकालीन अस्पताल खोजें',
    getDirections: 'रास्ता देखें',

    searchDoctorPlaceholder: 'डॉक्टर का नाम, विशेषता या अस्पताल खोजें...',
    filterByCity: 'शहर चुनें',
    filterBySpecialty: 'विशेषज्ञता',
    filterByBudget: 'अधिकतम परामर्श शुल्क',
    filterByAvailability: 'उपलब्धता',
    bestMatch: 'उपयुक्त विकल्प',
    viewProfile: 'प्रोफ़ाइल देखें',
    bookAppointment: 'अपॉइंटमेंट बुक करें',
    demoNotice: 'CarePath सत्यापित क्षेत्रीय स्वास्थ्य निर्देशिका।',
    prototypeDisclaimer: 'CarePath स्वास्थ्य मार्गदर्शन और सत्यापित अपॉइंटमेंट सुविधा प्रदान करता है।',

    generalBeds: 'सामान्य बेड',
    icuBeds: 'आईसीयू बेड',
    requestBedAssistance: 'बेड सहायता का अनुरोध करें',
    viewHospital: 'अस्पताल विवरण देखें',

    chatPlaceholder: 'अपनी समस्या लिखें या माइक दबाकर बोलें...',
    listening: 'सुन रहे हैं... कृपया स्पष्ट बोलें',
    processing: 'आपकी जानकारी समझ रहे हैं...',
    demoModeBadge: 'डेमो मोड सक्रिय',
    voiceTooltip: 'माइक दबाकर बोलें',
  },

  mr: {
    brandName: 'CAREPATH',
    tagline: 'योग्य संदर्भातून योग्य उपचाराकडे',
    heroSubtext: 'CarePath शी बोला, पुढची पायरी समजून घ्या आणि आपल्या जवळचे योग्य डॉक्टर किंवा रुग्णालय शोधा.',
    talkToCarepath: 'CarePath शी बोला',
    findHealthcare: 'आरोग्य सेवा शोधा',
    emergencyHelp: 'तातडीची मदत (112)',
    howItWorks: 'CarePath कसे कार्य करते',
    whyCarePath: 'ग्रामीण आरोग्यासाठी CarePath का महत्वाचे आहे',
    multilingualTitle: 'तुमच्या स्वतःच्या मातृभाषेत आरोग्य मार्गदर्शन',
    safetyDisclaimer: 'CarePath केवळ प्राथमिक मार्गदर्शन आणि दिशा दर्शवण्यासाठी आहे. हे वैद्यकीय निदान किंवा उपचारांचा पर्याय नाही.',
    finalCtaTitle: 'पुढे काय करावे हे समजत नाही?',
    finalCtaSubtext: 'मराठी, हिंदी किंवा इंग्रजीत CarePath शी सहज संवाद सुरू करा.',

    navHome: 'मुख्यपृष्ठ',
    navGuidance: 'आरोग्य मार्गदर्शन',
    navDoctors: 'डॉक्टर शोधा',
    navHospitals: 'रुग्णालये व खाटा',
    navEmergency: 'तातडीची मदत 112',

    step1Title: '१. बोला',
    step1Desc: 'आपल्याला होणारा त्रास साध्या शब्दांत लिहून किंवा बोलून सांगा.',
    step2Title: '२. समजून घ्या',
    step2Desc: 'आपल्या लक्षणांशी संबंधित २-३ सोप्या प्रश्नांची उत्तरे द्या.',
    step3Title: '३. मार्गदर्शन',
    step3Desc: 'घरी विश्रांती घ्यावी, क्लिनिकमध्ये जावे की तातडीने रुग्णालयात जावे ते जाणून घ्या.',
    step4Title: '४. जोडून घ्या',
    step4Desc: 'आपल्या गावाजवळ किंवा शहरात योग्य डॉक्टर व रुग्णालयाचा शोध घ्या.',

    yourNextStep: 'आपली पुढची पायरी',
    whyExplanation: 'हा सल्ला का दिला आहे?',
    whatYouCanDoNext: 'आता आपण काय करू शकता',
    findNearbyDoctors: 'जवळचे डॉक्टर शोधा',
    findNearbyHospitals: 'जवळची रुग्णालये शोधा',
    homeCareAdvice: 'घरगुती काळजी व देखरेख',
    clinicVisitAdvice: 'स्थानिक डॉक्टरांचा सल्ला घ्या',
    urgentHospitalAdvice: 'तातडीने मोठ्या रुग्णालयात जा',

    emergencyBannerTitle: 'तातडीची वैद्यकीय मदत आवश्यक',
    emergencyBannerDesc: 'आपल्या लक्षणांवरून तात्काळ उपचारांची आवश्यकता दिसते. विलंब न करता जवळच्या रुग्णालयात जा.',
    call112: '११२ वर कॉल करा (आपत्कालीन)',
    callAmbulance: '१०८ वर कॉल करा (रुग्णवाहिका)',
    findNearestHospital: 'जवळचे आपत्कालीन रुग्णालय शोधा',
    getDirections: 'दिशानिर्देश मिळवा',

    searchDoctorPlaceholder: 'डॉक्टरांचे नाव, विशेष विभाग किंवा रुग्णालय शोधा...',
    filterByCity: 'शहर निवडा',
    filterBySpecialty: 'वैद्यकीय विभाग',
    filterByBudget: 'जास्तीत जास्त फी',
    filterByAvailability: 'उपलब्धता',
    bestMatch: 'उत्तम जुळणी',
    viewProfile: 'माहिती पहा',
    bookAppointment: 'भेट नोंदवा',
    demoNotice: 'CarePath प्रमाणित प्रादेशिक आरोग्य मार्गदर्शिका.',
    prototypeDisclaimer: 'CarePath आरोग्य मार्गदर्शन आणि नोंदणी सहाय्य प्रदान करते.',

    generalBeds: 'साध्या खाटा',
    icuBeds: 'आयसीयू खाटा',
    requestBedAssistance: 'खाटेसाठी मदत मागा',
    viewHospital: 'रुग्णालय तपशील पहा',

    chatPlaceholder: 'आपला त्रास लिहा किंवा माईक दाबून बोला...',
    listening: 'ऐकत आहोत... कृपया स्पष्ट बोला',
    processing: 'माहिती तपासत आहोत...',
    demoModeBadge: 'डेमो मोड सक्रिय',
    voiceTooltip: 'माईक दाबून बोला',
  },
};
