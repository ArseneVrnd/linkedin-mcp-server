import { useState } from 'react';
import { ExternalLink, Trash2, Edit3, FileText, ChevronDown, ChevronUp, Copy, Check, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import StatusBadge, { STATUS_OPTIONS } from './StatusBadge';
import TagInput from '../ui/TagInput';
import CoverLetterGenerator from '../cover-letter/CoverLetterGenerator';
import CoverLetterViewer from '../cover-letter/CoverLetterViewer';
import { api } from '../../lib/api';
import { format } from 'date-fns';

function generateCvPdf(content, company) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const marginL = 15;
  const marginR = 15;
  const maxW = pageW - marginL - marginR;
  let y = 18;

  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    // Section divider "---"
    if (trimmed === '---') {
      doc.setDrawColor(180, 180, 180);
      doc.line(marginL, y, pageW - marginR, y);
      y += 4;
      continue;
    }

    // Name line (first non-empty line, all caps or contains the name pattern)
    if (y <= 20 && trimmed && /^[A-Z\s]+$/.test(trimmed.split('|')[0].trim())) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(30, 30, 30);
      doc.text(trimmed, pageW / 2, y, { align: 'center' });
      y += 7;
      continue;
    }

    // Subtitle line (second line with pipe separators like "Business Analyst | ...")
    if (y <= 26 && trimmed.includes('|') && !trimmed.includes('@')) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text(trimmed, pageW / 2, y, { align: 'center' });
      y += 5;
      continue;
    }

    // Contact line (contains @ or phone)
    if (trimmed.includes('@') && trimmed.includes('|')) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(trimmed, pageW / 2, y, { align: 'center' });
      y += 6;
      continue;
    }

    // Section headers (all caps, no bullet, e.g. "COMPETENCES CLES", "EXPERIENCES PROFESSIONNELLES")
    if (trimmed && /^[A-Z\s&é']+$/.test(trimmed) && trimmed.length > 3) {
      y += 3;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(30, 80, 60);
      doc.text(trimmed, marginL, y);
      y += 5;
      continue;
    }

    // Sub-headers (job titles like "BUSINESS ANALYST | HP ...")
    if (trimmed && /^[A-Z]/.test(trimmed) && trimmed.includes('|') && !trimmed.includes('@')) {
      y += 2;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(40, 40, 40);
      const wrapped = doc.splitTextToSize(trimmed, maxW);
      doc.text(wrapped, marginL, y);
      y += wrapped.length * 4.5;
      continue;
    }

    // Bullet points
    if (trimmed.startsWith('- ')) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(50, 50, 50);
      const bulletText = trimmed.substring(2);
      const wrapped = doc.splitTextToSize(bulletText, maxW - 5);
      doc.text('•', marginL, y);
      doc.text(wrapped, marginL + 4, y);
      y += wrapped.length * 4;
      continue;
    }

    // Empty line
    if (!trimmed) {
      y += 2;
      continue;
    }

    // Default text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    const wrapped = doc.splitTextToSize(trimmed, maxW);
    doc.text(wrapped, marginL, y);
    y += wrapped.length * 4;

    // Page break if needed
    if (y > 280) {
      doc.addPage();
      y = 15;
    }
  }

  const safeName = (company || 'CV').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`CV_Arsene_Vuarand_${safeName}.pdf`);
}

