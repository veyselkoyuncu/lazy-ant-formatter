'use client';

import { useState } from 'react';
import { CsvAdapter } from '@/lib/adapters/csv';
import { ExcelAdapter } from '@/lib/adapters/excel';
import { JsonRow, ColumnMapping } from '@/lib/adapters/column';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [sourceFormat, setSourceFormat] = useState<'csv' | 'excel' | 'json' | ''>('');
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [targetFormat, setTargetFormat] = useState<'csv' | 'excel' | 'json'>('json');
  const [convertedData, setConvertedData] = useState<JsonRow[] | string>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const csvAdapter = new CsvAdapter();
  const excelAdapter = new ExcelAdapter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setError(null);
      setDownloadUrl(null);
      
      const name = selectedFile.name.toLowerCase();
      if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
        setSourceFormat('excel');
      } else if (name.endsWith('.csv') || name.endsWith('.tsv')) {
        setSourceFormat('csv');
      } else if (name.endsWith('.json')) {
        setSourceFormat('json');
      } else {
        setSourceFormat('');
        setError('Unsupported format. Use CSV, XLSX, or JSON');
      }
    }
  };

  const handleConvert = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      let data: JsonRow[];
      let mappings: ColumnMapping[] = [];
      
      if (sourceFormat === 'json') {
        const text = await file.text();
        data = JSON.parse(text);
      } else {
        if (sourceFormat === 'excel') {
          data = await excelAdapter.toJson(file);
        } else {
          data = await csvAdapter.toJson(file);
        }
        const sourceAdapter = sourceFormat === 'excel' ? excelAdapter : csvAdapter;
        mappings = sourceAdapter.getColumnMappings(data);
        setColumnMappings(mappings);
      }
      
      if (targetFormat === 'json') {
        setConvertedData(data);
        setDownloadUrl(null);
      } else {
        if (targetFormat === 'csv') {
          const csvResult = await csvAdapter.toCsv(data);
          setConvertedData(csvResult);
          setDownloadUrl(URL.createObjectURL(new Blob([csvResult], { type: 'text/csv' })));
        } else {
          const excelResult = await excelAdapter.toExcel(data);
          setDownloadUrl(URL.createObjectURL(excelResult));
          setConvertedData([]);
        }
      }
    } catch (err: unknown) {
      console.error('Conversion error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during conversion');
      setConvertedData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTargetFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTargetFormat(e.target.value as 'csv' | 'excel' | 'json');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-medium">
              LA
            </div>
            <div className="text-lg font-semibold whitespace-nowrap">
              Lazy Ant Formatter
            </div>
          </div>
          <nav className="hidden md:flex space-x-4">
            <a href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Docs
            </a>
            <a href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              GitHub
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            CSV ve Excel dosyalarını saniyeler içinde JSON&#39;a çevir
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Akıllı sütun eşleme ile format dönüşümlerini basitleştirin. 
            Veri analisti, geliştirici ve iş analisti için tasarlandı.
          </p>
          
          {/* File Upload Area */}
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-12 hover:border-gray-500 transition-colors">
            <label 
              htmlFor="file-upload" 
              className="block cursor-pointer"
              onClick={() => {
                const input = document.getElementById('file-upload') as HTMLInputElement;
                if (input) input.click();
              }}
            >
              <div className="space-y-4 text-center">
                <div className="flex items-center justify-center space-x-3">
                  <div className="h-10 w-10 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400">
                    📁
                  </div>
                  <span className="text-lg font-medium">
                    Dosya seçmek için tıklayın
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  CSV, XLSX, XLS, JSON, TSV desteklenir
                </p>
                <p className="text-xs text-gray-500">
                  Maksimum dosya boyutu: 10MB
                </p>
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv,.xlsx,.xls,.json,.tsv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </label>
            
            {file && (
              <div className="mt-6 text-left">
                <div className="flex items-center space-x-4 p-3 bg-gray-800 rounded-lg">
                  <div className="flex-shrink-0 h-8 w-8 bg-indigo-500/20 rounded flex items-center justify-center text-indigo-400 text-sm">
                    {sourceFormat.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-400">
                      {Math.round(file.size / 1024)} KB
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {sourceFormat && (
            <>
              {/* Column Mappings Section */}
              {columnMappings.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-white mb-6">
                    Sütun Eşleşmeleri
                  </h2>
                  <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-gray-900">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Sütun Adı
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Algılanan Tip
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Dönüştürülecek Tip
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {columnMappings.map((mapping, index) => (
                          <tr key={index} className="hover:bg-gray-800/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                              {mapping.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className="px-2 py-1 bg-indigo-600/20 text-indigo-200 rounded-full text-xs font-medium">
                                {mapping.type.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <select
                                value={mapping.type}
onChange={(e) => {
                                  const newMappings = [...columnMappings];
                                  newMappings[index] = { ...mapping, type: e.target.value as ColumnMapping['type'] };
                                  setColumnMappings(newMappings);
                                }}
                                className="block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-sm font-medium text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                </div>
              )}
              
              {/* Target Format Selector */}
              <div className="mb-8">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <p className="text-sm font-medium text-gray-400">
                      Hedef Format
                    </p>
                  </div>
                  <div className="flex-1">
                    <select
                      value={targetFormat}
                      onChange={handleTargetFormatChange}
                      className="block w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-lg font-medium text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="json">JSON</option>
                      <option value="csv">CSV</option>
                      <option value="excel">Excel</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Convert Button */}
              <button
                onClick={handleConvert}
                disabled={!file || isLoading}
                className="w-full flex justify-center items-center py-4 px-6 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium text-white transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin h-4 w-4 border-indigo-200 border-t-2"></div>
                    <span>Dönüştürülüyor...</span>
                  </div>
                ) : (
                  <span>Dönüştür</span>
                )}
              </button>
            </>
          )}
          
          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-900/50 border border-red-700/50 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          {/* Results Section */}
          {!isLoading && convertedData && (
            <>
              {Array.isArray(convertedData) && convertedData.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-semibold text-white mb-6">
                    Sonuç Önizlemesi
                  </h2>
                  <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-900 sticky top-0 z-10">
                          <tr>
                            {Object.keys(convertedData[0] || {}).map((key, index) => (
                              <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                          {convertedData.slice(0, 20).map((row, rowIndex) => (
                            <tr key={rowIndex} className={rowIndex % 2 === 1 ? 'bg-gray-900/50' : 'bg-gray-800'}>
                              {Object.values(row).map((value, colIndex) => (
                                <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                                  {value === null || value === undefined ? '' : String(value)}
                                </td>
                              ))}
                            </tr>
                          ))}
                          {convertedData.length > 20 && (
                            <tr>
                              <td colSpan={Object.keys(convertedData[0] || {}).length} className="px-6 py-4 text-center text-gray-500 italic">
                                İlk 20 satır gösteriliyor. Toplam {convertedData.length} satır.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              
              {typeof convertedData === 'string' && (
                <div className="mt-8">
                  <h2 className="text-2xl font-semibold text-white mb-6">
                    Sonuç Önizlemesi
                  </h2>
                  <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                    <div className="p-6 h-96 overflow-auto">
                      <pre className="text-sm font-mono text-gray-200">{convertedData}</pre>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Download Button */}
              {downloadUrl && (
                <div className="mt-8">
                  <a
                    href={downloadUrl}
                    download={`converted.${targetFormat === 'csv' ? 'csv' : 'xlsx'}`}
                    className="w-full flex justify-center items-center py-4 px-6 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg font-medium text-white transition-colors"
                  >
                    {targetFormat.toUpperCase()} Dosyasını İndir
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}