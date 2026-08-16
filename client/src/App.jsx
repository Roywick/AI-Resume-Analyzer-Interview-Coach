import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import StatusBanner from './components/layout/StatusBanner.jsx';
import RouteProgressBar from './components/layout/RouteProgressBar.jsx';
import ScrollToTop from './components/layout/ScrollToTop.jsx';
import ChatWidget from './components/chat/ChatWidget.jsx';
import Home from './pages/Home.jsx';
import Upload from './pages/Upload.jsx';
import Analysis from './pages/Analysis.jsx';
import ATSReport from './pages/ATSReport.jsx';
import JobMatch from './pages/JobMatch.jsx';
import Improve from './pages/Improve.jsx';
import InterviewCoach from './pages/InterviewCoach.jsx';
import CoverLetter from './pages/CoverLetter.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';

const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25, ease: 'easeOut' },
};

function AnimatedPage({ children }) {
  return <motion.div {...pageTransition}>{children}</motion.div>;
}

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <RouteProgressBar />
      <StatusBanner />
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
            <Route path="/upload" element={<AnimatedPage><Upload /></AnimatedPage>} />
            <Route path="/analysis" element={<AnimatedPage><Analysis /></AnimatedPage>} />
            <Route path="/ats-report" element={<AnimatedPage><ATSReport /></AnimatedPage>} />
            <Route path="/job-match" element={<AnimatedPage><JobMatch /></AnimatedPage>} />
            <Route path="/improve" element={<AnimatedPage><Improve /></AnimatedPage>} />
            <Route path="/interview-coach" element={<AnimatedPage><InterviewCoach /></AnimatedPage>} />
            <Route path="/cover-letter" element={<AnimatedPage><CoverLetter /></AnimatedPage>} />
            <Route path="/about" element={<AnimatedPage><About /></AnimatedPage>} />
            <Route path="/contact" element={<AnimatedPage><Contact /></AnimatedPage>} />
            <Route path="*" element={<AnimatedPage><NotFound /></AnimatedPage>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <ScrollToTop />
      <ChatWidget />
    </div>
  );
}
