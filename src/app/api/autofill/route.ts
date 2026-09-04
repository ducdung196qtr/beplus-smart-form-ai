import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Input text is required to extract profile data.' },
        { status: 400 }
      );
    }

    const clean = text.trim();

    // 1. Extract Name
    let name = '';
    const nameMatch = clean.match(/(?:i am|i'm|name is|this is|my name is)\s+([A-Z][a-zA-Z]*(?:\s+[A-Z][a-zA-Z]*)*)/i);
    if (nameMatch && nameMatch[1]) {
      name = nameMatch[1].trim();
    } else {
      const firstWord = clean.split(/[.,\n]/)[0].match(/[A-Z][a-zA-Z]+/);
      name = firstWord ? firstWord[0] : 'Professional Candidate';
    }

    // 2. Extract Skills (Check common modern tech & domain keywords)
    const KNOWN_SKILLS = [
      'WordPress', 'React', 'Vue', 'Angular', 'Next.js', 'Node.js', 'TypeScript', 'JavaScript',
      'PHP', 'Python', 'Java', 'Golang', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure',
      'UI/UX', 'Figma', 'GraphQL', 'REST API', 'API', 'AI', 'Tailwind', 'CSS', 'HTML',
      'SQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Machine Learning', 'Data Science'
    ];

    const detectedSkills: string[] = [];
    KNOWN_SKILLS.forEach(skill => {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(clean)) {
        detectedSkills.push(skill);
      }
    });

    if (detectedSkills.length === 0) {
      detectedSkills.push('Web Development', 'Problem Solving');
    }

    // 3. Extract Role / Title
    let title = 'Software Engineer';
    const titleMatch = clean.match(/(?:a|an)\s+([a-zA-Z\s]+developer|[a-zA-Z\s]+engineer|[a-zA-Z\s]+designer|[a-zA-Z\s]+lead|[a-zA-Z\s]+specialist)/i);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].trim().replace(/^./, (c) => c.toUpperCase());
    } else if (clean.toLowerCase().includes('frontend')) {
      title = 'Frontend Developer';
    } else if (clean.toLowerCase().includes('backend')) {
      title = 'Backend Engineer';
    } else if (clean.toLowerCase().includes('fullstack')) {
      title = 'Fullstack Engineer';
    }

    // 4. Extract Bio / Summary
    let bio = clean;
    // Format bio gracefully
    if (clean.length > 280) {
      bio = clean.substring(0, 277) + '...';
    }

    // 5. Extract Email & Phone if present
    const emailMatch = clean.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const email = emailMatch ? emailMatch[0] : `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`;

    const phoneMatch = clean.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    const phone = phoneMatch ? phoneMatch[0] : '+1 (555) 382-9102';

    // Simulate AI thinking delay (~600ms) for realistic UX feel
    await new Promise((resolve) => setTimeout(resolve, 600));

    return NextResponse.json({
      success: true,
      data: {
        name,
        title,
        bio,
        skills: Array.from(new Set(detectedSkills)),
        email,
        phone,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred while parsing profile text.' },
      { status: 500 }
    );
  }
}
