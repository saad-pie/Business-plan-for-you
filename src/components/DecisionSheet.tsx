import { useState } from 'react';
import { Check, Copy, RotateCcw } from 'lucide-react';
import { DECISION_QUESTIONS } from '../data/handoffData';

export interface DecisionAnswer {
  choice: string;
  note: string;
}

export type DecisionState = Record<string, DecisionAnswer>;

interface DecisionSheetProps {
  answers: DecisionState;
  onUpdate: (id: string, next: Partial<DecisionAnswer>) => void;
  onReset: () => void;
}

export function DecisionSheet({ answers, onUpdate, onReset }: DecisionSheetProps) {
  const [copied, setCopied] = useState(false);

  const answeredCount = DECISION_QUESTIONS.filter(
    (q) => answers[q.id]?.choice || answers[q.id]?.note?.trim()
  ).length;

  const buildInstagramReply = () => {
    const lines = [
      'Affiliate Storefront — My Decisions (v2.0 Handoff):',
      '',
    ];
    DECISION_QUESTIONS.forEach((q) => {
      const ans = answers[q.id];
      const choiceText = ans?.choice || 'Not decided yet';
      const noteText = ans?.note?.trim() ? ` — Note: ${ans.note.trim()}` : '';
      lines.push(`${q.number}. ${q.topic}: ${choiceText}${noteText}`);
    });
    return lines.join('\n');
  };

  const handleCopy = async () => {
    const text = buildInstagramReply();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-neutral-200 pb-5">
        <div>
          <p className="text-xs font-medium text-neutral-500">
            Interactive Partner Sign-Off · Saved automatically on your device
          </p>
          <p className="mt-1 text-sm text-neutral-600">
            Pick your answers below, add any pushback or notes, then copy the compact summary to paste straight back into Instagram DM.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono tabular-nums text-neutral-600 shrink-0">
          <span>
            {answeredCount} / {DECISION_QUESTIONS.length} answered
          </span>
          {answeredCount > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {DECISION_QUESTIONS.map((q) => {
          const current = answers[q.id] || { choice: '', note: '' };
          return (
            <div
              key={q.id}
              id={`decision-${q.id}`}
              className="rounded-lg border border-neutral-200 bg-neutral-50/60 p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-serif text-lg font-medium text-neutral-900">
                  {q.number}. {q.topic}
                </h3>
                <span className="text-xs text-neutral-500 font-mono">
                  Ref: {q.sectionRef}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700 max-w-2xl">
                {q.prompt}
              </p>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {q.options.map((option) => {
                  const selected = current.choice === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => onUpdate(q.id, { choice: selected ? '' : option })}
                      className={`flex items-center justify-between gap-3 rounded-md border px-4 py-3 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-emerald-900 ${
                        selected
                          ? 'border-emerald-900 bg-emerald-950 text-white font-medium'
                          : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400'
                      }`}
                    >
                      <span>{option}</span>
                      {selected && <Check className="h-4 w-4 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3">
                <label htmlFor={`note-${q.id}`} className="sr-only">
                  Optional note for {q.topic}
                </label>
                <input
                  id={`note-${q.id}`}
                  type="text"
                  value={current.note}
                  onChange={(e) => onUpdate(q.id, { note: e.target.value })}
                  placeholder="Optional: add your own note, counter-proposal, or question..."
                  className="w-full rounded-md border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-emerald-900 focus:outline-none"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border border-neutral-300 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-serif text-base font-medium text-neutral-900">
              Ready to reply on Instagram?
            </h3>
            <p className="mt-1 text-xs text-neutral-600">
              Copies a clean, short message with all 6 decisions so you can paste it directly into our DM.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-900 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-900"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied for Instagram DM
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Reply for Instagram
              </>
            )}
          </button>
        </div>

        <pre className="mt-4 overflow-x-auto rounded-md border border-neutral-200 bg-neutral-50 p-4 font-mono text-xs leading-relaxed text-neutral-700 whitespace-pre-wrap">
          {buildInstagramReply()}
        </pre>
      </div>
    </div>
  );
}
