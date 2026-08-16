// Local, offline knowledge base for the "Ask ResumeIQ" widget.
//
// Why: the AI reply depends on a backend + GEMINI_API_KEY being configured.
// These canned answers guarantee the chatbot always feels alive and useful
// — the quick-reply chips resolve instantly and never touch the network —
// while free-typed questions still get a real AI reply when the backend is
// available. See matchFaq() below for how free text is matched.

export const CHAT_FAQ = [
  {
    id: 'ats-score',
    chip: 'How is my ATS score calculated?',
    keywords: ['ats score', 'ats scoring', 'how is my score', 'how does ats', 'calculate my score', 'score work'],
    answer:
      "Your ATS score blends four things: keyword/skill overlap with your target role, formatting (no tables, columns, or images that confuse parsers), section structure (contact, experience, education, skills), and readability. Open the ATS Report page for the full breakdown by category, not just the total number.",
  },
  {
    id: 'ats-friendly',
    chip: 'What makes a resume ATS-friendly?',
    keywords: ['ats friendly', 'ats-friendly', 'format tips', 'resume format', 'formatting tips'],
    answer:
      "Stick to a single column, standard headings (Experience, Education, Skills), and common fonts. Avoid text inside images, tables, headers/footers, or graphics — most ATS parsers skip those entirely. Save as .docx or a text-based PDF, not a scanned image.",
  },
  {
    id: 'tell-me-about-yourself',
    chip: 'Tips for "tell me about yourself"?',
    keywords: ['tell me about yourself', 'about yourself', 'introduce myself'],
    answer:
      "Use the present-past-future structure: (1) who you are today in one line, (2) 1-2 relevant achievements from your background, (3) why you want this specific role. Keep it under 90 seconds and mirror language from the job description.",
  },
  {
    id: 'upload-help',
    chip: 'How do I upload my resume?',
    keywords: ['upload', 'how to upload', 'pdf', 'docx', 'file type', 'attach'],
    answer:
      "Go to the Upload page and drag in a PDF or DOCX (max 8MB). We extract the text right in your browser session — nothing is saved to a database. Add a job description too if you want a Job Match score, not just a general review.",
  },
  {
    id: 'job-match',
    chip: 'What does the Job Match score mean?',
    keywords: ['job match', 'match percentage', 'match score', 'job description match'],
    answer:
      "Job Match compares your resume against a specific job description and scores how closely your skills, keywords, and experience align with what that posting asks for. It's more targeted than the general ATS score, which doesn't assume a specific job.",
  },
  {
    id: 'cover-letter',
    chip: 'How do I write a strong cover letter?',
    keywords: ['cover letter'],
    answer:
      "Open the Cover Letter tool once you've uploaded a resume — it drafts one tailored to your target role or job description automatically. Good ones lead with a specific, verifiable achievement, connect it to the company's actual need, and stay under 300 words.",
  },
  {
    id: 'privacy',
    chip: 'Is my resume data saved anywhere?',
    keywords: ['data saved', 'privacy', 'is it saved', 'store my data', 'database', 'delete my data'],
    answer:
      "No account, no database. Your resume text lives only in this browser tab's memory for the current session — refreshing or closing the tab clears it. Nothing is written to disk on the server; uploaded files are parsed in memory and discarded.",
  },
  {
    id: 'improve',
    chip: 'How do I improve a weak resume?',
    keywords: ['improve my resume', 'improve resume', 'weak resume', 'make it better'],
    answer:
      "Start with the Improve tool — it rewrites weak bullet points into achievement-focused ones (action verb + what you did + measurable result). Then check the ATS Report for any structural gaps like missing sections or unparseable formatting.",
  },
  {
    id: 'interview',
    chip: 'How does the Interview Coach work?',
    keywords: ['interview coach', 'mock interview', 'interview practice', 'interview questions'],
    answer:
      "Interview Coach generates likely questions based on your resume and target role, then you can practice answers and get feedback on structure and specificity — great for behavioral (STAR method) and role-specific technical questions alike.",
  },
];

const GREETING_KEYWORDS = ['hi', 'hello', 'hey', 'yo', 'help', 'what can you do', 'what do you do'];

/**
 * Very lightweight keyword matcher — scores each FAQ entry by how many of
 * its keyword phrases appear in the user's message, picks the best match.
 * Returns null when nothing scores above 0, so the caller can fall back to
 * a real AI call.
 */
export function matchFaq(rawText) {
  const text = rawText.toLowerCase().trim();
  if (!text) return null;

  if (GREETING_KEYWORDS.some((k) => text === k || text.startsWith(`${k} `) || text.startsWith(`${k},`))) {
    return {
      id: 'greeting',
      answer:
        "Hey! I can help with resume tips, ATS scoring, job matching, cover letters, and interview prep. Tap one of the quick questions below, or just ask me anything.",
    };
  }

  let best = null;
  let bestScore = 0;
  for (const entry of CHAT_FAQ) {
    const score = entry.keywords.reduce((acc, kw) => (text.includes(kw) ? acc + 1 : acc), 0);
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }
  return best;
}

export function faqById(id) {
  return CHAT_FAQ.find((f) => f.id === id) || null;
}
