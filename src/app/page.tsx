'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800/70 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center space-x-3">
            <div className="h-7 w-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center text-white font-bold text-xs">
              LA
            </div>
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
    </div>
  );
}

function FormatBadge({ name, type }: { name: string; type: 'bidirectional' | 'export-only' }) {
  const isExportOnly = type === 'export-only';
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border ${
        isExportOnly
          ? 'bg-gray-800 border-gray-600 text-gray-400'
          : 'bg-indigo-600/20 border-indigo-500/40 text-indigo-200'
      }`}
    >
      {name}
      {isExportOnly && (
        <span className="ml-1 text-gray-500 italic">sadece dışa aktarım</span>
      )}
    </span>
  );
}