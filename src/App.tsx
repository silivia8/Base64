import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileImage, 
  Binary, 
  Lock, 
  Info, 
  Code2, 
  ArrowRightLeft,
  Moon,
  Sun,
  Laptop
} from 'lucide-react';
import ImageToBase64 from './components/ImageToBase64';
import Base64ToImage from './components/Base64ToImage';
import { ActiveMode } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveMode>('to-base64');

  React.useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen font-sans bg-neutral-950 text-zinc-100 selection:bg-zinc-800 transition-colors duration-300">
      {/* Header Bar */}
      <header className="border-b border-zinc-900 bg-neutral-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-zinc-950 shadow-sm">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-md sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Base64 Image Converter
              </h1>
              <p className="text-[11px] font-medium text-zinc-400">
                100% Client-Side Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Real-time secure indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/20 text-emerald-400 text-xs font-semibold border border-emerald-950/40">
              <Lock className="w-3.5 h-3.5" />
              Offline Safe • Direct Privacy
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12 flex flex-col space-y-8" id="main-content">
        {/* Intro Section */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300 rounded-full border border-zinc-700/50">
            Utility Workspace
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Transform Images instantly with Base64
          </h2>
          <p className="text-sm sm:text-md text-zinc-400 leading-relaxed">
            Drag files to encode them into rich text formats, or paste complex strings to reconstruct beautiful images. Done entirely inside your browser for zero latency and supreme data privacy.
          </p>
        </div>

        {/* Tab Controls Bar */}
        <div className="max-w-md mx-auto w-full bg-neutral-900 border border-zinc-805 p-1 rounded-2xl flex shadow-xs">
          <button
            onClick={() => setActiveTab('to-base64')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'to-base64'
                ? 'bg-zinc-100 text-zinc-900 shadow-xs'
                : 'text-zinc-400 hover:bg-neutral-800/60'
            }`}
            id="tab-encoder"
          >
            <FileImage className="w-4 h-4" />
            Image to Base64
          </button>
          <button
            onClick={() => setActiveTab('to-image')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'to-image'
                ? 'bg-zinc-100 text-zinc-900 shadow-xs'
                : 'text-zinc-400 hover:bg-neutral-800/60'
            }`}
            id="tab-decoder"
          >
            <Binary className="w-4 h-4" />
            Base64 to Image
          </button>
        </div>

        {/* Dynamic Mode Render Box */}
        <div className="bg-neutral-950/20 rounded-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, cubicBezier: [0.16, 1, 0.3, 1] }}
            >
              {activeTab === 'to-base64' ? <ImageToBase64 /> : <Base64ToImage />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Interactive FAQ / Educational Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-zinc-800">
          <div className="bg-neutral-900 border border-zinc-800/70 rounded-xl p-5 space-y-2">
            <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              Is it completely private?
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Yes, absolutely. The conversion mechanism executes 100% on your device using standard HTML5 file APIs. Your media resources never touch a web server or database. Feel free to use it offline!
            </p>
          </div>
          <div className="bg-neutral-900 border border-zinc-800/70 rounded-xl p-5 space-y-2">
            <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-400" />
              What is a Data URL?
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              A Data URL prepends a standard Base64 string with format headers like <code>data:image/png;base64,</code>. This instructs browsers to render the inline raw character sequence directly as an image element!
            </p>
          </div>
          <div className="bg-neutral-900 border border-zinc-800/70 rounded-xl p-5 space-y-2">
            <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <Info className="w-4 h-4 text-zinc-405" />
              Excellent Optimization
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Our text-area renders are virtualized and capped for large assets, preventing UI performance lag on heavy image loads while delivering full, uncapped files on copier/downloader events.
            </p>
          </div>
        </div>
      </main>

      {/* Modern footer with absolute privacy values */}
      <footer className="border-t border-zinc-900 bg-neutral-950/40 py-8 text-center text-xs text-zinc-400 space-y-2">
        <p className="font-semibold flex items-center justify-center gap-1">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          Offline-First Built with React • 100% Secure Local Execution
        </p>
        <p>
          Designed for developers seeking ultra-speed, local converter performance without visual noise.
        </p>
      </footer>
    </div>
  );
}
