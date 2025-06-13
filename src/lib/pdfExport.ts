import { jsPDF } from 'jspdf';

export const exportToPDF = (content: string, filename: string = 'response.pdf') => {
  const doc = new jsPDF();
  
  // Configure font and styling
  doc.setFont('helvetica');
  doc.setFontSize(12);
  
  // Add title
  doc.setFontSize(16);
  doc.text('Code Explanation', 20, 20);
  doc.setFontSize(12);
  
  // Add timestamp
  const date = new Date().toLocaleString();
  doc.text(`Generated on: ${date}`, 20, 30);
  
  // Add content
  const splitText = doc.splitTextToSize(content, 170);
  let y = 40;
  
  splitText.forEach((line: string) => {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, 20, y);
    y += 7;
  });
  
  // Save the PDF
  doc.save(filename);
};