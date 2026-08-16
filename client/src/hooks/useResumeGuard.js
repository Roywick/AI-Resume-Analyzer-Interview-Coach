import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext.jsx';

/** Redirects to /upload if the current session has no resume text yet. */
export function useResumeGuard() {
  const { hasResume } = useResume();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasResume) navigate('/upload', { replace: true });
  }, [hasResume, navigate]);

  return hasResume;
}
