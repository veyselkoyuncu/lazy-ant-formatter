'use client';

import Link from 'next/link';

const antLogo = (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect width="32" height="32" rx="6" fill="#4f46e5"/>
    <circle cx="8" cy="14" r="2.5" fill="white"/>
    <circle cx="16" cy="12" r="2.5" fill="white"/>
    <circle cx="24" cy="14" r="2.5" fill="white"/>
    <circle cx="10" cy="22" r="2" fill="white"/>
    <circle cx="22" cy="22" r="2" fill="white"/>
    <path d="M8 14c2-2 4-2 8-2s6 0 16 0" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10 22c2 2 4 2 10 2s8 0 12 0" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800/70 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center space-x-3">
            {antLogo}
            <span className="text-base font-semibold tracking-tight">Lazy Ant Formatter</span>
          </div>
          <nav className="flex items-center space-x-5">
            <a href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Docs</a>
            <Link href="/convert" className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm font-medium transition-colors">
              Dönüştürmeye Başla
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            CSV, Excel, XML, YAML dosyalarını hızlıca dönüştürün
          </h1>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Lazy Ant Formatter, akıllı sütun eşleme ile format dönüşümlerini basitleştirir. CSV, Excel, XML, YAML, TSV ve JSON dosyalarını destekler.
          </p>

          {/* Supported Formats */}
          <div className="mb-12">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Desteklenen Formatlar</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <FormatBadge name="CSV" type="bidirectional" />
              <FormatBadge name="TSV" type="bidirectional" />
              <FormatBadge name="JSON" type="bidirectional" />
              <FormatBadge name="XML" type="bidirectional" />
              <FormatBadge name="YAML" type="bidirectional" />
              <FormatBadge name="Excel" type="bidirectional" />
              <FormatBadge name="SQL" type="export-only" />
              <FormatBadge name="Markdown" type="export-only" />
            </div>
          </div>

          <Link
            href="/convert"
            className="inline-flex items-center justify-center py-3 px-8 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold text-white transition-colors rounded-lg"
          >
            Dönüştürmeye Başla
          </Link>
        </div>
      </section>

      {/* Lazy Ant Mascot */}
      <div className="fixed bottom-4 right-4 pointer-events-none opacity-30 hover:opacity-50 transition-opacity">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <ellipse cx="24" cy="16" rx="8" ry="6" fill="#4f46e5" opacity="0.6"/>
          <circle cx="20" cy="14" r="2" fill="white" opacity="0.8"/>
          <circle cx="28" cy="14" r="2" fill="white" opacity="0.8"/>
          <path d="M16 20c-4 2-8 4-8 8M32 20c4 2 8 4 8 8" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
          <path d="M14 16c-4-2-8 0-10 4M34 16c4-2 8 0 10 4" stroke="#4f46e5" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

function FormatBadge({ name, type }: { name: string; type: 'bidirectional' | 'export-only' }) {
  const isExportOnly = type === 'export-only';
  const icon = <FormatIcon name={name} />;
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1.5 ${
        isExportOnly
          ? 'bg-gray-800 border-gray-600 text-gray-400'
          : 'bg-indigo-600/20 border-indigo-500/40 text-indigo-200'
      }`}
    >
      {icon}
      <span>{name}</span>
      {isExportOnly && (
        <span className="ml-1 text-gray-500 italic">sadece dışa aktarım</span>
      )}
    </span>
  );
}

function FormatIcon({ name }: { name: string }) {
  const iconClass = 'w-3 h-3';
  const icons: Record<string, React.ReactNode> = {
    CSV: <svg className={iconClass} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 2h12v12H2z" stroke="currentColor" strokeWidth="1.5"/><path d="M2 6h12M2 10h12M6 2v12M10 2v12" stroke="currentColor" strokeWidth="1.5"/></svg>,
    TSV: <svg className={iconClass} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 2h12v12H2z" stroke="currentColor" strokeWidth="1.5"/><path d="M2 8h12" stroke="currentColor" strokeWidth="1.5"/></svg>,
    JSON: <svg className={iconClass} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 2c-2 0-2 1-2 2v2c0 1-1 2-2 2 1 0 2 1 2 2v2c0 1 0 2 2 2M10 2c2 0 2 1 2 2v2c0 1 1 2 2 2-1 0-2 1-2 2v2c0 1 0 2-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    XML: <svg className={iconClass} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 3L1 8l3 5M12 3l3 5-3 5M9 3l-2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    YAML: <svg className={iconClass} viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="4" r="2" stroke="currentColor" strokeWidth="1.5"/><path d="M8 6v2m0 0l-2 4m2-4l2 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    Excel: <svg className={iconClass} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 2h10v12H3z" stroke="currentColor" strokeWidth="1.5"/><path d="M6 5l4 6M10 5l-4 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    SQL: <svg className={iconClass} viewBox="0 0 16 16" fill="none" aria-hidden="true"><ellipse cx="8" cy="4" rx="5" ry="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 4v4c0 1.1 2.2 2 5 2s5-.9 5-2V4M3 8v4c0 1.1 2.2 2 5 2s5-.9 5-2V8" stroke="currentColor" strokeWidth="1.5"/></svg>,
    Markdown: <svg className={iconClass} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 4h12v8H2z" stroke="currentColor" strokeWidth="1.5"/><path d="M4 12V7l2 2 2-2v5M10 7l2 2 2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  };

  return icons[name] || null;
}