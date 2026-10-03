# CAREPATH — Rural Health Guidance Assistant
> **"From Referral to the Right Care"**  
> *Hackathon MVP for PS-03 (Rural Health Guidance Assistant)*

---

## 🚀 Quick Start in Visual Studio Code

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **bun** or **yarn**

---

### Step 1: Open in VS Code
Extract the downloaded zip archive and open the extracted folder in VS Code:
```bash
code .
```

---

### Step 2: Install Dependencies
Open the integrated terminal in VS Code (`Ctrl + ~` or `Cmd + ~`) and run:
```bash
npm install
```

---

### Step 3: Run the Development Server
```bash
npm run dev
```
The full-stack application will launch on:
👉 **`http://localhost:3000`**

- **Frontend (Vite + React 19 + Tailwind CSS)**: Running with hot module reload on port 3000.
- **Backend (Express + REST API)**: Running concurrently via `server.ts` mounted with Vite middlewares.
- **API Health Check**: `http://localhost:3000/api/health`

---

## 🎨 Color System

| Purpose | Color | Hex Code |
| :--- | :--- | :--- |
| 🔴 **Primary / CTA** | Medical Red | `#D94A4A` |
| 🌸 **Secondary** | Soft Rose | `#F4B6B6` |
| 🩷 **Light Accent** | Very Light Pink | `#FFF1F1` |
| ⬜ **Background** | Off White | `#FFF9F9` |
| 🤍 **Cards** | White | `#FFFFFF` |
| 🖤 **Main Text** | Dark Charcoal | `#252525` |
| 🔴 **Deep Red** | Important Actions | `#A83232` |
| 🟢 **Success / Safe** | Healthcare Green | `#2E9B68` |
| 🟠 **Warning** | Amber | `#E9A23B` |
| 🚨 **Emergency** | Deep Emergency Red | `#9E2020` |

---

## 📁 Project Architecture

```
carepath/
├── backend/
│   ├── data/
│   │   ├── doctors.json         # 14 realistic fictional doctors across Nagpur, Bhopal, Indore
│   │   ├── hospitals.json       # 8 regional hospitals with bed counts & emergency status
│   │   └── demoConversation.json # Scripted evaluation dialogue
│   ├── services/
│   │   ├── doctorService.ts
│   │   ├── hospitalService.ts
│   │   ├── appointmentService.ts
│   │   └── aiService.ts         # Backend AI session management placeholder
│   ├── controllers/
│   │   ├── doctorController.ts
│   │   ├── hospitalController.ts
│   │   ├── appointmentController.ts
│   │   └── aiController.ts
│   └── routes/
│       ├── doctorRoutes.ts
│       ├── hospitalRoutes.ts
│       ├── appointmentRoutes.ts
│       └── aiRoutes.ts
│
├── src/
│   ├── components/
│   │   ├── Navbar.tsx           # Responsive header with language switcher & appointment link
│   │   ├── Footer.tsx           # Clinical boundary disclaimer & regional focus
│   │   ├── HeartHero3D.tsx      # Three.js 3D parametric heart with heartbeat pulsation
│   │   ├── ChatMessage.tsx      # Patient/Assistant chat bubbles with exact colors
│   │   ├── VoiceInput.tsx       # Browser Web Speech API with regional Hindi/Marathi support
│   │   ├── GuidanceResult.tsx   # Structured Triage Output (Home Care, Clinic, Hospital)
│   │   ├── EmergencyCard.tsx    # Direct 112 & 108 emergency dialers
│   │   ├── DoctorCard.tsx       # Doctor profile card with "Best Match" indicator
│   │   ├── HospitalCard.tsx     # Hospital card with demo bed counts
│   │   ├── FilterPanel.tsx      # Specialty, city, budget slider & availability filters
│   │   ├── AppointmentModal.tsx # Quick booking modal
│   │   └── BedRequestModal.tsx  # Bed coordination modal
│   │
│   ├── pages/
│   │   ├── Home.tsx             # 7-section landing page with 3D Heart hero
│   │   ├── Guidance.tsx         # AI Conversation page with side understanding panel & demo runners
│   │   ├── AppointmentBooking.tsx # Dedicated appointment platform (Calendar, Timeslots, Doctor List)
│   │   ├── Doctors.tsx          # Doctor discovery directory
│   │   ├── DoctorProfile.tsx    # Practitioner profile & qualifications
│   │   ├── Hospitals.tsx        # Hospital discovery & bed status
│   │   ├── HospitalProfile.tsx  # Detailed hospital profile & casualty contacts
│   │   └── Emergency.tsx        # Emergency 112 gateway & first-aid guide
│   │
│   ├── context/
│   │   └── LanguageContext.tsx  # Multilingual state (English, Hindi हिंदी, Marathi मराठी)
│   ├── services/
│   │   ├── aiService.ts         # Frontend AI service contract (AI MODULE PLACEHOLDER)
│   │   ├── doctorService.ts
│   │   ├── hospitalService.ts
│   │   └── appointmentService.ts
│   ├── types/
│   │   └── index.ts             # TypeScript definitions
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── server.ts                    # Express server mounting Vite SPA middleware
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## ⚡ Connecting Your External AI Module Later

The codebase contains a modular AI service layer marked:
```typescript
// AI MODULE PLACEHOLDER
// TO BE IMPLEMENTED BY PROJECT OWNER
```
Located in:
- `src/services/aiService.ts`
- `backend/services/aiService.ts`

You can connect your custom fine-tuned LLM, clinical rule engine, or external API directly to these functions without modifying any frontend UI components.

---

## 📝 Available Scripts
- `npm run dev`: Starts the full-stack server on `http://localhost:3000`
- `npm run build`: Compiles production build to `dist/`
- `npm run lint`: Verifies TypeScript types (`tsc --noEmit`)
