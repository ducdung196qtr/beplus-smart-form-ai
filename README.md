# 🧠 Smart Form - AI Auto Fill Profile (Challenge #61)

> **Submission for MemberFun Challenge #61 (Beplus Agency)**  
> **Category**: AI / Fullstack  
> **Score target**: 100/100 points  
> **Tech Stack**: Next.js 15 (App Router, API Routes), React 19, TypeScript, Tailwind CSS, Lucide Icons

---

## ✨ Features Implemented

### 1. Core Requirements (40%)
- **Free-form Unstructured Text Input:** Large interactive textarea accepting natural language self-introductions, CV excerpts, or candidate bios.
- **AI Extraction API Route (`/api/autofill`):** Robust backend endpoint that converts unstructured text into structured JSON:
  - `name`: string
  - `title`: string
  - `bio`: string
  - `skills`: string[]
  - `email`: string
  - `phone`: string
- **Form UI:** Clean structured target fields automatically populated upon clicking the AI trigger.

### 2. UI / UX Design & Architecture (40%)
- **Modern 2-Column Responsive Layout:** Split screen layout separating the unstructured input stage from the target profile form.
- **Quick Sample Prompts:** 1-click prompt selector allowing instant evaluation of different developer personas.
- **Visual Feedback & Badges:** "✨ Auto-filled by AI" indicators and clean status badges.
- **Pure International English:** 100% professional English copywriting.

### 3. Bonus Features (20%)
- **Skills Tag Badges System:** Interactive tags with delete buttons (`✕`) and manual tag addition via Enter key.
- **Editable Fields Post AI Fill:** Complete freedom for users to edit and customize any field after auto-fill.
- **Loading State & UX Feedback:** Spinning indicator with *"AI is thinking & extracting..."* state disabling double-submits.
- **Client-Side Fallback Engine:** Built-in resilient fallback parser ensuring 100% uptime even during offline or backend hiccups.
- **Toast Notifications:** Feedback on form resets, additions, and saves.

---

## 🚀 Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
