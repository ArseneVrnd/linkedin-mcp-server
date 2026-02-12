import { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, Copy, Check, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

function generateCoverLetterPdf(content, company) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const marginL = 20;
  const marginR = 20;
  const maxW = pageW - marginL - marginR;
  let y = 25;

  const paragraphs = content.split('\n');

  for (const line of paragraphs) {
    const trimmed = line.trim();

    if (!trimmed) {
      y += 4;
      continue;
    }

    // Detect "Objet :" or "Object:" line
    if (/^objet\s*:/i.test(trimmed)) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(40, 40, 40);
      const wrapped = doc.splitTextToSize(trimmed, maxW);
      doc.text(wrapped, marginL, y);
      y += wrapped.length * 5 + 2;
      continue;
    }

    // Detect greeting/closing lines ("Madame, Monsieur," / "Cordialement,")
    if (/^(madame|monsieur|cordialement|sinc[eè]rement|respectueusement|bien [àa] vous)/i.test(trimmed)) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);
      doc.text(trimmed, marginL, y);
      y += 6;
      continue;
    }

    // Detect sender name (short line, likely at end, starts with capital)
    if (trimmed.length < 40 && /^[A-Z]/.test(trimmed) && !trimmed.includes('.') && paragraphs.indexOf(line) > paragraphs.length - 5) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);
      doc.text(trimmed, marginL, y);
      y += 5;
      continue;
    }

    // Detect location/date line ("Grenoble, le ...")
    if (/^[A-Z][a-zéèê]+,\s*(le\s*)?\d/.test(trimmed)) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(trimmed, pageW - marginR, y, { align: 'right' });
      y += 6;
      continue;
    }

    // Regular paragraph text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    const wrapped = doc.splitTextToSize(trimmed, maxW);
    doc.text(wrapped, marginL, y);
    y += wrapped.length * 5;

    if (y > 275) {
      doc.addPage();
      y = 20;
    }
  }

  const safeName = (company || 'Lettre').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Lettre_Motivation_${safeName}.pdf`);
}

export default function CoverLetterViewer({ letter, company, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(letter.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = (e) => {
    e.stopPropagation();
    generateCoverLetterPdf(letter.content, company);
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
      <div
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          <span className="text-sm font-medium">
            Cover Letter - {format(new Date(letter.generated_at), 'MMM d, yyyy h:mm a')}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handleDownloadPdf} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Telecharger en PDF">
            <Download size={14} className="text-primary-600" />
          </button>
          <button onClick={e => { e.stopPropagation(); handleCopy(); }} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          </button>
          <button onClick={e => { e.stopPropagation(); onDelete(); }} className="p-1 text-red-400 hover:text-red-600 rounded">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {expanded && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-sm whitespace-pre-wrap">
          {letter.content}
        </div>
      )}
    </div>
  );
}
