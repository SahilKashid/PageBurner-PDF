import React, { useState, useCallback } from 'react';
import { Layout } from './components/Layout';
import { FileUpload } from './components/FileUpload';
import { processPdf } from './utils/pdfProcessor';
import { Loader2, Download, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

const getDownloadName = (filename: string) => {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) return `${filename}-numbered.pdf`;
  const name = filename.substring(0, lastDotIndex);
  const ext = filename.substring(lastDotIndex);
  return `${name}-numbered${ext}`;
};

const App: React.FC = () => {
  const [state, setState] = useState<{
    file: File | null;
    processedUrl: string | null;
    isProcessing: boolean;
    error: string | null;
  }>({
    file: null,
    processedUrl: null,
    isProcessing: false,
    error: null,
  });

  const processFile = async (file: File) => {
    setState(prev => ({ ...prev, file, isProcessing: true, error: null }));

    try {
      const arrayBuffer = await file.arrayBuffer();
      const processedPdfBytes = await processPdf(arrayBuffer);
      const blob = new Blob([processedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      setState(prev => ({ ...prev, processedUrl: url, isProcessing: false }));
    } catch (err) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: "Failed to process PDF. It may be password protected." 
      }));
    }
  };

  const handleReset = useCallback(() => {
    if (state.processedUrl) URL.revokeObjectURL(state.processedUrl);
    setState({ file: null, processedUrl: null, isProcessing: false, error: null });
  }, [state.processedUrl]);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-6 py-12 md:py-20">
        <div className="text-center mb-8 space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
            Number your <span className="text-neutral-600">pages.</span>
          </h1>
        </div>

        <div className="bg-neutral-950 rounded-2xl shadow-2xl border border-neutral-900 overflow-hidden ring-1 ring-white/5 transition-all duration-500 relative">
          
          {/* Upload State */}
          {!state.file && (
            <div className="p-6 md:p-8 animate-in fade-in zoom-in duration-300">
              <FileUpload 
                onFileSelect={processFile} 
                onError={(msg) => setState(prev => ({ ...prev, error: msg }))} 
              />
              {state.error && (
                <div className="mt-4 flex items-center justify-center gap-2 text-red-400 text-sm font-medium animate-in slide-in-from-top-2">
                  <AlertCircle className="w-4 h-4" />
                  {state.error}
                </div>
              )}
            </div>
          )}

          {/* Processing State */}
          {state.isProcessing && state.file && (
            <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-300">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-white/10 blur-xl rounded-full"></div>
                <Loader2 className="w-10 h-10 text-white animate-spin relative z-10" />
              </div>
              <h3 className="text-lg font-medium text-white tracking-tight mb-1">Processing</h3>
              <p className="text-neutral-500 text-sm max-w-xs truncate">{state.file.name}</p>
            </div>
          )}

          {/* Success State */}
          {state.processedUrl && !state.isProcessing && state.file && (
            <div className="p-10 flex flex-col items-center justify-center text-center w-full animate-in fade-in zoom-in duration-300">
              <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Ready</h3>
              <p className="text-neutral-500 mb-8 text-sm flex items-center gap-2">
                 <span className="max-w-[200px] truncate">{getDownloadName(state.file.name)}</span>
              </p>

              <div className="flex flex-col w-full max-w-xs gap-3">
                <a
                  href={state.processedUrl}
                  download={getDownloadName(state.file.name)}
                  className="flex items-center justify-center gap-3 px-6 py-3.5 text-sm font-bold text-black bg-white rounded-xl hover:bg-neutral-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </a>
                
                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-neutral-500 bg-transparent hover:text-white transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Start Over
                </button>
              </div>
            </div>
          )}
          
          {/* Error State (Post-Processing) */}
          {state.error && state.file && !state.isProcessing && (
             <div className="p-10 flex flex-col items-center justify-center text-center w-full animate-in fade-in zoom-in duration-300">
                <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
                  <AlertCircle className="w-7 h-7 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Processing Failed</h3>
                <p className="text-neutral-500 text-sm mb-6">{state.error}</p>
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-xl bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors border border-neutral-800"
                >
                  Try Again
                </button>
             </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default App;