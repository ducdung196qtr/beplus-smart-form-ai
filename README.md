# 🧠 Smart Form - AI Auto Fill Profile (Challenge #61)

> **Submission for MemberFun Challenge #61 (Beplus Agency)**  
> **Category**: AI / Fullstack  
> **Score target**: 100/100 points  
> **Tech Stack**: Next.js 15 (App Router, API Routes), React 19, TypeScript, Tailwind CSS, Lucide Icons

---

## ✨ Features Implemented

### 1. Core Requirements (40%)
- **Free-form Unstructured Text Input:** Large interactive textarea accepting natural language self-introductions, CV excerpts, or candidate bios.
- **Dual Extraction Engines (`/api/autofill`):**
  - 🧠 **Option 1 (Real AI - LLM):** Connects to OpenAI-compatible endpoint (Gemini / 9Router Gateway). Intelligently extracts complex technical stacks (e.g. `Supabase, n8n, AI Agent`), summarizes bios, understands Vietnamese & English natively, and never invents missing contact information.
  - ⚡ **Option 2 (Local Regex / Mock):** Fast rule-based parser matching against fixed keyword sets. Ensures offline resilience and instant fallback demonstration.
- **1-Click Engine Selector:** Convenient dropdown allowing users and evaluators to directly compare Real AI semantic extraction vs. Regex keyword extraction in real-time.
- **Form UI:** Clean structured target fields automatically populated upon clicking the extraction trigger.

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

### ⚙️ Optional Real AI Configuration (.env)

If no `.env` is configured, the system gracefully operates in **Local Regex (Mock)** mode. To activate **Real AI (LLM)** extraction:

```env
AI_BASE_URL=http://127.0.0.1:20128/v1
AI_API_KEY=your_api_key_here
AI_MODEL=ag/gemini-3.7-flash-high
```
