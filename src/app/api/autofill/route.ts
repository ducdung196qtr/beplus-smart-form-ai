import { NextResponse } from 'next/server';

interface ProfileData {
  name: string;
  title: string;
  bio: string;
  skills: string[];
  email: string;
  phone: string;
}

/**
 * 1. LOCAL RULE-BASED / MOCK ENGINE (FAST REGEX + FIXED KEYWORD LIST)
 */
function extractWithMock(text: string): ProfileData {
  const clean = text.trim();

  // 1. Name: Support Vietnamese patterns ("Tôi là...", "Mình tên là...", "Dũng là một...", "Em là...") as well as English
  let name = '';
  const vnIntroMatch = clean.match(/(?:tôi là|tên tôi là|mình là|mình tên là|em là|anh là)\s+([A-ZÀ-Ỹ][a-zà-ỹA-ZÀ-Ỹ]*(?:\s+[A-ZÀ-Ỹ][a-zà-ỹA-ZÀ-Ỹ]*){0,4})/i);
  const enIntroMatch = clean.match(/(?:i am|i'm|name is|this is|my name is)\s+([A-Z][a-zA-Z]*(?:\s+[A-Z][a-zA-Z]*){0,4})/i);
  const subjectIntroMatch = clean.match(/^([A-ZÀ-Ỹ][a-zà-ỹA-ZÀ-Ỹ]*(?:\s+[A-ZÀ-Ỹ][a-zà-ỹA-ZÀ-Ỹ]*){0,3})\s+(?:là|is|hiện là|currently)\s+(?:một|a|an)?/i);

  if (vnIntroMatch && vnIntroMatch[1]) {
    name = vnIntroMatch[1].trim();
  } else if (enIntroMatch && enIntroMatch[1]) {
    name = enIntroMatch[1].trim();
  } else if (subjectIntroMatch && subjectIntroMatch[1]) {
    name = subjectIntroMatch[1].trim();
  } else {
    // Fallback: scan for capitalized Vietnamese or English proper name at the beginning of sentence
    const firstWordMatch = clean.match(/^([A-ZÀ-Ỹ][a-zà-ỹA-ZÀ-Ỹ]+(?:\s+[A-ZÀ-Ỹ][a-zà-ỹA-ZÀ-Ỹ]+)?)/);
    name = firstWordMatch ? firstWordMatch[1].trim() : 'Candidate';
  }

  // 2. Comprehensive Known Skills (expanded tech stack list)
  const KNOWN_SKILLS = [
    'WordPress', 'React', 'Vue', 'Angular', 'Next.js', 'Nuxt', 'Node.js', 'Express',
    'TypeScript', 'JavaScript', 'PHP', 'Python', 'Java', 'Golang', 'Rust', 'C#', '.NET',
    'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Supabase', 'Firebase', 'PostgreSQL',
    'MySQL', 'MongoDB', 'Redis', 'GraphQL', 'REST API', 'API', 'Tailwind', 'CSS', 'HTML',
    'SCSS', 'Sass', 'Figma', 'UI/UX', 'SEO', 'Laravel', 'Django', 'FastAPI', 'n8n',
    'Git', 'CI/CD', 'Linux', 'AI Agent', 'AI', 'Machine Learning', 'Data Science'
  ];

  const detectedSkills: string[] = [];
  KNOWN_SKILLS.forEach((skill) => {
    // Avoid false positives like "AI" matching inside "email" or "Tailwind"
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-zA-Z0-9_])${escaped}(?=[^a-zA-Z0-9_]|$)`, 'i');
    if (regex.test(clean)) {
      detectedSkills.push(skill);
    }
  });

  // 3. Role / Title
  let title = '';
  const titlePattern = clean.match(/(?:là|is|as)\s+(?:một|a|an)?\s*([a-zA-Z0-9\s\-]+?(?:Developer|Engineer|Designer|Lead|Specialist|Architect|Lập trình viên|Chuyên viên|Manager))/i);
  if (titlePattern && titlePattern[1]) {
    title = titlePattern[1].trim().replace(/^./, (c) => c.toUpperCase());
  } else if (/front[\s-]?end/i.test(clean)) {
    title = 'Front-end Developer';
  } else if (/back[\s-]?end/i.test(clean)) {
    title = 'Back-end Engineer';
  } else if (/full[\s-]?stack/i.test(clean)) {
    title = 'Fullstack Engineer';
  } else if (/ui[\s\/]?ux/i.test(clean)) {
    title = 'UI/UX Designer';
  } else if (/devops/i.test(clean)) {
    title = 'DevOps Engineer';
  } else {
    title = 'Software Engineer';
  }

  // 4. Bio
  let bio = clean;
  if (clean.length > 320) {
    bio = clean.substring(0, 317) + '...';
  }

  // 5. Email & Phone (Never fabricate dummy email or phone if missing!)
  const emailMatch = clean.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : '';

  const phoneMatch = clean.match(/(?:(?:\+84|0)(?:\s|\.)?[3|5|7|8|9]\d{8})|(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  return {
    name,
    title,
    bio,
    skills: Array.from(new Set(detectedSkills)),
    email,
    phone,
  };
}

/**
 * 2. REAL AI ENGINE (LLM CALL VIA 9ROUTER / OPENAI-COMPATIBLE API)
 */
async function extractWithRealAI(text: string): Promise<ProfileData> {
  const endpoint = process.env.AI_BASE_URL || 'http://127.0.0.1:20128/v1';
  const apiKey = process.env.AI_API_KEY || 'sk-2cdc806d2f952b429d2f62776c535791f380';
  const model = process.env.AI_MODEL || 'ag/gemini-3.7-flash-high';

  const systemPrompt = `You are a high-accuracy candidate profile information extractor.
Analyze the user's free-form description or CV notes and extract structured profile data.

Strict JSON format to output:
{
  "name": "Full name or empty string if absent",
  "title": "Professional title or role mentioned",
  "bio": "A refined, concise 1-3 sentence professional summary based strictly on the text",
  "skills": ["Array", "of", "all", "technologies", "tools", "and", "skills", "mentioned"],
  "email": "Valid email if found, or empty string",
  "phone": "Valid phone number if found, or empty string"
}

Critical Instructions:
1. Do NOT invent or fake personal contact details. If email or phone is not provided in the text, return empty string "".
2. Extract ANY technical tools or domain skills found in the text (e.g. Supabase, Prisma, n8n, Tailwind, Rust, Go, SEO, etc.), not just common keywords.
3. Support multi-language inputs (e.g. Vietnamese, English) with native fluency.
4. Output RAW JSON ONLY. Do NOT include markdown backticks or commentary.`;

  const response = await fetch(`${endpoint.replace(/\/+$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      stream: false,
      temperature: 0.1,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`AI Gateway responded with status ${response.status}: ${errText.slice(0, 120)}`);
  }

  const json = await response.json();
  const rawContent = json.choices?.[0]?.message?.content || '';

  // Clean possible markdown codefence
  const cleanedJson = rawContent
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  const parsed = JSON.parse(cleanedJson);

  return {
    name: typeof parsed.name === 'string' ? parsed.name.trim() : '',
    title: typeof parsed.title === 'string' ? parsed.title.trim() : 'Software Professional',
    bio: typeof parsed.bio === 'string' ? parsed.bio.trim() : text.slice(0, 250),
    skills: Array.isArray(parsed.skills)
      ? (Array.from(new Set(parsed.skills.map((s: any) => String(s).trim()))).filter(Boolean) as string[])
      : [],
    email: typeof parsed.email === 'string' ? parsed.email.trim() : '',
    phone: typeof parsed.phone === 'string' ? parsed.phone.trim() : '',
  };
}

export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    const { text, engine = 'ai' } = await request.json();

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Input text is required to extract profile data.' },
        { status: 400 }
      );
    }

    const clean = text.trim();
    let resultData: ProfileData;
    let usedEngine: 'ai' | 'mock' = engine === 'mock' ? 'mock' : 'ai';
    let fallbackHappened = false;

    if (usedEngine === 'mock') {
      // Fast local mock simulation
      await new Promise((resolve) => setTimeout(resolve, 120));
      resultData = extractWithMock(clean);
    } else {
      try {
        resultData = await extractWithRealAI(clean);
      } catch (aiError: any) {
        console.warn('Real AI call failed, falling back to local mock parser:', aiError.message);
        resultData = extractWithMock(clean);
        usedEngine = 'mock';
        fallbackHappened = true;
      }
    }

    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      engine: usedEngine,
      fallback: fallbackHappened,
      latencyMs,
      data: resultData,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred while parsing profile text.' },
      { status: 500 }
    );
  }
}
