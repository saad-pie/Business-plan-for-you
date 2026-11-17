import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { GLOSSARY_ITEMS, type GlossaryItem } from '../data/handoffData';

interface GlossaryDrawerProps {
  open: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export function GlossaryDrawer({ open, onClose, initialQuery = '' }: GlossaryDrawerProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<'All' | GlossaryItem['category']>('All');

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const filtered = GLOSSARY_ITEMS.filter((item) => {
    const matchesCat = category === 'All' || item.category === category;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      item.term.toLowerCase().includes(q) ||
      item.definition.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-neutral-950/40 backdrop-blur-[2px] no-print"
      role="dialog"
      aria-modal="true"
      aria-label="Quick Glossary Lookup"
      onClick={onClose}
    >
      <div
        className="relative flex h-full w-full max-w-lg flex-col bg-white border-l border-neutral-200 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 border-b border-neutral-200 px-6 py-4">
          <div>
            <h2 className="font-serif text-lg font-medium text-neutral-900">Quick Glossary</h2>
            <p className="text-xs text-neutral-500">
              {GLOSSARY_ITEMS.length} plain-English definitions · Press Esc to close
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close glossary"
            className="flex h-10 w-10 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors focus-visible:outline-2 focus-visible:outline-emerald-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 border-b border-neutral-200 bg-neutral-50 px-6 py-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search term (e.g., W-8BEN, PSEB, Postback, RPS)..."
              autoFocus
              className="w-full rounded-md border border-neutral-300 bg-white py-2.5 pl-9 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-emerald-900 focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap items-center gap-1 rounded-md bg-neutral-200/70 p-1">
            {(['All', 'Technical', 'Affiliate', 'Finance & Legal'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                  category === cat
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-neutral-500">
              No glossary terms match "{query}".
            </p>
          ) : (
            <dl className="divide-y divide-neutral-200">
              {filtered.map((item) => (
                <div key={item.term} className="py-4 first:pt-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="font-mono text-sm font-medium text-neutral-900">
                      {item.term}
                    </dt>
                    <span className="text-xs text-neutral-500 whitespace-nowrap shrink-0">
                      {item.category}
                    </span>
                  </div>
                  <dd className="mt-1.5 text-sm leading-relaxed text-neutral-600">
                    {item.definition}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}
