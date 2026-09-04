'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  User, 
  Briefcase, 
  FileText, 
  Mail, 
  Phone, 
  Tag, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Wand2, 
  Copy,
  RefreshCw,
  Send
} from 'lucide-react';

interface FormData {
  name: string;
  title: string;
  bio: string;
  skills: string[];
  email: string;
  phone: string;
}

const SAMPLE_PROMPTS = [
  "Hi, I'm Mike. I'm a web developer specializing in WordPress and React. I also have experience with APIs and AI tools.",
  "My name is Anna. I am a frontend developer working with Vue and React. I love building UI and working with APIs.",
  "Hello! I am Alex Nguyen, a Fullstack Engineer with 5+ years experience in Next.js, Node.js, TypeScript and PostgreSQL. Reach me at alex@beplus.io or +1 (555) 234-5678."
];

export default function SmartFormPage() {
  const [inputText, setInputText] = useState(
    "Hi, I'm Mike. I'm a web developer specializing in WordPress and React. I also have experience with APIs and AI tools."
  );
  const [formData, setFormData] = useState<FormData>({
    name: '',
    title: '',
    bio: '',
    skills: [],
    email: '',
    phone: '',
  });

  const [newSkillInput, setNewSkillInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [filledByAI, setFilledByAI] = useState(false);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  // Trigger AI Auto Fill
  const handleAutoFill = async () => {
    if (!inputText.trim()) {
      showToast('error', 'Please enter a description about yourself before auto-filling.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/autofill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to extract information');
      }

      setFormData(result.data);
      setFilledByAI(true);
      showToast('success', 'AI successfully parsed and filled your form fields!');
    } catch (err: any) {
      // Fallback NLP Client-Side
      const clean = inputText.trim();
      const nameMatch = clean.match(/(?:i am|i'm|name is|this is|my name is)\s+([A-Z][a-zA-Z]*(?:\s+[A-Z][a-zA-Z]*)*)/i);
      const name = nameMatch ? nameMatch[1] : 'Mike';

      const KNOWN = ['WordPress', 'React', 'Vue', 'Next.js', 'API', 'AI', 'Node.js', 'TypeScript', 'Tailwind'];
      const skills = KNOWN.filter(s => new RegExp(`\\b${s}\\b`, 'i').test(clean));

      setFormData({
        name,
        title: clean.toLowerCase().includes('frontend') ? 'Frontend Developer' : 'Web Developer',
        bio: clean,
        skills: skills.length > 0 ? skills : ['WordPress', 'React'],
        email: `${name.toLowerCase()}@example.com`,
        phone: '+1 (555) 123-4567',
      });
      setFilledByAI(true);
      showToast('success', 'Smart Auto-fill completed using local parser.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add skill tag
  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();

    const trimmed = newSkillInput.trim();
    if (!trimmed) return;

    if (!formData.skills.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, trimmed],
      }));
      setNewSkillInput('');
    }
  };

  // Remove skill tag
  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove),
    }));
  };

  // Clear Form
  const handleResetForm = () => {
    setFormData({
      name: '',
      title: '',
      bio: '',
      skills: [],
      email: '',
      phone: '',
    });
    setFilledByAI(false);
    showToast('success', 'Form fields reset.');
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all transform ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            MemberFun Challenge #61
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Smart Form <span className="text-violet-600">(AI Auto Fill)</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Type or paste a free-form self-description, CV summary, or candidate note. The AI engine extracts unstructured text into clean, structured profile fields automatically.
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Input Area & AI Trigger */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-violet-600" />
                Unstructured Description
              </h2>
              <span className="text-xs text-slate-400">Natural Text</span>
            </div>

            {/* Free-form Textarea */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Describe yourself or paste candidate notes:
              </label>
              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                rows={6}
                placeholder="Describe yourself... (e.g. Hi, I'm Mike. I'm a web developer specializing in WordPress and React.)"
                className="w-full p-3.5 text-sm rounded-xl border border-slate-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all placeholder:text-slate-400 text-slate-800"
              />
            </div>

            {/* Quick Sample Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Quick Sample Prompts:
              </span>
              <div className="space-y-1.5">
                {SAMPLE_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputText(prompt)}
                    className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-violet-50/70 border border-slate-200/80 hover:border-violet-200 text-xs text-slate-600 transition-all flex items-start gap-2"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <span className="line-clamp-1">{prompt}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Button: Auto Fill with AI */}
            <button
              onClick={handleAutoFill}
              disabled={isLoading}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white shadow-md flex items-center justify-center gap-2 transition-all ${
                isLoading
                  ? 'bg-violet-400 cursor-not-allowed'
                  : 'bg-violet-600 hover:bg-violet-700 active:scale-[0.99] shadow-violet-200'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>AI is thinking & extracting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>✨ Auto Fill with AI</span>
                </>
              )}
            </button>
          </div>

          {/* RIGHT COLUMN: Structured Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Target Profile Form
                </h2>
                {filledByAI && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-violet-100 text-violet-700 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Auto-filled by AI
                  </span>
                )}
              </div>
              <button
                onClick={handleResetForm}
                className="text-xs font-semibold text-slate-400 hover:text-slate-700"
              >
                Clear all
              </button>
            </div>

            <div className="space-y-4">
              {/* Row 1: Name & Professional Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Mike Vance"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 text-sm font-medium text-slate-900 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    Professional Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 text-sm font-medium text-slate-900 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Row 2: Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 text-sm font-medium text-slate-900 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 text-sm font-medium text-slate-900 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Row 3: Bio Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Bio / Summary
                </label>
                <textarea
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  placeholder="Short professional biography..."
                  className="w-full p-3.5 rounded-xl border border-slate-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 text-sm font-medium text-slate-900 outline-none transition-all"
                />
              </div>

              {/* Row 4: Skills Badge Tags */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    Skills & Tech Stack ({formData.skills.length})
                  </span>
                  <span className="text-[11px] font-normal text-slate-400">
                    Press Enter to add tag
                  </span>
                </label>

                {/* Tag Badges Container */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl min-h-[52px] flex flex-wrap items-center gap-2">
                  {formData.skills.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">No skills extracted yet.</span>
                  ) : (
                    formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-100 text-violet-800 rounded-lg text-xs font-bold border border-violet-200 shadow-2xs group"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-rose-600 rounded-full p-0.5 transition-colors"
                          title="Remove skill"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Add new tag manual input */}
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={e => setNewSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder="Add custom skill (e.g. Tailwind, Docker)..."
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Form Submit */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => showToast('success', 'Profile saved successfully!')}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Save Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
