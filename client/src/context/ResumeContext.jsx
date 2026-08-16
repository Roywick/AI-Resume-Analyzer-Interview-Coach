import { createContext, useContext, useMemo, useState, useCallback } from 'react';

const ResumeContext = createContext(null);

/**
 * Holds the entire user session in memory only. Nothing here is written
 * to localStorage, cookies, or a backend database — refreshing the page
 * clears it, by design (see project requirement: no persisted user data).
 */
export function ResumeProvider({ children }) {
  const [resumeFile, setResumeFile] = useState(null); // { name, size, type }
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState('');

  const [analysis, setAnalysis] = useState(null); // ATS score, strengths, weaknesses...
  const [jobMatch, setJobMatch] = useState(null); // match %, missing skills/keywords
  const [improvement, setImprovement] = useState(null); // rewritten summary, action verbs
  const [interviewQuestions, setInterviewQuestions] = useState(null); // { hr, technical, behavioral, projectBased }
  const [coverLetter, setCoverLetter] = useState(null);

  const [status, setStatus] = useState('idle'); // idle | uploading | parsing | analyzing | ready | error
  const [errorMessage, setErrorMessage] = useState('');

  const hasResume = Boolean(resumeText);

  const resetSession = useCallback(() => {
    setResumeFile(null);
    setResumeText('');
    setJobDescription('');
    setTargetRole('');
    setAnalysis(null);
    setJobMatch(null);
    setImprovement(null);
    setInterviewQuestions(null);
    setCoverLetter(null);
    setStatus('idle');
    setErrorMessage('');
  }, []);

  const value = useMemo(
    () => ({
      resumeFile, setResumeFile,
      resumeText, setResumeText,
      jobDescription, setJobDescription,
      targetRole, setTargetRole,
      analysis, setAnalysis,
      jobMatch, setJobMatch,
      improvement, setImprovement,
      interviewQuestions, setInterviewQuestions,
      coverLetter, setCoverLetter,
      status, setStatus,
      errorMessage, setErrorMessage,
      hasResume,
      resetSession,
    }),
    [resumeFile, resumeText, jobDescription, targetRole, analysis, jobMatch,
      improvement, interviewQuestions, coverLetter, status, errorMessage, hasResume, resetSession]
  );

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
}

export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error('useResume must be used within ResumeProvider');
  return ctx;
}
