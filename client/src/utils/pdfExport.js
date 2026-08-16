import { jsPDF } from 'jspdf';

const MARGIN = 48;
const LINE_HEIGHT = 16;

function addWrappedText(doc, text, x, y, maxWidth) {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * LINE_HEIGHT;
}

function addSectionTitle(doc, title, y, pageWidth) {
  if (y > 740) {
    doc.addPage();
    y = MARGIN;
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 20, 32);
  y = addWrappedText(doc, title, MARGIN, y, pageWidth);
  doc.setDrawColor(226, 232, 240);
  doc.line(MARGIN, y - 10, pageWidth + MARGIN, y - 10);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(40, 46, 60);
  return y + 6;
}

/**
 * Builds a single downloadable PDF report from whatever session data is
 * available (analysis, job match, improvement, interview Qs, cover letter).
 * Only sections with data are included.
 */
export function exportSessionReport({ analysis, jobMatch, improvement, interviewQuestions, coverLetter, fileName = 'resume' }) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth() - MARGIN * 2;
  let y = MARGIN;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(15, 20, 32);
  doc.text('ResumeIQ AI — Analysis Report', MARGIN, y);
  y += 26;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(110, 118, 132);
  doc.text(`Source file: ${fileName} · Generated ${new Date().toLocaleString()}`, MARGIN, y);
  y += 24;

  if (analysis) {
    y = addSectionTitle(doc, `ATS Score: ${analysis.atsScore ?? '—'}/100`, y, pageWidth);
    if (analysis.strengths?.length) {
      y = addWrappedText(doc, `Strengths: ${analysis.strengths.join('; ')}`, MARGIN, y, pageWidth) + 4;
    }
    if (analysis.weaknesses?.length) {
      y = addWrappedText(doc, `Weaknesses: ${analysis.weaknesses.join('; ')}`, MARGIN, y, pageWidth) + 4;
    }
    if (analysis.formattingFeedback) {
      y = addWrappedText(doc, `Formatting feedback: ${analysis.formattingFeedback}`, MARGIN, y, pageWidth) + 10;
    }
  }

  if (jobMatch) {
    y = addSectionTitle(doc, `Job Match: ${jobMatch.matchPercentage ?? '—'}%`, y, pageWidth);
    if (jobMatch.missingKeywords?.length) {
      y = addWrappedText(doc, `Missing keywords: ${jobMatch.missingKeywords.join(', ')}`, MARGIN, y, pageWidth) + 4;
    }
    if (jobMatch.missingSkills?.length) {
      y = addWrappedText(doc, `Missing skills: ${jobMatch.missingSkills.join(', ')}`, MARGIN, y, pageWidth) + 10;
    }
  }

  if (improvement?.rewrittenSummary) {
    y = addSectionTitle(doc, 'AI-Rewritten Summary', y, pageWidth);
    y = addWrappedText(doc, improvement.rewrittenSummary, MARGIN, y, pageWidth) + 10;
  }

  if (interviewQuestions) {
    y = addSectionTitle(doc, 'Interview Questions', y, pageWidth);
    const categories = ['hr', 'technical', 'behavioral', 'projectBased'];
    categories.forEach((cat) => {
      const list = interviewQuestions[cat];
      if (!list?.length) return;
      list.slice(0, 5).forEach((q, i) => {
        if (y > 760) { doc.addPage(); y = MARGIN; }
        y = addWrappedText(doc, `• ${q.question}`, MARGIN, y, pageWidth) + 2;
      });
      y += 6;
    });
  }

  if (coverLetter?.body) {
    y = addSectionTitle(doc, 'Cover Letter', y, pageWidth);
    y = addWrappedText(doc, coverLetter.body, MARGIN, y, pageWidth);
  }

  doc.save('ResumeIQ-AI-Report.pdf');
}
