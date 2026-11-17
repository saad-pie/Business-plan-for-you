import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  List,
  Printer,
  Search,
  Share2,
} from 'lucide-react';
import {
  AFFILIATE_AGGREGATORS,
  AFFILIATE_PROVIDERS,
  CHAPTERS,
  COVERAGE_MATRIX,
  DECISION_QUESTIONS,
  FINAL_STACK,
  GLOSSARY_ITEMS,
  HARD_CONSTRAINTS,
  NEXT_STEPS,
  PAYOUT_THRESHOLDS,
  PRODUCT_PROVIDERS,
  SCORECARD_ROWS,
  type CoverageRow,
  type GlossaryItem,
  type ProductProviderRow,
  type ScorecardRow,
} from './data/handoffData';
import { GlossaryDrawer } from './components/GlossaryDrawer';
import {
  DecisionSheet,
  type DecisionAnswer,
  type DecisionState,
} from './components/DecisionSheet';

const STORAGE_KEY_DECISIONS = 'handoff_partner_decisions_v2';
const STORAGE_KEY_STEPS = 'handoff_next_steps_v2';

function loadDecisions(): DecisionState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DECISIONS);
    return raw ? (JSON.parse(raw) as DecisionState) : {};
  } catch {
    return {};
  }
}

function loadCompletedSteps(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STEPS);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}

interface SectionHeaderProps {
  number: string;
  title: string;
  subtitle?: string;
}

