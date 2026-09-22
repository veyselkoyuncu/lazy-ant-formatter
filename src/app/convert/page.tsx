'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CsvAdapter } from '@/lib/adapters/csv';
import { TsvAdapter } from '@/lib/adapters/tsv';
import { XmlAdapter } from '@/lib/adapters/xml';
import { YamlAdapter } from '@/lib/adapters/yaml';
import { SqlExporter } from '@/lib/exporters/sql';
import { MarkdownExporter } from '@/lib/exporters/markdown';
import { ExcelAdapter } from '@/lib/adapters/excel';
import { JsonRow, ColumnMapping } from '@/lib/adapters/column';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [sourceFormat, setSourceFormat] = useState<'csv' | 'excel' | 'tsv' | 'xml' | 'json' | ''>('');
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [targetFormat, setTargetFormat] = useState<'csv' | 'excel' | 'tsv' | 'xml' | 'yaml' | 'sql' | 'markdown' | 'json'>('json');
  const [convertedData, setConvertedData] = useState<JsonRow[] | string>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [jsonView, setJsonView] = useState<'table' | 'json'>('table');

  const csvAdapter = new CsvAdapter();
  const tsvAdapter = new TsvAdapter();
  const xmlAdapter = new XmlAdapter();
  const yamlAdapter = new YamlAdapter();
  const sqlExporter = new SqlExporter();
  const markdownExporter = new MarkdownExporter();
  const excelAdapter = new ExcelAdapter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setError(null);
      setDownloadUrl(null);
      setConvertedData([]);
      setColumnMappings([]);
      
      const name = selectedFile.name.toLowerCase();
      if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
        setSourceFormat('excel');
      } else if (name.endsWith('.csv')) {
        setSourceFormat('csv');
      } else if (name.endsWith('.tsv')) {
        setSourceFormat('tsv');
      } else if (name.endsWith('.xml')) {
        setSourceFormat('xml');
      } else if (name.endsWith('.json')) {
        setSourceFormat('json');
      } else {
        setSourceFormat('');
        setError('Desteklenmeyen format. CSV, TSV, XML, XLSX veya JSON kullanın');
      }
    }
  };

  const handleConvert = async () => {
    if (!file) {
      setError('Lütfen önce bir dosya seçin');
      return;
    }

    setIsLoading(true);
    setError(null);
    setColumnMappings([]);
    
    try {
      let data: JsonRow[];
      let mappings: ColumnMapping[] = [];
      
      if (sourceFormat === 'json') {
        const text = await file.text();
        data = JSON.parse(text);
      } else {
        if (sourceFormat === 'excel') {
          data = await excelAdapter.toJson(file);
        } else if (sourceFormat === 'tsv') {
          data = await tsvAdapter.toJson(file);
        } else if (sourceFormat === 'xml') {
          data = await xmlAdapter.toJson(file);
        } else {
          data = await csvAdapter.toJson(file);
        }
        const sourceAdapter = sourceFormat === 'excel' ? excelAdapter : sourceFormat === 'tsv' ? tsvAdapter : sourceFormat === 'xml' ? xmlAdapter : csvAdapter;
        mappings = sourceAdapter.getColumnMappings(data);
        setColumnMappings(mappings);
      }
      
      if (targetFormat === 'json') {
        setConvertedData(data);
        setDownloadUrl(null);
        setJsonView('table');
      } else {
        if (targetFormat === 'csv') {
          const csvResult = await csvAdapter.toCsv(data);
          setConvertedData(csvResult);
          setDownloadUrl(URL.createObjectURL(new Blob([csvResult], { type: 'text/csv' })));
          setJsonView('table');
        } else if (targetFormat === 'tsv') {
          const tsvResult = await tsvAdapter.toTsv(data);
          setConvertedData(tsvResult);
          setDownloadUrl(URL.createObjectURL(new Blob([tsvResult], { type: 'text/tab-separated-values' })));
          setJsonView('table');
        } else if (targetFormat === 'xml') {
          const xmlResult = await xmlAdapter.toXml(data);
          setDownloadUrl(URL.createObjectURL(new Blob([xmlResult], { type: 'application/xml' })));
          setConvertedData([]);
          setJsonView('table');
        } else if (targetFormat === 'yaml') {
          const yamlResult = await yamlAdapter.toYaml(data);
          setConvertedData(yamlResult);
          setDownloadUrl(URL.createObjectURL(new Blob([yamlResult], { type: 'text/yaml' })));
          setJsonView('table');
        } else if (targetFormat === 'sql') {
          const sqlResult = sqlExporter.export(data);
          setConvertedData(sqlResult);
          setDownloadUrl(URL.createObjectURL(new Blob([sqlResult], { type: 'text/plain' })));
          setJsonView('table');
        } else if (targetFormat === 'markdown') {
          const mdResult = markdownExporter.export(data);
          setConvertedData(mdResult);
          setDownloadUrl(URL.createObjectURL(new Blob([mdResult], { type: 'text/markdown' })));
          setJsonView('table');
        } else {
          const excelResult = await excelAdapter.toExcel(data);
          setDownloadUrl(URL.createObjectURL(excelResult));
          setConvertedData([]);
          setJsonView('table');
        }
      }
    } catch (err: unknown) {
      console.error('Conversion error:', err);
      setError(err instanceof Error ? err.message : 'Dönüştürme sırasında bir hata oluştu');
      setConvertedData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTargetFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTargetFormat(e.target.value as 'csv' | 'excel' | 'tsv' | 'xml' | 'yaml' | 'sql' | 'markdown' | 'json');
  };

  const handleCopyJson = () => {
    if (typeof convertedData === 'string') {
      navigator.clipboard.writeText(convertedData).catch(() => {});
    } else {
      navigator.clipboard.writeText(JSON.stringify(convertedData, null, 2)).catch(() => {});
    }
  };

  const handleDownloadJson = () => {
    let content: string;
    if (typeof convertedData === 'string') {
      content = convertedData;
    } else {
      content = JSON.stringify(convertedData, null, 2);
    }
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const highlightJson = (json: string): React.ReactNode => {
    const escaped = json
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const highlighted = escaped.replace(
      /("(?:[^"\\]|\\.)*")(\s*:)?|(\d+\.?\d*)|(\btrue\b|\bfalse\b|\bnull\b)/g,
      (match, str, colon, num, boolNull) => {
        if (str) return `<span class="text-green-400">${str}</span>${colon || ''}`;
        if (num) return `<span class="text-orange-400">${num}</span>`;
        if (boolNull) return `<span class="text-yellow-400">${boolNull}</span>`;
        return match;
      }
    );
    return <pre className="text-sm font-mono text-gray-200 whitespace-pre" dangerouslySetInnerHTML={{ __html: highlighted }} />;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800/70 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <Link href="/" className="flex items-center space-x-3">
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
            <span className="text-base font-semibold tracking-tight">Lazy Ant Formatter</span>
          </Link>
          <nav className="hidden md:flex space-x-5">
            <a href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Docs</a>
            <a href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">GitHub</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-3">
            Dosyalarını seç, formatını değiştir
          </h1>
          <p className="text-base text-gray-300 mb-8 max-w-xl mx-auto leading-relaxed">
            CSV, Excel, XML, YAML, TSV ve JSON arasında akıllı sütun eşleme ile hızlıca dönüşüm yapın.
          </p>
          
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 hover:border-indigo-400 hover:bg-gray-800/50 transition-all cursor-pointer group">
            <label htmlFor="file-upload" className="block cursor-pointer">
              <div className="space-y-3 text-center">
                <div className="flex items-center justify-center space-x-3">
                  <div className="h-9 w-9 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/30 group-hover:text-indigo-300 transition-all duration-200">
                    📁
                  </div>
                  <span className="text-base font-medium">Dosyanı sürükle veya seç</span>
                </div>
                <p className="text-xs text-gray-400">CSV, TSV, XML, XLSX, XLS, JSON desteklenir · Maksimum 10MB</p>
                <input
                      id="file-upload"
                      type="file"
                      accept=".csv,.xlsx,.xls,.xml,.json,.tsv"
                      onChange={handleFileChange}
                      className="hidden"
                    />
              </div>
            </label>
            
            {file && (
              <div className="mt-4 text-left">
                <div className="flex items-center space-x-3 p-2 bg-gray-800 rounded-lg w-fit">
                  <span className="px-2 py-0.5 bg-indigo-600/30 text-indigo-200 rounded text-xs font-mono font-bold">
                    {sourceFormat.toUpperCase()}
                  </span>
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-xs text-gray-400">{Math.round(file.size / 1024)} KB</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {sourceFormat && columnMappings.length > 0 && (
            <div className="bg-gray-800 rounded-lg border border-gray-700">
              <div className="px-4 py-3 border-b border-gray-700">
                <h2 className="text-sm font-semibold text-white">Sütun Eşleşmeleri</h2>
              </div>
              <p className="px-4 py-2 text-xs text-gray-500 italic">Sütun tiplerini düzenleyerek dönüşümü özelleştirin</p>
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Sütun</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Algılanan</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Dönüştür</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {columnMappings.map((mapping, index) => (
                    <tr key={index} className="hover:bg-gray-800/70 transition-colors">
                      <td className="px-4 py-2.5 font-mono text-sm">{mapping.name}</td>
                      <td className="px-4 py-2.5">
                        <span className="px-2 py-0.5 bg-indigo-600/20 text-indigo-200 rounded-full text-xs font-medium">
                          {mapping.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <select
                          value={mapping.type}
                          onChange={(e) => {
                            const newMappings = [...columnMappings];
                            newMappings[index] = { ...mapping, type: e.target.value as ColumnMapping['type'] };
                            setColumnMappings(newMappings);
                          }}
                          className="block w-full px-2 py-1.5 bg-gray-900 border border-gray-600 rounded text-xs font-medium text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="text">Text</option>
                          <option value="number">Number</option>
                          <option value="email">Email</option>
                          <option value="phone">Phone</option>
                          <option value="date">Date</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Target Format + Convert */}
          <div className="flex items-center space-x-4">
            <select
              value={targetFormat}
              onChange={handleTargetFormatChange}
              className="block px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-sm font-medium text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="tsv">TSV</option>
              <option value="xml">XML</option>
              <option value="yaml">YAML</option>
              <option value="excel">Excel</option>
              <option value="sql">SQL (sadece dışa aktarım)</option>
              <option value="markdown">Markdown (sadece dışa aktarım)</option>
            </select>
            <button
              onClick={handleConvert}
              disabled={!file || isLoading}
              className="flex-1 flex justify-center items-center py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? 'Dönüştürülüyor...' : 'Dönüştür'}
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-900/40 border border-red-700/50 rounded-lg text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Results Section */}
          {!isLoading && convertedData && targetFormat === 'json' && (
            <div className="bg-gray-800 rounded-lg border border-gray-700">
              <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">Sonuç Önizlemesi</h2>
                <div className="flex items-center space-x-2">
                  <div className="flex bg-gray-900 rounded p-0.5">
<button
                       onClick={() => setJsonView('table')}
                       className={`px-3 py-1 rounded text-xs font-medium transition-all duration-200 ${
                         jsonView === 'table' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                       }`}
                     >
                       Tablo
                     </button>
                     <button
                       onClick={() => setJsonView('json')}
                       className={`px-3 py-1 rounded text-xs font-medium transition-all duration-200 ${
                         jsonView === 'json' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                       }`}
                     >
                       Ham JSON
                     </button>
                  </div>
<button
                     onClick={handleCopyJson}
                     className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                     title="Kopyala"
                   >
                     📋 Kopyala
                   </button>
                   <button
                     onClick={handleDownloadJson}
                     className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg"
                     title="İndir .json"
                   >
                     ⬇️ İndir
                   </button>
                </div>
              </div>
              
              {jsonView === 'table' ? (
                <div className="overflow-x-auto max-h-96 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-900 sticky top-0">
                      <tr>
                        {Object.keys((convertedData as JsonRow[])[0] || {}).map((key, index) => (
                          <th key={index} className="px-4 py-2.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {(convertedData as JsonRow[]).slice(0, 20).map((row, rowIndex) => (
                        <tr key={rowIndex} className={rowIndex % 2 === 1 ? 'bg-gray-900/50' : 'bg-gray-800/50'}>
                          {Object.values(row).map((value, colIndex) => (
                            <td key={colIndex} className="px-4 py-2.5 whitespace-nowrap text-sm text-gray-300">
                              {value === null || value === undefined ? '' : String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                      {(convertedData as JsonRow[]).length > 20 && (
                        <tr>
<td colSpan={Object.keys((convertedData as JsonRow[])[0] || {}).length} className="px-4 py-3 text-center text-gray-500 italic text-xs">
                             🐜 İlk 20 satır gösteriliyor. Toplam {(convertedData as JsonRow[]).length} satır var, daha fazlası için indir!
                           </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 max-h-96 overflow-y-auto bg-gray-900 rounded-b-lg">
                  {highlightJson(JSON.stringify(convertedData, null, 2))}
                </div>
              )}
            </div>
          )}

          {/* CSV/Excel Results */}
          {!isLoading && typeof convertedData === 'string' && (
            <div className="bg-gray-800 rounded-lg border border-gray-700">
              <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">Sonuç Önizlemesi</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyJson}
                    className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded text-xs font-medium transition-colors"
                    title="Kopyala"
                  >
                    📋
                  </button>
<a
                     href={downloadUrl!}
                     download={`converted.${targetFormat === 'csv' ? 'csv' : 'xlsx'}`}
                     className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg"
                     title="İndir"
                   >
                     ⬇️ İndir
                   </a>
                </div>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto bg-gray-900 rounded-b-lg">
                <pre className="text-sm font-mono text-gray-200 whitespace-pre">{convertedData}</pre>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
