import { jsPDF } from "jspdf";

export const generatePDF = (resume) => {
  const doc = new jsPDF();

  let y = 20;

  doc.setFontSize(22);
  doc.text("ResumeIQ AI Analysis Report", 20, y);

  y += 15;

  doc.setFontSize(16);
  doc.text(`Resume: ${resume.title}`, 20, y);

  y += 12;

  doc.text(`ATS Score: ${resume.score}%`, 20, y);

  y += 18;

  doc.setFontSize(18);
  doc.text("Summary", 20, y);

  y += 10;

  doc.setFontSize(12);
  const summary = doc.splitTextToSize(
    resume.summary || "No summary available",
    170
  );

  doc.text(summary, 20, y);

  y += summary.length * 7 + 10;

  const addSection = (title, data) => {
    doc.setFontSize(16);
    doc.text(title, 20, y);

    y += 10;

    doc.setFontSize(12);

    if (data.length === 0) {
      doc.text("- None", 25, y);
      y += 8;
      return;
    }

    data.forEach((item) => {
      const lines = doc.splitTextToSize(`• ${item}`, 165);
      doc.text(lines, 25, y);
      y += lines.length * 7;
    });

    y += 6;
  };

  addSection("Strengths", resume.strengths || []);
  addSection("Weaknesses", resume.weaknesses || []);
  addSection("Missing Skills", resume.missingSkills || []);
  addSection("AI Suggestions", resume.suggestions || []);

  doc.save(`${resume.title}-AI-Report.pdf`);
};