'use client';

import { useState, type FormEvent } from 'react';
import { BriefcaseBusiness, GripVertical, Plus, Trash2, X } from 'lucide-react';
import { useCareerStore } from '../lib/store';
import type { ApplicationStatus } from '../types';

const columns: { status: ApplicationStatus; title: string; color: string }[] = [
  { status: 'WISHLIST', title: 'Saved', color: 'text-neutral-400' },
  { status: 'APPLIED', title: 'Applied', color: 'text-neutral-300' },
  { status: 'SCREENING', title: 'Screening', color: 'text-blue-400' },
  { status: 'TECHNICAL_INTERVIEW', title: 'Interview', color: 'text-purple-400' },
  { status: 'OFFER', title: 'Offer', color: 'text-emerald-400' },
  { status: 'REJECTED', title: 'Closed', color: 'text-neutral-500' },
];

const nextStatus: Record<ApplicationStatus, ApplicationStatus> = {
  WISHLIST: 'APPLIED',
  APPLIED: 'SCREENING',
  SCREENING: 'TECHNICAL_INTERVIEW',
  TECHNICAL_INTERVIEW: 'OFFER',
  OFFER: 'APPLIED',
  REJECTED: 'APPLIED',
};

export const JobKanban = () => {
  const { applications, addApplication, removeApplication, moveApplication } = useCareerStore();
  const [modalStatus, setModalStatus] = useState<ApplicationStatus | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [positionTitle, setPositionTitle] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [appliedDate, setAppliedDate] = useState(new Date().toISOString().slice(0, 10));

  const openAdd = (status: ApplicationStatus) => {
    setModalStatus(status);
    setCompanyName('');
    setPositionTitle('');
    setSalaryRange('');
    setAppliedDate(new Date().toISOString().slice(0, 10));
  };

  const saveApplication = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!modalStatus || !companyName.trim() || !positionTitle.trim()) return;
    addApplication({
      companyName: companyName.trim(),
      positionTitle: positionTitle.trim(),
      ...(salaryRange.trim() ? { salaryRange: salaryRange.trim() } : {}),
      status: modalStatus,
      appliedDate: new Date(`${appliedDate}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    });
    setModalStatus(null);
  };

  return (
    <section className="space-y-4" aria-label="Job application tracker">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[.15em] text-emerald-400">Your search, in one view</p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-white">Application pipeline</h2>
          <p className="mt-1 text-xs text-neutral-400">Add real opportunities as you apply, then move them through each stage.</p>
        </div>
        <button type="button" onClick={() => openAdd('WISHLIST')} className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-emerald-400 px-3.5 text-xs font-semibold text-neutral-950 transition hover:bg-emerald-300"><Plus size={15}/> Add opportunity</button>
      </header>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {columns.map((column) => {
          const apps = applications.filter((application) => application.status === column.status);
          return (
            <section
              key={column.status}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                if (draggedId) moveApplication(draggedId, column.status);
                setDraggedId(null);
              }}
              className="flex min-h-64 flex-col rounded-xl border border-white/10 bg-white/[.025] p-3 transition-colors hover:border-emerald-400/20"
              aria-label={`${column.title} applications`}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${column.color}`}>{column.title} <span className="ml-1 text-neutral-500">{apps.length}</span></span>
                <button type="button" onClick={() => openAdd(column.status)} title={`Add to ${column.title}`} aria-label={`Add application to ${column.title}`} className="rounded-md p-1 text-neutral-500 transition hover:bg-white/10 hover:text-white"><Plus size={14}/></button>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                {apps.map((application) => (
                  <article
                    key={application.id}
                    draggable
                    onDragStart={() => setDraggedId(application.id)}
                    onDragEnd={() => setDraggedId(null)}
                    className={`rounded-lg border border-white/[.07] bg-neutral-900 p-3 transition hover:border-emerald-400/30 ${draggedId === application.id ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical size={14} className="mt-0.5 shrink-0 cursor-grab text-neutral-600" aria-hidden="true"/>
                      <div className="min-w-0 flex-1">
                        <h3 className="break-words text-[11px] font-semibold leading-4 text-neutral-100">{application.positionTitle}</h3>
                        <p className="mt-1 break-words text-[10px] text-neutral-400">{application.companyName}</p>
                      </div>
                      <button type="button" onClick={() => removeApplication(application.id)} aria-label={`Remove ${application.positionTitle} at ${application.companyName}`} className="shrink-0 rounded p-1 text-neutral-600 transition hover:bg-red-400/10 hover:text-red-300"><Trash2 size={12}/></button>
                    </div>
                    <div className="ml-5 mt-3 flex items-center justify-between gap-2 border-t border-white/[.06] pt-2">
                      <span className="text-[9px] text-neutral-500">{application.appliedDate}{application.salaryRange ? ` · ${application.salaryRange}` : ''}</span>
                      {typeof application.matchScore === 'number' && application.matchScore > 0 && <span className="rounded bg-emerald-400/10 px-1.5 py-0.5 text-[9px] font-medium text-emerald-300">{application.matchScore}%</span>}
                    </div>
                    {column.status !== 'OFFER' && column.status !== 'REJECTED' && <button type="button" onClick={() => moveApplication(application.id, nextStatus[column.status])} className="ml-5 mt-2 text-[9px] font-medium text-emerald-300/80 hover:text-emerald-200">Move to {columns.find((item) => item.status === nextStatus[column.status])?.title} →</button>}
                  </article>
                ))}
                {!apps.length && <button type="button" onClick={() => openAdd(column.status)} className="flex min-h-20 flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/[.08] px-3 text-center text-[9px] text-neutral-600 transition hover:border-emerald-400/25 hover:text-neutral-400"><BriefcaseBusiness size={15}/><span>Drop an opportunity or add one</span></button>}
              </div>
            </section>
          );
        })}
      </div>

      {modalStatus && <div className="fixed inset-0 z-[80] grid place-items-center bg-black/65 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalStatus(null); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="add-opportunity-title" className="w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900 p-5 shadow-2xl">
          <header className="mb-5 flex items-start justify-between gap-3"><div><p className="text-[9px] font-semibold uppercase tracking-[.14em] text-emerald-400">{columns.find((column) => column.status === modalStatus)?.title} stage</p><h2 id="add-opportunity-title" className="mt-1 text-base font-semibold text-white">Add an opportunity</h2></div><button type="button" onClick={() => setModalStatus(null)} aria-label="Close dialog" className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white"><X size={16}/></button></header>
          <form onSubmit={saveApplication} className="space-y-3">
            <label className="block space-y-1.5 text-[10px] font-medium text-neutral-300">Company<input autoFocus required maxLength={100} value={companyName} onChange={(event) => setCompanyName(event.target.value)} placeholder="Company name" className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2.5 text-xs text-white outline-none focus:border-emerald-400/50"/></label>
            <label className="block space-y-1.5 text-[10px] font-medium text-neutral-300">Role title<input required maxLength={120} value={positionTitle} onChange={(event) => setPositionTitle(event.target.value)} placeholder="e.g. Product Designer" className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2.5 text-xs text-white outline-none focus:border-emerald-400/50"/></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block space-y-1.5 text-[10px] font-medium text-neutral-300">Date added<input type="date" value={appliedDate} onChange={(event) => setAppliedDate(event.target.value)} className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2.5 text-xs text-white outline-none focus:border-emerald-400/50"/></label>
              <label className="block space-y-1.5 text-[10px] font-medium text-neutral-300">Salary (optional)<input maxLength={60} value={salaryRange} onChange={(event) => setSalaryRange(event.target.value)} placeholder="e.g. $80k–$100k" className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2.5 text-xs text-white outline-none focus:border-emerald-400/50"/></label>
            </div>
            <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setModalStatus(null)} className="rounded-lg border border-white/10 px-3 py-2 text-[10px] font-medium text-neutral-300 hover:bg-white/5">Cancel</button><button type="submit" className="rounded-lg bg-emerald-400 px-3.5 py-2 text-[10px] font-semibold text-neutral-950 hover:bg-emerald-300">Save opportunity</button></div>
          </form>
        </section>
      </div>}
    </section>
  );
};