function AdaptedCvViewer({ cv, company, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(cv.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = (e) => {
    e.stopPropagation();
    generateCvPdf(cv.content, company);
  };

  return (
    <div className="border border-emerald-200 dark:border-emerald-800 rounded-lg">
      <div
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          <FileText size={14} className="text-emerald-600" />
          <span className="text-sm font-medium">
            CV Adapte - {format(new Date(cv.created_at), 'MMM d, yyyy h:mm a')}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handleDownloadPdf} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Telecharger en PDF">
            <Download size={14} className="text-emerald-600" />
          </button>
          <button onClick={handleCopy} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          </button>
          <button onClick={e => { e.stopPropagation(); onDelete(); }} className="p-1 text-red-400 hover:text-red-600 rounded">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {expanded && (
        <div className="p-3 border-t border-emerald-200 dark:border-emerald-800 text-sm whitespace-pre-wrap font-mono bg-emerald-50/50 dark:bg-emerald-900/10">
          {cv.content}
        </div>
      )}
    </div>
  );
}

export default function JobDetail({ job, allTags, onUpdate, onDelete }) {
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(job.notes || '');
  const [coverLetters, setCoverLetters] = useState(job.cover_letters || []);
  const [adaptedCvs, setAdaptedCvs] = useState(job.adapted_cvs || []);

  const handleStatusChange = async (newStatus) => {
    await api.updateJob(job.id, { status: newStatus });
    onUpdate();
  };

  const handleNotesSave = async () => {
    await api.updateJob(job.id, { notes });
    setEditingNotes(false);
    onUpdate();
  };

  const handleAddTag = async (tagId) => {
    await api.addJobTag(job.id, tagId);
    onUpdate();
  };

  const handleRemoveTag = async (tagId) => {
    await api.removeJobTag(job.id, tagId);
    onUpdate();
  };

  const handleCreateTag = async (name) => {
    const tag = await api.createTag({ name });
    await api.addJobTag(job.id, tag.id);
    onUpdate();
  };

  const handleCoverLetterGenerated = (letter) => {
    setCoverLetters(prev => [letter, ...prev]);
  };

  const handleDeleteCoverLetter = async (id) => {
    await api.deleteCoverLetter(id);
    setCoverLetters(prev => prev.filter(cl => cl.id !== id));
  };

  const handleDeleteAdaptedCv = async (id) => {
    await api.deleteAdaptedCv(id);
    setAdaptedCvs(prev => prev.filter(cv => cv.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{job.title}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">{job.company}</p>
          {job.location && <p className="text-sm text-gray-500">{job.location}</p>}
          {job.salary && <p className="text-sm text-green-600 dark:text-green-400 font-medium">{job.salary}</p>}
        </div>
        <div className="flex items-center gap-2">
          {job.apply_url && (
            <a href={job.apply_url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <ExternalLink size={18} />
            </a>
          )}
          <button onClick={onDelete} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Status:</label>
        <select
          value={job.status}
          onChange={e => handleStatusChange(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
        >
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <StatusBadge status={job.status} />
      </div>

      <div>
        <label className="text-sm font-medium block mb-2">Tags</label>
        <TagInput
          tags={job.tags || []}
          allTags={allTags}
          onAdd={handleAddTag}
          onRemove={handleRemoveTag}
          onCreateTag={handleCreateTag}
        />
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div><span className="text-gray-500">Added:</span> {format(new Date(job.date_added), 'MMM d, yyyy')}</div>
        {job.date_applied && <div><span className="text-gray-500">Applied:</span> {format(new Date(job.date_applied), 'MMM d, yyyy')}</div>}
        <div><span className="text-gray-500">Updated:</span> {format(new Date(job.updated_at), 'MMM d, yyyy')}</div>
      </div>

      {job.description && (
        <div>
          <h3 className="text-sm font-medium mb-2">Description</h3>
          <div className="prose dark:prose-invert max-w-none text-sm bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 whitespace-pre-wrap">
            {job.description}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Notes</h3>
          <button onClick={() => setEditingNotes(!editingNotes)} className="text-xs text-primary-600 hover:text-primary-700">
            <Edit3 size={14} />
          </button>
        </div>
        {editingNotes ? (
          <div className="space-y-2">
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
            />
            <div className="flex gap-2">
              <button onClick={handleNotesSave} className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">Save</button>
              <button onClick={() => { setEditingNotes(false); setNotes(job.notes || ''); }} className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
            {job.notes || 'No notes yet.'}
          </p>
        )}
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
          <FileText size={16} className="text-emerald-600" />
          CV Adapte ATS
        </h3>
        {adaptedCvs.length === 0 ? (
          <p className="text-xs text-gray-400">Aucun CV adapte. Demandez a Claude Code d'en generer un.</p>
        ) : (
          <div className="space-y-3">
            {adaptedCvs.map(cv => (
              <AdaptedCvViewer key={cv.id} cv={cv} company={job.company} onDelete={() => handleDeleteAdaptedCv(cv.id)} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Cover Letters</h3>
        <CoverLetterGenerator jobId={job.id} onGenerated={handleCoverLetterGenerated} />
        <div className="mt-4 space-y-3">
          {coverLetters.map(cl => (
            <CoverLetterViewer key={cl.id} letter={cl} company={job.company} onDelete={() => handleDeleteCoverLetter(cl.id)} />
          ))}
        </div>
      </div>

      {job.interviews && job.interviews.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">Interviews</h3>
          <div className="space-y-2">
            {job.interviews.map(iv => (
              <div key={iv.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-sm">
                <span className="font-medium">{format(new Date(iv.interview_date), 'MMM d, yyyy')}</span>
                {iv.interview_time && <span className="text-gray-500">{iv.interview_time}</span>}
                <span className="px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs">{iv.type}</span>
                {iv.location && <span className="text-gray-500">{iv.location}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