function SectionHeader({ number, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="border-b border-neutral-200 pb-5 mb-7">
      <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
        Section {number}
      </p>
      <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-medium tracking-tight text-neutral-900">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-sm text-neutral-600 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

interface OutcomeNoteProps {
  kind: 'PROFIT' | 'LOSE' | 'VERDICT';
  label: string;
  children: React.ReactNode;
}

function OutcomeNote({ kind, label, children }: OutcomeNoteProps) {
  const tone =
    kind === 'PROFIT'
      ? 'bg-emerald-950/[0.03] border-emerald-900/20'
      : kind === 'LOSE'
        ? 'bg-amber-950/[0.03] border-amber-900/20'
        : 'bg-neutral-50 border-neutral-200';

  const labelTone =
    kind === 'PROFIT'
      ? 'text-emerald-900'
      : kind === 'LOSE'
        ? 'text-amber-900'
        : 'text-neutral-900';

  return (
    <div className={`rounded-md border p-4 sm:p-5 ${tone}`}>
      <p className={`font-mono text-xs font-medium uppercase tracking-wider ${labelTone}`}>
        {label}
      </p>
      <div className="mt-1.5 text-sm leading-relaxed text-neutral-700">{children}</div>
    </div>
  );
}

interface InputNeededCalloutProps {
  questionId: string;
  prompt: string;
  answeredChoice?: string;
}

function InputNeededCallout({ questionId, prompt, answeredChoice }: InputNeededCalloutProps) {
  return (
    <div className="mt-6 rounded-md border border-neutral-300 bg-neutral-50 p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-wider text-emerald-900">
            Input Needed From You
          </p>
          <p className="mt-1 text-sm leading-relaxed text-neutral-800 max-w-2xl">{prompt}</p>
          {answeredChoice && (
            <p className="mt-2 text-xs font-medium text-emerald-900">
              Your selection: {answeredChoice}
            </p>
          )}
        </div>
        <a
          href={`#decision-${questionId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-950 hover:text-emerald-800 underline underline-offset-4 whitespace-nowrap shrink-0"
        >
          {answeredChoice ? 'Edit answer' : 'Answer in Section 15'}
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string>('summary');
  const [glossaryDrawerOpen, setGlossaryDrawerOpen] = useState(false);
  const [glossaryDrawerQuery, setGlossaryDrawerQuery] = useState('');
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // Section 0 inline glossary filters
  const [glossarySearch, setGlossarySearch] = useState('');
  const [glossaryCategory, setGlossaryCategory] = useState<'All' | GlossaryItem['category']>('All');
  const [glossaryExpanded, setGlossaryExpanded] = useState(false);

  // Section 4 coverage filter
  const [coverageFilter, setCoverageFilter] = useState<'All' | CoverageRow['status']>('All');

  // Section 5 provider filter
  const [providerFilter, setProviderFilter] = useState<'All' | ProductProviderRow['tier']>('All');

  // Section 13 scorecard filter
  const [scorecardFilter, setScorecardFilter] = useState<'All' | ScorecardRow['category']>('All');

  // Section 11 interactive checklist
  const [completedSteps, setCompletedSteps] = useState<number[]>(loadCompletedSteps);

  // Section 15 partner decisions
  const [decisions, setDecisions] = useState<DecisionState>(loadDecisions);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DECISIONS, JSON.stringify(decisions));
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, [decisions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STEPS, JSON.stringify(completedSteps));
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, [completedSteps]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
      setScrollProgress(pct);

      const offsets = CHAPTERS.map((ch) => {
        const el = document.getElementById(ch.id);
        if (!el) return { id: ch.id, top: Number.POSITIVE_INFINITY };
        return { id: ch.id, top: Math.abs(el.getBoundingClientRect().top - 120) };
      });
      offsets.sort((a, b) => a.top - b.top);
      if (offsets[0] && offsets[0].top < 900) {
        setActiveSection(offsets[0].id);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredGlossary = useMemo(() => {
    const q = glossarySearch.trim().toLowerCase();
    return GLOSSARY_ITEMS.filter((item) => {
      const catOk = glossaryCategory === 'All' || item.category === glossaryCategory;
      const qOk =
        !q ||
        item.term.toLowerCase().includes(q) ||
        item.definition.toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [glossarySearch, glossaryCategory]);

  const visibleGlossary =
    glossaryExpanded || glossarySearch.trim() !== '' || glossaryCategory !== 'All'
      ? filteredGlossary
      : filteredGlossary.slice(0, 10);

  const filteredCoverage = useMemo(() => {
    if (coverageFilter === 'All') return COVERAGE_MATRIX;
    return COVERAGE_MATRIX.filter((r) => r.status === coverageFilter);
  }, [coverageFilter]);

  const filteredProviders = useMemo(() => {
    if (providerFilter === 'All') return PRODUCT_PROVIDERS;
    return PRODUCT_PROVIDERS.filter((p) => p.tier === providerFilter);
  }, [providerFilter]);

  const filteredScorecard = useMemo(() => {
    if (scorecardFilter === 'All') return SCORECARD_ROWS;
    return SCORECARD_ROWS.filter((s) => s.category === scorecardFilter);
  }, [scorecardFilter]);

  const answeredCount = DECISION_QUESTIONS.filter(
    (q) => decisions[q.id]?.choice || decisions[q.id]?.note?.trim()
  ).length;

  const updateDecision = (id: string, next: Partial<DecisionAnswer>) => {
    setDecisions((prev) => ({
      ...prev,
      [id]: {
        choice: prev[id]?.choice ?? '',
        note: prev[id]?.note ?? '',
        ...next,
      },
    }));
  };

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const openGlossaryWith = (term = '') => {
    setGlossaryDrawerQuery(term);
    setGlossaryDrawerOpen(true);
  };

  const handleCopyShareLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2200);
    } catch {
      setLinkCopied(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Strict 3-Zone Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-neutral-200 no-print">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
          <a
            href="#top"
            className="font-serif text-lg font-medium tracking-tight text-neutral-900 whitespace-nowrap shrink-0"
          >
            Partner Handoff
          </a>

          <nav
            aria-label="Primary sections"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600"
          >
            <a
              href="#summary"
              className="hover:text-neutral-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Summary
            </a>
            <a
              href="#glossary"
              className="hover:text-neutral-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Glossary
            </a>
            <a
              href="#final-stack"
              className="hover:text-neutral-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Stack
            </a>
            <a
              href="#payouts-taxes"
              className="hover:text-neutral-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Pakistan &amp; Tax
            </a>
            <a
              href="#scorecard"
              className="hover:text-neutral-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Scorecard
            </a>
          </nav>

          <a
            href="#decisions"
            className="rounded-md bg-emerald-950 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-900 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-900"
          >
            Review Decisions ({answeredCount}/6)
          </a>
        </div>

        {/* Thin reading progress hairline */}
        <div className="h-[2px] w-full bg-neutral-100">
          <div
            className="h-full bg-emerald-900 transition-transform duration-150 origin-left"
            style={{ transform: `scaleX(${scrollProgress / 100})` }}
          />
        </div>
      </header>

      {/* Cover / Editorial Title Block */}
      <section id="top" className="border-b border-neutral-200 bg-neutral-50/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl">
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
              Complete Handoff Document · Version 2.0 (Ground-Truthed) · Ready to Build
            </p>
            <h1 className="mt-4 font-serif text-3xl sm:text-5xl lg:text-[3.25rem] font-medium tracking-tight text-neutral-950 leading-[1.12]">
              Amazon &amp; AliExpress Affiliate Discovery Storefront
            </h1>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-neutral-700 max-w-2xl">
              The complete, unfiltered record of every decision, dead-end, tool evaluation, and hard constraint we&apos;ve hit for our Pakistan launch. Nothing is omitted. Technical terms are explained in plain English, and 6 partner decisions are waiting for your sign-off at the end.
            </p>

            {/* Clean unboxed operational metadata strip */}
            <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-neutral-200 pt-6 sm:grid-cols-4">
              <div>
                <dt className="text-xs text-neutral-500">Prepared For</dt>
                <dd className="mt-1 text-sm font-medium text-neutral-900">My Business Partner</dd>
              </div>
              <div>
                <dt className="text-xs text-neutral-500">Initial Scope</dt>
                <dd className="mt-1 text-sm font-medium text-neutral-900">Amazon + AliExpress</dd>
              </div>
              <div>
                <dt className="text-xs text-neutral-500">Launch Budget</dt>
                <dd className="mt-1 font-mono text-sm font-medium tabular-nums text-neutral-900">
                  $0 (Free Tier Stack)
                </dd>
              </div>
              <div>
                <dt className="text-xs text-neutral-500">Tax Target (PK)</dt>
                <dd className="mt-1 font-mono text-sm font-medium tabular-nums text-emerald-900">
                  0.25% via PSEB
                </dd>
              </div>
            </dl>

            {/* Reader Utility Actions (below hero, not in Top Bar) */}
            <div className="mt-8 flex flex-wrap items-center gap-3 no-print">
              <button
                type="button"
                onClick={() => openGlossaryWith('')}
                className="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-4 py-2 text-xs font-medium text-neutral-800 hover:border-neutral-400 hover:bg-neutral-50 transition-colors whitespace-nowrap shrink-0"
              >
                <BookOpen className="h-3.5 w-3.5 text-neutral-500" />
                Quick Glossary Lookup
              </button>
              <button
                type="button"
                onClick={() => setMobileTocOpen((v) => !v)}
                className="inline-flex lg:hidden items-center gap-2 rounded-md border border-neutral-300 bg-white px-4 py-2 text-xs font-medium text-neutral-800 hover:border-neutral-400 transition-colors whitespace-nowrap shrink-0"
              >
                <List className="h-3.5 w-3.5 text-neutral-500" />
                Jump to Section
                {mobileTocOpen ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </button>
              <button
                type="button"
                onClick={handleCopyShareLink}
                className="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-4 py-2 text-xs font-medium text-neutral-800 hover:border-neutral-400 hover:bg-neutral-50 transition-colors whitespace-nowrap shrink-0"
              >
                {linkCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-900" />
                    Link Copied
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5 text-neutral-500" />
                    Copy Page Link
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-4 py-2 text-xs font-medium text-neutral-800 hover:border-neutral-400 hover:bg-neutral-50 transition-colors whitespace-nowrap shrink-0"
              >
                <Printer className="h-3.5 w-3.5 text-neutral-500" />
                Print / Save PDF
              </button>
            </div>

            {/* Expandable Mobile Chapter Index */}
            {mobileTocOpen && (
              <nav
                aria-label="Mobile table of contents"
                className="mt-4 rounded-md border border-neutral-200 bg-white p-3 lg:hidden no-print"
              >
                <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                  {CHAPTERS.map((ch) => (
                    <li key={ch.id}>
                      <a
                        href={`#${ch.id}`}
                        onClick={() => setMobileTocOpen(false)}
                        className="flex items-center justify-between rounded px-2.5 py-2 text-xs text-neutral-700 hover:bg-neutral-100"
                      >
                        <span className="truncate">
                          <span className="font-mono text-neutral-400 mr-2">{ch.number}</span>
                          {ch.label}
                        </span>
                        {ch.hasInput && (
                          <span className="font-mono text-[10px] text-emerald-900 ml-2 shrink-0">
                            Input
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </div>
      </section>

      {/* Main Asymmetric Reading Canvas (Desktop: Left Sticky TOC + Right Document Body) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14">
          {/* Desktop Sticky Chapter Index */}
          <aside className="hidden lg:block no-print">
            <div className="sticky top-24 space-y-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-neutral-500 mb-3">
                  Document Index
                </p>
                <nav aria-label="Table of contents">
                  <ul className="space-y-0.5 border-l border-neutral-200">
                    {CHAPTERS.map((ch) => {
                      const isActive = activeSection === ch.id;
                      return (
                        <li key={ch.id}>
                          <a
                            href={`#${ch.id}`}
                            className={`flex items-center justify-between py-1.5 pl-3.5 pr-2 text-xs transition-colors -ml-px border-l ${
                              isActive
                                ? 'border-emerald-900 font-semibold text-neutral-950'
                                : 'border-transparent text-neutral-500 hover:text-neutral-900'
                            }`}
                          >
                            <span className="truncate">
                              <span className="font-mono text-[11px] text-neutral-400 mr-2">
                                {ch.number}
                              </span>
                              {ch.label}
                            </span>
                            {ch.hasInput && (
                              <span
                                className="font-mono text-[10px] text-emerald-900 shrink-0 ml-1"
                                title="Partner input needed in this section"
                              >
                                •
                              </span>
                            )}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>

              <div className="border-t border-neutral-200 pt-5 space-y-2.5">
                <button
                  type="button"
                  onClick={() => openGlossaryWith('')}
                  className="flex w-full items-center justify-between rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-700 hover:border-neutral-300 hover:text-neutral-950 transition-colors"
                >
                  <span>Quick Glossary</span>
                  <Search className="h-3.5 w-3.5 text-neutral-400" />
                </button>
                <p className="text-[11px] leading-relaxed text-neutral-500">
                  Sections marked with <span className="font-mono text-emerald-900">•</span> ask for your decision before we start building.
                </p>
              </div>
            </div>
          </aside>

          {/* Document Body */}
          <main className="min-w-0 space-y-20">
            {/* SECTION 14 surfaced upfront as Executive Summary + How to Read */}
            <section id="summary" className="scroll-mt-24">
              <div className="rounded-lg border border-neutral-200 bg-neutral-50/70 p-6 sm:p-8">
                <p className="font-mono text-xs uppercase tracking-widest text-emerald-900">
                  Executive One-Line Summary (Section 14)
                </p>
                <blockquote className="mt-4 font-serif text-xl sm:text-2xl leading-relaxed text-neutral-900">
                  &ldquo;We are building a free, affiliate-based, Amazon-like discovery storefront for Amazon + AliExpress only, using Amazonscraperapi (1,000 req/mo) for Amazon data, BayDeep (never-expiring key) for AliExpress data, CBAPI.dev (unlimited, 30 req/min) for affiliate links, and Feedico as structured backup — monetized via Admitad/Temu Affiliate, paid out through Payoneer, taxed at 0.25% via PSEB registration — with no COD, no checkout, and no inventory, because any other model requires capital we don&apos;t have as students.&rdquo;
                </blockquote>
                <p className="mt-5 border-t border-neutral-200 pt-4 text-xs leading-relaxed text-neutral-600">
                  <strong className="font-semibold text-neutral-800">How to read this document:</strong>{' '}
                  Every dead-end, tool limit, legal constraint, and Pakistan payout detail is laid out below in order. Wherever you see{' '}
                  <span className="font-mono text-emerald-900">Input Needed From You</span>, you can jump straight to Section 15 to record your call and copy a short reply back to Instagram DM.
                </p>
              </div>
            </section>

            {/* SECTION 0: GLOSSARY */}
            <section id="glossary" className="scroll-mt-24">
              <SectionHeader
                number="00"
                title="Glossary — Every Term Explained"
                subtitle="Read this first. Every technical, affiliate, and tax term below appears somewhere in this document."
              />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 no-print">
                <div className="relative flex-1 max-w-md">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={glossarySearch}
                    onChange={(e) => setGlossarySearch(e.target.value)}
                    placeholder="Filter 32 terms (e.g., API Call, Postback, PSEB)..."
                    className="w-full rounded-md border border-neutral-300 bg-white py-2 pl-9 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-emerald-900 focus:outline-none"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-1 rounded-md bg-neutral-100 p-1">
                  {(['All', 'Technical', 'Affiliate', 'Finance & Legal'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setGlossaryCategory(cat)}
                      className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                        glossaryCategory === cat
                          ? 'bg-white text-neutral-900 shadow-xs'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto border-t border-b border-neutral-200">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50/80 text-xs font-medium text-neutral-500">
                      <th className="py-3 pl-3 pr-4 w-44 sm:w-52">Term</th>
                      <th className="py-3 px-4">Plain English Meaning</th>
                      <th className="py-3 pl-4 pr-3 hidden sm:table-cell w-32 text-right">Category</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 text-sm">
                    {visibleGlossary.map((item) => (
                      <tr key={item.term} className="align-top">
                        <td className="py-3.5 pl-3 pr-4 font-mono text-xs sm:text-sm font-medium text-neutral-900">
                          {item.term}
                        </td>
                        <td className="py-3.5 px-4 leading-relaxed text-neutral-700">
                          {item.definition}
                        </td>
                        <td className="py-3.5 pl-4 pr-3 hidden sm:table-cell text-right text-xs text-neutral-500 whitespace-nowrap">
                          {item.category}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredGlossary.length > 10 && glossarySearch.trim() === '' && glossaryCategory === 'All' && (
                <div className="mt-4 flex items-center justify-between no-print">
                  <p className="text-xs text-neutral-500 font-mono tabular-nums">
                    Showing {visibleGlossary.length} of {filteredGlossary.length} terms
                  </p>
                  <button
                    type="button"
                    onClick={() => setGlossaryExpanded((v) => !v)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-950 hover:underline underline-offset-4"
                  >
                    {glossaryExpanded ? 'Show fewer terms' : `Show all ${filteredGlossary.length} terms`}
                    {glossaryExpanded ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              )}
            </section>

            {/* SECTION 1: THE ORIGINAL IDEA — AND WHY WE KILLED IT */}
            <section id="original-idea" className="scroll-mt-24">
              <SectionHeader
                number="01"
                title="The Original Idea — And Why We Killed It"
              />

              <div className="max-w-2xl space-y-6 text-[15px] leading-relaxed text-neutral-700">
                <div>
                  <h3 className="font-serif text-lg font-medium text-neutral-900">
                    1.1 What I First Proposed
                  </h3>
                  <p className="mt-2">
                    Open a store using the AliExpress API. Deliberately hide or soften words like &ldquo;Chinese,&rdquo; &ldquo;shipping,&rdquo; and &ldquo;delivery&rdquo; so customers wouldn&apos;t be scared off by long international shipping times or country-of-origin concerns.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-medium text-neutral-900">
                    1.2 Why It Failed — Three Reasons
                  </h3>
                  <div className="mt-4 space-y-5">
                    <div>
                      <p className="font-semibold text-neutral-900">
                        Reason 1: API access is tiered, not generic.
                      </p>
                      <p className="mt-1">
                        There is no single &ldquo;AliExpress API key&rdquo; that unlocks everything. AliExpress offers three separate programs:
                      </p>
                      <ul className="mt-2 list-disc pl-5 space-y-1.5 text-sm text-neutral-700">
                        <li>
                          <strong className="text-neutral-900">Dropshipping API</strong> — for resellers who fulfill orders. Requires developer account + explicit permission application.
                        </li>
                        <li>
                          <strong className="text-neutral-900">Affiliate API</strong> — only for promoting products to earn commission. No order management.
                        </li>
                        <li>
                          <strong className="text-neutral-900">Merchant Self-Use API</strong> — only for managing your own AliExpress store.
                        </li>
                      </ul>
                      <p className="mt-2">
                        None of these let us do what I originally imagined (open a store with hidden origin).
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-neutral-900">
                        Reason 2: The physical package exposes the truth.
                      </p>
                      <p className="mt-1">
                        AliExpress sellers are legally required to print their real Chinese return address on the outside of every package. Even if our website hides every mention of China, the cardboard box that arrives at the customer&apos;s door says &ldquo;Shenzhen, China&rdquo; in bold letters. The customer opens the box, sees the label, and feels deceived. This is the exact angry-customer scenario we were trying to avoid — and we would have caused it ourselves.
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-neutral-900">
                        Reason 3: Terms of Service violation.
                      </p>
                      <p className="mt-1">
                        AliExpress&apos;s terms explicitly prohibit misrepresenting product origin and prohibit &ldquo;systematic retrieval of Site Content to build a collection, compilation, database, or directory&rdquo; without written permission. Hiding origin violates the first. Scraping their catalog violates the second. Two violations, zero defenses.
                      </p>
                    </div>
                  </div>
                </div>

                <OutcomeNote kind="LOSE" label="1.3 Verdict — Lose Situation">
                  High legal risk, physically impossible to execute, guaranteed to create angry customers. This idea is dead. We move on.
                </OutcomeNote>
              </div>
            </section>

            {/* SECTION 2: THE PIVOT */}
            <section id="pivot" className="scroll-mt-24">
              <SectionHeader
                number="02"
                title='The Pivot — "Unite All Stores Into One"'
              />

              <div className="space-y-8">
                <div className="max-w-2xl space-y-5 text-[15px] leading-relaxed text-neutral-700">
                  <div>
                    <h3 className="font-serif text-lg font-medium text-neutral-900">2.1 New Vision</h3>
                    <p className="mt-2">
                      A single unified storefront that aggregates products from Amazon (premium feel), AliExpress (cheap/free feel), and others — &ldquo;nothing new, just all in one.&rdquo; The user sees one beautiful website. Behind the scenes, we pull data from many sources.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-serif text-lg font-medium text-neutral-900">
                      2.2 The Core Architectural Finding
                    </h3>
                    <p className="mt-2 font-medium text-neutral-900">
                      No single provider covers every platform for both product data AND affiliate data.
                    </p>
                    <p className="mt-1">
                      This means we cannot just sign up for one service and be done. We need a layered stack — different tools for different jobs, stacked on top of each other.
                    </p>
                  </div>
                </div>

                {/* 2.3 Three-Layer Architecture */}
                <div>
                  <h3 className="font-serif text-lg font-medium text-neutral-900 mb-4">
                    2.3 The Three-Layer Architecture
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-md border border-neutral-200 bg-white p-5">
                      <p className="font-mono text-xs text-neutral-500">Layer 01</p>
                      <h4 className="mt-1 font-serif text-base font-medium text-neutral-900">
                        Our Custom Frontend
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                        Our own website. Our own design. Our own branding. This is the only part the customer ever sees. It looks like Amazon, feels like Amazon, but it&apos;s ours.
                      </p>
                    </div>
                    <div className="rounded-md border border-neutral-200 bg-white p-5">
                      <p className="font-mono text-xs text-neutral-500">Layer 02</p>
                      <h4 className="mt-1 font-serif text-base font-medium text-neutral-900">
                        Product Data Layer
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                        Tools that fetch product information (titles, prices, images, descriptions) from Amazon, AliExpress, etc., and normalize it into one consistent format so our frontend can display it uniformly.
                      </p>
                    </div>
                    <div className="rounded-md border border-neutral-200 bg-white p-5">
                      <p className="font-mono text-xs text-neutral-500">Layer 03</p>
                      <h4 className="mt-1 font-serif text-base font-medium text-neutral-900">
                        Affiliate / Monetization Layer
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                        Tools that generate our tracked affiliate links and report commissions back to us automatically.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="max-w-2xl space-y-6 text-[15px] leading-relaxed text-neutral-700">
                  <div>
                    <h3 className="font-serif text-lg font-medium text-neutral-900">
                      2.4 The Critical Legal Catch (Amazon SP-API)
                    </h3>
                    <p className="mt-2">
                      Amazon&apos;s official API (SP-API) has a rule: you cannot mix SP-API data with third-party data in the same application. If we pull Amazon data officially and also pull AliExpress data from a scraper, and display them side-by-side, we violate Amazon&apos;s terms.
                    </p>
                    <p className="mt-2 font-medium text-neutral-900">
                      Our solution: Do not use Amazon&apos;s official SP-API at all. Use only third-party scrapers/aggregators for all data. This keeps us out of Amazon&apos;s direct compliance framework entirely.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-serif text-lg font-medium text-neutral-900">
                      2.5 The &ldquo;56 Similar + One FREE on AliExpress&rdquo; Feature
                    </h3>
                    <p className="mt-2">
                      This is the killer feature we want. When a user views a product, we show:
                    </p>
                    <ul className="mt-2 list-disc pl-5 space-y-1 text-sm">
                      <li>&ldquo;56 similar products&rdquo;</li>
                      <li>&ldquo;One of these is FREE on AliExpress&rdquo; (or dramatically cheaper)</li>
                    </ul>
                    <p className="mt-3 text-sm font-semibold text-neutral-900">
                      How it works technically:
                    </p>
                    <ul className="mt-1.5 list-disc pl-5 space-y-1 text-sm">
                      <li>
                        <strong>Visual/image search</strong> — send an image to an API, get back visually similar products across platforms.
                      </li>
                      <li>
                        <strong>Keyword/category matching</strong> — search other platforms using the product&apos;s title and category.
                      </li>
                      <li>
                        <strong>Price comparison badges</strong> — flag items found cheaper elsewhere.
                      </li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <OutcomeNote kind="PROFIT" label="Profit Situation">
                      This feature is what makes us different from just &ldquo;another Amazon clone.&rdquo; It gives users a reason to visit us instead of going straight to Amazon.
                    </OutcomeNote>
                    <OutcomeNote kind="LOSE" label="Lose Situation">
                      If we can&apos;t reliably match products across platforms (because titles differ wildly, or images are watermarked differently), the feature looks broken and users lose trust.
                    </OutcomeNote>
                  </div>
                </div>

                <InputNeededCallout
                  questionId="differentiator"
                  prompt='Do you agree this "56 similar + one free" feature is our main differentiator? Or do you want to focus on a different angle (e.g., curated "best of" lists, or user reviews)?'
                  answeredChoice={decisions.differentiator?.choice}
                />
              </div>
            </section>

            {/* SECTION 3: AFFILIATE DATA SEPARATION */}
            <section id="affiliate-separation" className="scroll-mt-24">
              <SectionHeader
                number="03"
                title="Affiliate Data Separation"
              />

              <div className="space-y-8">
                <div className="max-w-2xl space-y-4 text-[15px] leading-relaxed text-neutral-700">
                  <div>
                    <h3 className="font-serif text-lg font-medium text-neutral-900">
                      3.1 The Question I Asked
                    </h3>
                    <p className="mt-1.5 italic text-neutral-800">
                      &ldquo;Does the product-data aggregator (Apinoa) also provide affiliate data so we can bypass AliExpress directly?&rdquo;
                    </p>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-medium text-neutral-900">
                      3.2 The Answer
                    </h3>
                    <p className="mt-1.5">
                      No. Product-data aggregators (Apinoa, Apify) are not affiliate networks. They survive legally as neutral infrastructure layers — they just move data. They don&apos;t touch money or commissions. The compliance burden falls on us. They provide the data; we own the application logic and the legal responsibility for how we use it.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-medium text-neutral-900 mb-3">
                    3.3 Affiliate Aggregators We Evaluated
                  </h3>
                  <div className="overflow-x-auto border-t border-b border-neutral-200">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-neutral-200 bg-neutral-50/80 text-xs font-medium text-neutral-500">
                          <th className="py-3 pl-3 pr-4">Provider</th>
                          <th className="py-3 px-4">What It Does</th>
                          <th className="py-3 px-4">Why Considered</th>
                          <th className="py-3 pl-4 pr-3">Kept / Dropped</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200">
                        {AFFILIATE_AGGREGATORS.map((row) => (
                          <tr key={row.provider} className="align-top">
                            <td className="py-3.5 pl-3 pr-4 font-medium text-neutral-900 whitespace-nowrap">
                              {row.provider}
                            </td>
                            <td className="py-3.5 px-4 text-neutral-700">{row.whatItDoes}</td>
                            <td className="py-3.5 px-4 text-neutral-600">{row.whyConsidered}</td>
                            <td
                              className={`py-3.5 pl-4 pr-3 font-medium ${
                                row.status === 'primary'
                                  ? 'text-emerald-900'
                                  : row.status === 'backup'
                                    ? 'text-neutral-900'
                                    : 'text-neutral-500'
                              }`}
                            >
                              {row.outcome}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="max-w-2xl space-y-4 text-[15px] leading-relaxed text-neutral-700">
                  <h3 className="font-serif text-lg font-medium text-neutral-900">
                    3.4 Official APIs We Dropped
                  </h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-sm">
                    <li>
                      <strong className="text-neutral-900">AliExpress Affiliate API</strong> — free but requires registration and quotas; harder to manage as a solo student.
                    </li>
                    <li>
                      <strong className="text-neutral-900">TikTok Shop Partner API</strong> — requires partner approval, enterprise paperwork.
                    </li>
                    <li>
                      <strong className="text-neutral-900">Temu Partner Platform</strong> — requires partner approval.
                    </li>
                  </ul>
                  <p className="text-sm">
                    <strong className="text-neutral-900">Reason for dropping all three:</strong> As a student, official API approvals are a bureaucratic nightmare we don&apos;t have time or standing to navigate. Third-party aggregators let us skip the paperwork.
                  </p>
                  <OutcomeNote kind="LOSE" label="Lose Situation">
                    Dropping official APIs means we cannot generate native commissionable links for TikTok Shop, Temu, Shopee, Lazada, Alibaba, or Taobao. Those platforms will be display-only until we&apos;re ready to pursue official approval later.
                  </OutcomeNote>
                </div>
              </div>
            </section>

            {/* SECTION 4: FULL COVERAGE MATRIX */}
            <section id="coverage-matrix" className="scroll-mt-24">
              <SectionHeader
                number="04"
                title="Full Coverage Matrix — The Gaps Made Visible"
                subtitle="Target stores evaluated: Amazon, TikTok Shop, Shopee, Lazada, AliExpress, Alibaba (1688), Temu, Walmart, Etsy, eBay, Shein, Taobao, Shopify."
              />

              <div className="space-y-6">
                <div className="max-w-2xl text-[15px] leading-relaxed text-neutral-700">
                  <p>
                    <strong className="text-neutral-900">4.2 Product Data Coverage — SOLVED:</strong>{' '}
                    One tool — Apify E-commerce Scraper — covers all target stores in unified JSON. (Later downgraded from &ldquo;primary&rdquo; to &ldquo;occasional use&rdquo; because its free tier is credit-based, not request-based, though it technically can cover everything.)
                  </p>
                </div>

                <div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                    <h3 className="font-serif text-lg font-medium text-neutral-900">
                      4.3 Affiliate Coverage — Hard Gaps
                    </h3>
                    <div className="flex flex-wrap items-center gap-1 rounded-md bg-neutral-100 p-1 no-print">
                      {(['All', 'Monetizable', 'Partial', 'Display only'] as const).map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setCoverageFilter(status)}
                          className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                            coverageFilter === status
                              ? 'bg-white text-neutral-900 shadow-xs'
                              : 'text-neutral-600 hover:text-neutral-900'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="overflow-x-auto border-t border-b border-neutral-200">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-neutral-200 bg-neutral-50/80 text-xs font-medium text-neutral-500">
                          <th className="py-3 pl-3 pr-4">Store</th>
                          <th className="py-3 px-4">Product Data</th>
                          <th className="py-3 px-4">Affiliate Links (Third-Party)</th>
                          <th className="py-3 pl-4 pr-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200">
                        {filteredCoverage.map((row) => (
                          <tr key={row.store} className="align-top">
                            <td className="py-3 pl-3 pr-4 font-medium text-neutral-900 whitespace-nowrap">
                              {row.store}
                            </td>
                            <td className="py-3 px-4 text-neutral-700 whitespace-nowrap">
                              {row.productData}
                            </td>
                            <td className="py-3 px-4 text-neutral-700">{row.affiliateAccess}</td>
                            <td
                              className={`py-3 pl-4 pr-3 text-right font-mono text-xs font-medium whitespace-nowrap ${
                                row.status === 'Monetizable'
                                  ? 'text-emerald-900'
                                  : row.status === 'Partial'
                                    ? 'text-amber-800'
                                    : 'text-neutral-500'
                              }`}
                            >
                              {row.status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-4xl">
                  <OutcomeNote kind="PROFIT" label="Profit Situation">
                    Amazon, Walmart, eBay, and AliExpress are fully monetizable — real revenue from day one.
                  </OutcomeNote>
                  <OutcomeNote kind="LOSE" label="Lose Situation">
                    TikTok Shop, Temu, Shopee, Lazada, Alibaba, Taobao, and Shopify are display-only — we show products but earn nothing when users click. This is the boundary of third-party-only. To cross it, we eventually need official API approvals.
                  </OutcomeNote>
                </div>
              </div>
            </section>

            {/* SECTION 5: VERIFIED FREE LIMITS */}
            <section id="free-limits" className="scroll-mt-24">
              <SectionHeader
                number="05"
                title='The "Everything Free" Constraint — Final Verified Limits'
                subtitle="Student budget = $0. Every provider was stress-tested for exact on-the-ground limits — not marketing claims."
              />

              <div className="space-y-8">
                <div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                    <h3 className="font-serif text-lg font-medium text-neutral-900">
                      5.2 Product Data Providers — Final Verified Table
                    </h3>
                    <div className="flex flex-wrap items-center gap-1 rounded-md bg-neutral-100 p-1 no-print">
                      {(
                        [
                          ['All', 'All'],
                          ['primary', 'Primary'],
                          ['limited', 'Limited / Testing'],
                          ['rejected', 'Rejected / Eliminated'],
                        ] as const
                      ).map(([val, label]) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setProviderFilter(val)}
                          className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                            providerFilter === val
                              ? 'bg-white text-neutral-900 shadow-xs'
                              : 'text-neutral-600 hover:text-neutral-900'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="overflow-x-auto border-t border-b border-neutral-200">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-neutral-200 bg-neutral-50/80 text-xs font-medium text-neutral-500">
                          <th className="py-3 pl-3 pr-4">Provider</th>
                          <th className="py-3 px-3">Covers</th>
                          <th className="py-3 px-3">Free Cap</th>
                          <th className="py-3 px-3">Exact Limit</th>
                          <th className="py-3 px-3">Rate Limit</th>
                          <th className="py-3 pl-3 pr-3">Verdict</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200">
                        {filteredProviders.map((row) => (
                          <tr key={row.provider} className="align-top">
                            <td className="py-3.5 pl-3 pr-4 font-medium text-neutral-900 whitespace-nowrap">
                              {row.provider}
                            </td>
                            <td className="py-3.5 px-3 text-neutral-700 whitespace-nowrap">
                              {row.covers}
                            </td>
                            <td className="py-3.5 px-3 text-neutral-600">{row.freeCapStructure}</td>
                            <td className="py-3.5 px-3 font-mono text-xs tabular-nums text-neutral-800">
                              {row.exactLimit}
                            </td>
                            <td className="py-3.5 px-3 font-mono text-xs tabular-nums text-neutral-600">
                              {row.perMinuteLimit}
                            </td>
                            <td
                              className={`py-3.5 pl-3 pr-3 text-xs font-semibold ${
                                row.tier === 'primary'
                                  ? 'text-emerald-900'
                                  : row.tier === 'limited'
                                    ? 'text-amber-800'
                                    : 'text-neutral-500'
                              }`}
                            >
                              {row.verdict}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-medium text-neutral-900 mb-3">
                    5.3 Affiliate Data Providers — Final Verified Table
                  </h3>
                  <div className="overflow-x-auto border-t border-b border-neutral-200">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-neutral-200 bg-neutral-50/80 text-xs font-medium text-neutral-500">
                          <th className="py-3 pl-3 pr-4">Provider</th>
                          <th className="py-3 px-3">Covers</th>
                          <th className="py-3 px-3">Free Cap</th>
                          <th className="py-3 px-3">Exact Limit</th>
                          <th className="py-3 px-3">Per-Minute</th>
                          <th className="py-3 pl-3 pr-3">Verdict</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200">
                        {AFFILIATE_PROVIDERS.map((row) => (
                          <tr key={row.provider} className="align-top">
                            <td className="py-3.5 pl-3 pr-4 font-medium text-neutral-900 whitespace-nowrap">
                              {row.provider}
                            </td>
                            <td className="py-3.5 px-3 text-neutral-700">{row.covers}</td>
                            <td className="py-3.5 px-3 text-neutral-600 whitespace-nowrap">
                              {row.freeCapStructure}
                            </td>
                            <td className="py-3.5 px-3 font-mono text-xs tabular-nums text-neutral-800">
                              {row.exactLimit}
                            </td>
                            <td className="py-3.5 px-3 font-mono text-xs tabular-nums text-neutral-600 whitespace-nowrap">
                              {row.perMinuteLimit}
                            </td>
                            <td
                              className={`py-3.5 pl-3 pr-3 text-xs font-semibold whitespace-nowrap ${
                                row.tier === 'primary' ? 'text-emerald-900' : 'text-amber-800'
                              }`}
                            >
                              {row.verdict}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="rounded-md border border-neutral-200 p-5">
                    <h4 className="font-serif text-base font-medium text-neutral-900">
                      5.4 Why Bright Data Was Eliminated
                    </h4>
                    <ul className="mt-3 list-disc pl-5 space-y-1.5 text-sm text-neutral-700">
                      <li>Fresh accounts reported the free tier was &ldquo;never granted.&rdquo;</li>
                      <li>Account suspended at $0 balance; first API call timed out after 120 seconds.</li>
                      <li>
                        KYC wall: residential proxy network requires human-reviewed identity verification, explicitly unavailable to individual users, student projects, and Gmail/Outlook accounts.
                      </li>
                      <li>Paid plans start at $1,500/month — completely out of reach.</li>
                    </ul>
                    <p className="mt-3 text-xs font-medium text-amber-900">
                      Verdict: LOSE situation. Integration time would be wasted. Skip it entirely.
                    </p>
                  </div>

                  <div className="rounded-md border border-neutral-200 p-5">
                    <h4 className="font-serif text-base font-medium text-neutral-900">
                      5.5 Why Serpent Was Rejected
                    </h4>
                    <ul className="mt-3 list-disc pl-5 space-y-1.5 text-sm text-neutral-700">
                      <li>
                        10 free calls on signup is enough to test that the API works, not enough to build a catalog.
                      </li>
                      <li>
                        $0.02/1,000 rate requires a <strong className="text-neutral-900">$10 minimum deposit</strong> — not free.
                      </li>
                    </ul>
                    <p className="mt-3 text-xs font-medium text-amber-900">
                      Verdict: LOSE situation. It&apos;s a paid product with a tiny free trial, not a free tier.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 6: WHAT 1 API CALL ACTUALLY MEANS */}
            <section id="api-call-math" className="scroll-mt-24">
              <SectionHeader
                number="06"
                title='What "1 API Call" Actually Means (Critical)'
                subtitle="Clearing up the single most misunderstood concept in the entire project."
              />

              <div className="space-y-6 max-w-3xl text-[15px] leading-relaxed text-neutral-700">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-md border border-neutral-200 p-5">
                    <p className="font-mono text-xs text-neutral-500">6.1 The Misconception</p>
                    <p className="mt-2 text-sm text-neutral-700">
                      I initially thought &ldquo;1 API call = 1 product&rdquo; or &ldquo;1 API call = the whole database.&rdquo; Both are wrong.
                    </p>
                  </div>
                  <div className="rounded-md border border-emerald-900/25 bg-emerald-950/[0.03] p-5">
                    <p className="font-mono text-xs text-emerald-900">6.2 The Correct Understanding</p>
                    <p className="mt-2 text-sm font-medium text-neutral-900">
                      One API call = ONE PAGE of results. Usually 10–100 products depending on the provider.
                    </p>
                  </div>
                </div>

                <div className="rounded-md border border-neutral-200 bg-neutral-50 p-5">
                  <p className="font-mono text-xs text-neutral-500 uppercase tracking-wider">
                    6.3 The Correct Formula
                  </p>
                  <p className="mt-2 font-mono text-sm sm:text-base font-medium text-neutral-950">
                    Total product records = (number of calls in the period) × (products per call)
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="font-serif text-base font-medium text-neutral-900">
                      6.4 Amazon Capacity (Amazonscraperapi)
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li className="font-mono text-xs tabular-nums text-neutral-800">
                        1,000 req/month × 16–48 products/page = 16,000–48,000 records/month
                      </li>
                      <li>Minus duplicates, sponsored items, and repeating variants across pages.</li>
                      <li>
                        <strong className="text-neutral-900">Realistic unique catalog:</strong> ~10,000–30,000 usable unique products/month.
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-base font-medium text-neutral-900">
                      AliExpress Capacity (BayDeep)
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Key never expires, so time is the only constraint, not monthly quota.</li>
                      <li>
                        Limited by <span className="font-mono text-xs">30 req/min</span> and avoiding quota-heavy endpoints (<span className="font-mono text-xs">search_products</span>, <span className="font-mono text-xs">product_detail</span> consume platform quota; use <span className="font-mono text-xs">shelf_search</span> for repeated lookups).
                      </li>
                      <li>
                        <strong className="text-neutral-900">Realistic:</strong> large AliExpress catalog built over several weeks, not in one day.
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-lg font-medium text-neutral-900">
                    6.5 The &ldquo;Per Day&rdquo; Confusion (Explained)
                  </h3>
                  <p className="text-sm">
                    I asked: &ldquo;Is 10 × 1,000 calls = 10,000 products per day?&rdquo; No. It always depends on the quota period:
                  </p>
                  <ul className="mt-2 space-y-1 font-mono text-xs tabular-nums text-neutral-800 bg-neutral-50 border border-neutral-200 rounded-md p-4">
                    <li>1,000 calls/month × 10 products/call = 10,000 records / MONTH</li>
                    <li>1,000 calls/day   × 10 products/call = 10,000 records / DAY</li>
                    <li>1,000 calls once  × 10 products/call = 10,000 records TOTAL, ever</li>
                  </ul>
                  <p className="text-sm">
                    You must always ask: <em>&ldquo;Is the quota per day, per month, or one-time?&rdquo;</em>
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-medium text-neutral-900">
                    6.6 Other Practical Catches
                  </h3>
                  <ul className="mt-2 list-disc pl-5 space-y-1.5 text-sm">
                    <li>
                      <strong className="text-neutral-900">Records ≠ unique products.</strong> Pagination returns duplicates.
                    </li>
                    <li>
                      <strong className="text-neutral-900">Search APIs often cap total results.</strong> Amazon-style APIs may only let you page through the first 100 results per search query, even if you have calls left.
                    </li>
                    <li>
                      <strong className="text-neutral-900">Free tiers reset monthly, not daily</strong> — verify each provider&apos;s terms.
                    </li>
                  </ul>
                </div>

                <InputNeededCallout
                  questionId="catalogSpeed"
                  prompt="Are you okay with building the Amazon catalog at roughly 10,000–30,000 unique products per month? Or do you want to explore paid tiers early to go faster?"
                  answeredChoice={decisions.catalogSpeed?.choice}
                />
              </div>
            </section>

            {/* SECTION 7: PAKISTAN-SPECIFIC REALITY CHECKS */}
            <section id="pakistan-reality" className="scroll-mt-24">
              <SectionHeader
                number="07"
                title="Pakistan-Specific Reality Checks"
              />

              <div className="space-y-8 max-w-3xl text-[15px] leading-relaxed text-neutral-700">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="rounded-md border border-neutral-200 p-5">
                    <h3 className="font-serif text-base font-medium text-neutral-900">
                      7.1 Daraz Rejected
                    </h3>
                    <p className="mt-2 text-sm">
                      Original plan was to use Daraz as a local anchor (bank/JazzCash/Easypaisa payouts, local trust). Rejected because local distrust of Daraz is widespread — building our site on a platform people already distrust is a losing battle.
                    </p>
                    <p className="mt-3 font-mono text-xs font-medium text-amber-900">
                      Verdict: LOSE — abandon Daraz entirely.
                    </p>
                  </div>

                  <div className="rounded-md border border-neutral-200 p-5">
                    <h3 className="font-serif text-base font-medium text-neutral-900">
                      7.2 Temu Hype (Legit Version)
                    </h3>
                    <p className="mt-2 text-sm">
                      Capture Temu-style excitement (cheap, viral products) paired with legitimately good products including Amazon. Key finding: Temu Affiliate Program is open to Pakistan with 5–30% commission.
                    </p>
                    <p className="mt-3 font-mono text-xs font-medium text-emerald-900">
                      Verdict: PROFIT — first real revenue stream.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-medium text-neutral-900">
                    7.3 COD Contradiction (Major Issue)
                  </h3>
                  <ul className="mt-2 list-disc pl-5 space-y-1.5 text-sm">
                    <li>Cash on Delivery (COD) is incompatible with affiliate marketing.</li>
                    <li>
                      Temu does NOT offer COD in Pakistan (prepaid only — a point of criticism from local regulators).
                    </li>
                    <li>AliExpress rarely offers COD on cross-border Pakistan orders.</li>
                    <li>
                      You cannot offer COD as an affiliate — the merchant controls payment; you just earn a referral commission.
                    </li>
                  </ul>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <OutcomeNote kind="PROFIT" label="Profit Situation">
                      We don&apos;t need to build any COD collection system. The merchant handles it. Our backend just redirects.
                    </OutcomeNote>
                    <OutcomeNote kind="LOSE" label="Lose Situation">
                      We cannot advertise &ldquo;Cash on Delivery available.&rdquo; We must be honest upfront: &ldquo;Payment is made on Temu/AliExpress checkout. COD availability depends on the merchant.&rdquo;
                    </OutcomeNote>
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-medium text-neutral-900 mb-3">
                    7.4 Affiliate ≠ Dropshipping (Crucial)
                  </h3>
                  <div className="overflow-x-auto border-t border-b border-neutral-200">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-neutral-200 bg-neutral-50/80 text-xs font-medium text-neutral-500">
                          <th className="py-3 pl-3 pr-4">Model</th>
                          <th className="py-3 px-4">You Handle Payment?</th>
                          <th className="py-3 px-4">You Offer COD?</th>
                          <th className="py-3 pl-4 pr-3">Cost</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200">
                        <tr>
                          <td className="py-3 pl-3 pr-4 font-medium text-emerald-900">
                            Affiliate (Our Model)
                          </td>
                          <td className="py-3 px-4">No — merchant does</td>
                          <td className="py-3 px-4">No</td>
                          <td className="py-3 pl-4 pr-3 font-mono text-xs font-medium text-emerald-900">
                            Free
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 pl-3 pr-4 font-medium text-neutral-900">
                            Dropshipping / Reseller
                          </td>
                          <td className="py-3 px-4">Yes — you do</td>
                          <td className="py-3 px-4">Yes (with capital)</td>
                          <td className="py-3 pl-4 pr-3 text-neutral-600">
                            Requires capital, payment gateway, courier
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-4 text-sm">
                    <strong className="text-neutral-900">Why we cannot do dropshipping as students:</strong>{' '}
                    We&apos;d need to buy inventory upfront, arrange international shipping to Pakistan, register a business, integrate a Pakistani payment gateway (Safepay, PayFast), sign a courier contract (TCS, Leopards), and handle customer service for every order. That&apos;s a full company, not a student project.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 8: COMMISSION TRACKING MECHANICS */}
            <section id="commission-tracking" className="scroll-mt-24">
              <SectionHeader
                number="08"
                title="Commission Tracking Mechanics"
              />

              <div className="space-y-8 max-w-3xl">
                <div>
                  <h3 className="font-serif text-lg font-medium text-neutral-900">
                    8.1 You Do NOT Track Commissions Manually
                  </h3>
                  <ol className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
                    {[
                      'We generate a unique affiliate link with our tracking ID embedded.',
                      'User clicks → a cookie is set in their browser (30-day typical window).',
                      'User buys on the merchant\'s site.',
                      'Merchant\'s server sends a postback to the affiliate network saying "this sale belongs to affiliate #12345."',
                      'Network credits our dashboard automatically.',
                      'We request payout once we hit the threshold.',
                    ].map((step, idx) => (
                      <li
                        key={step}
                        className="flex gap-3 rounded-md border border-neutral-200 p-3.5 text-neutral-700"
                      >
                        <span className="font-mono text-xs font-medium text-emerald-900 pt-0.5">
                          0{idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-medium text-neutral-900 mb-3">
                    8.2 Payout Thresholds
                  </h3>
                  <div className="overflow-x-auto border-t border-b border-neutral-200">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-neutral-200 bg-neutral-50/80 text-xs font-medium text-neutral-500">
                          <th className="py-3 pl-3 pr-4">Platform</th>
                          <th className="py-3 px-4">Minimum Payout</th>
                          <th className="py-3 px-4">Payment Hold</th>
                          <th className="py-3 pl-4 pr-3">Payout Frequency</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200">
                        {PAYOUT_THRESHOLDS.map((row) => (
                          <tr key={row.platform}>
                            <td className="py-3 pl-3 pr-4 font-medium text-neutral-900">
                              {row.platform}
                            </td>
                            <td className="py-3 px-4 font-mono text-xs tabular-nums text-neutral-800">
                              {row.minimumPayout}
                            </td>
                            <td className="py-3 px-4 text-neutral-700">{row.paymentHold}</td>
                            <td className="py-3 pl-4 pr-3 text-neutral-700">{row.payoutFrequency}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <OutcomeNote kind="PROFIT" label="Profit Situation">
                    Once the flow is set up, it&apos;s genuinely passive. We check the dashboard, request withdrawal, receive money in Payoneer.
                  </OutcomeNote>
                  <OutcomeNote kind="LOSE" label="Lose Situation">
                    If our affiliate link is broken or the cookie doesn&apos;t set (e.g., strict privacy settings), the sale is attributed to &ldquo;no affiliate&rdquo; and we earn $0. We must test every link format carefully.
                  </OutcomeNote>
                </div>

                <InputNeededCallout
                  questionId="payoutHandling"
                  prompt="Are you comfortable being the one who checks the affiliate dashboards monthly and requests payouts? Or should we split this (you check Temu, I check Admitad/Amazon)?"
                  answeredChoice={decisions.payoutHandling?.choice}
                />
              </div>
            </section>

            {/* SECTION 9: PAYOUTS AND TAXES (PAKISTAN) */}
            <section id="payouts-taxes" className="scroll-mt-24">
              <SectionHeader
                number="09"
                title="Payouts and Taxes (Pakistan)"
              />

              <div className="space-y-8 max-w-3xl text-[15px] leading-relaxed text-neutral-700">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="rounded-md border border-neutral-200 p-5 space-y-2">
                    <h3 className="font-serif text-base font-medium text-neutral-900">
                      9.1 Payout Reality
                    </h3>
                    <ul className="list-disc pl-5 space-y-1.5 text-sm">
                      <li>PayPal does not serve Pakistan. Full stop.</li>
                      <li>
                        <strong className="text-neutral-900">Payoneer</strong> is the practical route: US/EU receiving accounts → withdraw to Pakistani bank.
                      </li>
                      <li>
                        Amazon Associates + Payoneer is widely used by Pakistani affiliates, but not officially documented by Amazon for Pakistan. Unverified — test with a small payout first.
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-md border border-neutral-200 p-5 space-y-2">
                    <h3 className="font-serif text-base font-medium text-neutral-900">
                      9.2 Payoneer Fee Reality
                    </h3>
                    <ul className="list-disc pl-5 space-y-1.5 text-sm">
                      <li>
                        <strong className="text-neutral-900">$4 withdrawal fee</strong> on a $200 payout (~2%) + ~2% USD→PKR conversion margin.
                      </li>
                      <li>
                        Reports of 3% withdrawal fee for Pakistani users since May 2025 — verify current fee in your dashboard.
                      </li>
                      <li>
                        <strong className="text-neutral-900">Example:</strong> $200 earned (~$4,000 in 5% sales) nets roughly $192–$194 in PKR equivalent.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* 9.3 Taxes */}
                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-medium text-neutral-900">
                    9.3 Taxes — Why PSEB + W-8BEN Are Non-Negotiable
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-md border border-neutral-200 p-4">
                      <p className="text-xs text-neutral-500">Without PSEB</p>
                      <p className="mt-1 font-mono text-2xl font-medium tabular-nums text-neutral-900">
                        15%
                      </p>
                      <p className="mt-1 text-xs text-neutral-600">
                        Standard non-salaried slab (Rs 600k–1.2M) or 1% unregistered IT exporter. Rs 150,000 on Rs 1M.
                      </p>
                    </div>
                    <div className="rounded-md border border-emerald-900/30 bg-emerald-950/[0.03] p-4">
                      <p className="text-xs text-emerald-900">With PSEB (Sec. 154A)</p>
                      <p className="mt-1 font-mono text-2xl font-medium tabular-nums text-emerald-950">
                        0.25%
                      </p>
                      <p className="mt-1 text-xs text-neutral-700">
                        IT export final tax. Rs 2,500 on Rs 1,000,000 income — 60× less tax.
                      </p>
                    </div>
                    <div className="rounded-md border border-amber-900/30 bg-amber-950/[0.03] p-4">
                      <p className="text-xs text-amber-900">Missing W-8BEN (US)</p>
                      <p className="mt-1 font-mono text-2xl font-medium tabular-nums text-amber-950">
                        30%
                      </p>
                      <p className="mt-1 text-xs text-neutral-700">
                        Permanently withheld with no Pakistani credit ($300 lost per $1,000). File W-8BEN under PK-US DTAA.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-medium text-neutral-900">
                    9.4 Required Actions (In Order)
                  </h3>
                  <ol className="mt-3 list-decimal pl-5 space-y-1.5 text-sm text-neutral-800">
                    <li>Get NTN (National Tax Number).</li>
                    <li>Register with PSEB.</li>
                    <li>File annual tax return before 30 September every year.</li>
                    <li>File W-8BEN during Amazon Associates signup.</li>
                  </ol>
                </div>

                <InputNeededCallout
                  questionId="taxRegistration"
                  prompt="Do you have an NTN already, or do we both need to get one? Who handles the PSEB registration — one of us, or do we split the paperwork?"
                  answeredChoice={decisions.taxRegistration?.choice}
                />
              </div>
            </section>

            {/* SECTION 10: FINAL DECISION & UPDATED STACK */}
            <section id="final-stack" className="scroll-mt-24">
              <SectionHeader
                number="10"
                title="Final Decision & Updated Stack"
                subtitle='Chosen path: Affiliate storefront — not dropshipping, not reseller. "Start Short" scope: Amazon + AliExpress only, Amazon-like discovery UI, redirect links only.'
              />

              <div className="space-y-8">
                <div className="overflow-x-auto border-t border-b border-neutral-200">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-neutral-200 bg-neutral-50/80 text-xs font-medium text-neutral-500">
                        <th className="py-3 pl-3 pr-4">Layer</th>
                        <th className="py-3 px-4">Tool</th>
                        <th className="py-3 px-4">Free Allowance</th>
                        <th className="py-3 pl-4 pr-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {FINAL_STACK.map((row) => (
                        <tr key={`${row.layer}-${row.tool}`} className="align-top">
                          <td className="py-3 pl-3 pr-4 text-neutral-500 whitespace-nowrap">
                            {row.layer}
                          </td>
                          <td className="py-3 px-4 font-medium text-neutral-900 whitespace-nowrap">
                            {row.tool}
                          </td>
                          <td className="py-3 px-4 font-mono text-xs tabular-nums text-neutral-700">
                            {row.freeAllowance}
                          </td>
                          <td
                            className={`py-3 pl-4 pr-3 text-right font-mono text-xs font-semibold whitespace-nowrap ${
                              row.tier === 'primary' || row.tier === 'required'
                                ? 'text-emerald-900'
                                : row.tier === 'limited'
                                  ? 'text-amber-800'
                                  : 'text-neutral-400'
                            }`}
                          >
                            {row.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="max-w-2xl rounded-md border border-neutral-200 bg-neutral-50 p-5">
                  <h3 className="font-serif text-base font-medium text-neutral-900">
                    10.4 What This Stack Cannot Do
                  </h3>
                  <ul className="mt-2.5 list-disc pl-5 space-y-1 text-sm text-neutral-700">
                    <li>Offer COD on our site</li>
                    <li>Handle payments or shipping</li>
                    <li>
                      Provide native affiliate links for TikTok Shop, Temu, Shopee, Lazada, Alibaba, Taobao (requires official APIs later)
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* SECTION 11: IMMEDIATE NEXT STEPS */}
            <section id="next-steps" className="scroll-mt-24">
              <SectionHeader
                number="11"
                title="Immediate Next Steps (Ordered)"
                subtitle="Click any step to mark progress locally as we execute."
              />

              <div className="max-w-3xl">
                <div className="mb-3 flex items-center justify-between text-xs font-mono tabular-nums text-neutral-500">
                  <span>
                    {completedSteps.length} / {NEXT_STEPS.length} steps checked
                  </span>
                  {completedSteps.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setCompletedSteps([])}
                      className="hover:text-neutral-900 underline underline-offset-4 no-print"
                    >
                      Clear checkboxes
                    </button>
                  )}
                </div>

                <ol className="divide-y divide-neutral-200 border-t border-b border-neutral-200">
                  {NEXT_STEPS.map((step, idx) => {
                    const done = completedSteps.includes(idx);
                    return (
                      <li key={step}>
                        <button
                          type="button"
                          onClick={() => toggleStep(idx)}
                          className="flex w-full items-start gap-4 py-3.5 px-2 text-left hover:bg-neutral-50 transition-colors focus-visible:outline-2 focus-visible:outline-emerald-900"
                        >
                          <span
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs transition-colors ${
                              done
                                ? 'border-emerald-900 bg-emerald-950 text-white'
                                : 'border-neutral-300 bg-white text-transparent'
                            }`}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </span>
                          <span className="font-mono text-xs text-neutral-400 pt-0.5 shrink-0">
                            0{idx + 1}
                          </span>
                          <span
                            className={`text-sm leading-relaxed ${
                              done ? 'line-through text-neutral-400' : 'text-neutral-800'
                            }`}
                          >
                            {step}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </section>

            {/* SECTION 12: PERSISTENT HARD CONSTRAINTS */}
            <section id="hard-constraints" className="scroll-mt-24">
              <SectionHeader
                number="12"
                title="Persistent Hard Constraints (Never Forget)"
                subtitle="Eleven non-negotiable guardrails that remain true regardless of how fast we build."
              />

              <ol className="grid grid-cols-1 gap-3 md:grid-cols-2 max-w-4xl">
                {HARD_CONSTRAINTS.map((constraint, idx) => (
                  <li
                    key={constraint}
                    className="flex gap-3.5 rounded-md border border-neutral-200 bg-white p-4 text-sm leading-relaxed text-neutral-800"
                  >
                    <span className="font-mono text-xs font-medium text-neutral-400 tabular-nums pt-0.5 shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span>{constraint}</span>
                  </li>
                ))}
              </ol>
            </section>

            {/* SECTION 13: WIN / LOSE SCORECARD */}
            <section id="scorecard" className="scroll-mt-24">
              <SectionHeader
                number="13"
                title="Win / Lose Scorecard — Every Major Decision"
                subtitle="Honest trade-offs for all 16 strategic, technical, and Pakistan-specific calls."
              />

              <div className="mb-4 flex flex-wrap items-center gap-1 rounded-md bg-neutral-100 p-1 w-fit no-print">
                {(['All', 'Strategy', 'Stack', 'Pakistan & Tax'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setScorecardFilter(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                      scorecardFilter === cat
                        ? 'bg-white text-neutral-900 shadow-xs'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="overflow-x-auto border-t border-b border-neutral-200">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50/80 text-xs font-medium text-neutral-500">
                      <th className="py-3 pl-3 pr-4 w-56">Decision</th>
                      <th className="py-3 px-4 text-emerald-900">Profit / Win</th>
                      <th className="py-3 pl-4 pr-3 text-amber-900">Loss / Lose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {filteredScorecard.map((row) => (
                      <tr key={row.decision} className="align-top">
                        <td className="py-3.5 pl-3 pr-4 font-medium text-neutral-900">
                          {row.decision}
                        </td>
                        <td className="py-3.5 px-4 text-neutral-700 leading-relaxed">
                          {row.profitWin}
                        </td>
                        <td className="py-3.5 pl-4 pr-3 text-neutral-600 leading-relaxed">
                          {row.lossLose}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* SECTION 15: DECISIONS I NEED FROM YOU */}
            <section id="decisions" className="scroll-mt-24">
              <SectionHeader
                number="15"
                title="Decisions I Need From You"
                subtitle="Before we start building, I need your agreement or pushback on these 6 items. Select your choices and copy the summary straight back to Instagram."
              />

              <DecisionSheet
                answers={decisions}
                onUpdate={updateDecision}
                onReset={() => setDecisions({})}
              />
            </section>
          </main>
        </div>
      </div>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-neutral-200 bg-neutral-50/70 py-10 mt-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 text-xs text-neutral-500">
          <div className="space-y-1">
            <p className="font-medium text-neutral-800">
              End of Handoff Document · Version 2.0 (Ground-Truthed)
            </p>
            <p>Status: Ready for partner review and build kickoff.</p>
          </div>
          <div className="flex items-center gap-5 no-print">
            <button
              type="button"
              onClick={() => openGlossaryWith('')}
              className="hover:text-neutral-900 underline underline-offset-4"
            >
              Quick Glossary
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="hover:text-neutral-900 underline underline-offset-4"
            >
              Print / Save PDF
            </button>
            <a href="#top" className="hover:text-neutral-900 underline underline-offset-4">
              Back to Top
            </a>
          </div>
        </div>
      </footer>

      {/* Floating Quick Glossary Drawer */}
      <GlossaryDrawer
        open={glossaryDrawerOpen}
        onClose={() => setGlossaryDrawerOpen(false)}
        initialQuery={glossaryDrawerQuery}
      />
    </div>
  );
}
