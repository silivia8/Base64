import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Image as ImageIcon, 
  Download, 
  Check, 
  AlertTriangle, 
  RefreshCw, 
  Sparkles, 
  Maximize2,
  Trash2,
  HelpCircle,
  FileImage,
  Layers,
  Upload
} from 'lucide-react';
import { DecodedImage } from '../types';

export default function Base64ToImage() {
  const [inputText, setInputText] = useState('');
  const [decoded, setDecoded] = useState<DecodedImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customFilename, setCustomFilename] = useState('decoded-image');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTxtUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
      setError('Please upload a valid .txt file.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInputText(text);
      setIsProcessing(false);
    };
    reader.onerror = () => {
      setError('Error reading text file.');
      setIsProcessing(false);
    };
    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer?.files?.[0];
    if (file) {
      if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
        setError('Please drop a valid .txt file.');
        return;
      }
      setIsProcessing(true);
      setError(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setInputText(text);
        setIsProcessing(false);
      };
      reader.onerror = () => {
        setError('Error reading text file.');
        setIsProcessing(false);
      };
      reader.readAsText(file);
    }
  };

  // Guess MIME-type of raw base64 string based on common magic headers
  const guessMimeType = (rawStr: string): string => {
    const trimmed = rawStr.trim();
    if (trimmed.startsWith('iVBORw0KG')) return 'image/png';
    if (trimmed.startsWith('/9j/')) return 'image/jpeg';
    if (trimmed.startsWith('R0lGOD')) return 'image/gif';
    if (trimmed.startsWith('UklGR')) return 'image/webp';
    if (trimmed.startsWith('PHN2Zy') || trimmed.startsWith('PD94bW')) return 'image/svg+xml';
    if (trimmed.startsWith('AAABAA')) return 'image/x-icon';
    return 'image/png'; // Safe fallback
  };

  // Convert raw base64 string length to approximate byte size
  const estimateSizeInBytes = (base64Str: string): number => {
    const cleanStr = base64Str.replace(/=+$/, '');
    return Math.floor((cleanStr.length * 3) / 4);
  };

  // Reset states
  const handleClear = () => {
    setInputText('');
    setDecoded(null);
    setError(null);
  };

  // Trigger Sample Loaders
  const loadDemoSample = (type: 'star' | 'circle' | 'flag') => {
    setError(null);
    if (type === 'star') {
      // Small yellow star SVG inline base64 string
      const starSvgBase64 = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiIGZpbGw9IiNGNUJDMDUiPjxwYXRoIGQ9Ik0xMiAxNy4yN0wxOC4xOCAyMUwxNi41NCAxMy45N0wyMiA5LjI0TDE0LjgxIDguNjJMMTIgMkw5LjE5IDguNjJMMiA5LjI0TDcuNDYgMTMuOTdMNS44MiAyMUwxMiAxNy4yN1oiLz48L3N2Zz4=";
      setInputText(starSvgBase64);
    } else if (type === 'circle') {
      // A small blue circle PNG
      const circlePngBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAByklEQVR4nO2WsW6DMBRFDz9U7pSpU79m6pSpf6OfV7pknTr1Z9VJncpX9nSJZSgIDY6xAwg90hcJCmIee66vE/B7X8KxIsK3PPDOf6iEoyPijZcR6Zk8Efe0mbyI8S1vGZGEK0TshMv6fCI0pbeZ8ZUR2bXvN0V7fMub9gZp/vWv6B7f8vYWeeI/pP6U7pU66zUvMyIi7onpmeDbe/s/vY/uayzEuxGRb8A88r4Csh67IuY+9bIunh3+XF78I9DId8K9Z8gYI0XshB89m5HwzshmRER87XnCqT/Z/yB8M8IDvYisIe0yVtoF7a+6uLzIR4ZMyIiI3eI/mZ6PZpTshL99p35i7iT9H2YUMiNidIub7o+ZkSLeCH/Z3C97I+Y/GZmMCE/8iV7vX9G+L+RFRBvSgS9E+3b733ZETP1C3NuA/Kfb94VsREx9yDoi6Y+bV+09K2XmK6D+eP/T77f8n8pMxNSZ6f5b9C+0g6rG+e0T0zOR/h+6Z46I6X0G/G9FpMeIiGl6v/C9uPeYl6u9b9pPhHvyyN973mE9mK9O9VlX50i6N0XEvfD/W9zT0p1N/d6wDsw9fOfvvO+wHowP5qsreub/Ab6wFhV36YV3AAAAAElFTkSuQmCC";
      setInputText(circlePngBase64);
    } else if (type === 'flag') {
      // Standard Red-White check PNG pattern
      const flagPngBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAALElEQVR4nO3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAAAAAAAAAAAAAAAAAMBvLNoAAf3K6asAAAAASUVORK5CYII=";
      setInputText(flagPngBase64);
    }
  };

  // Process and decode the base64 input text
  useEffect(() => {
    const trimmedInput = inputText.trim();
    if (!trimmedInput) {
      setDecoded(null);
      setError(null);
      return;
    }

    setIsProcessing(true);
    setError(null);

    // Timeout to prevent intense freezing on massive typing
    const timer = setTimeout(() => {
      let finalDataUrl = trimmedInput;
      let isRaw = false;

      // Detect if user pasted standard HTML img tag or CSS background format instead of clean string
      if (trimmedInput.startsWith('<img') && trimmedInput.includes('src=')) {
        const srcMatch = trimmedInput.match(/src="([^"]+)"/);
        if (srcMatch && srcMatch[1]) {
          finalDataUrl = srcMatch[1];
        } else {
          setError('Detected an img tag, but failed to parse the "src" attribute.');
          setIsProcessing(false);
          return;
        }
      } else if (trimmedInput.startsWith('background-image:') || trimmedInput.startsWith('background:')) {
        const urlMatch = trimmedInput.match(/url\(['"]?([^'")]+)['"]?\)/);
        if (urlMatch && urlMatch[1]) {
          finalDataUrl = urlMatch[1];
        } else {
          setError('Detected CSS background, but failed to parse the "url()" parameter.');
          setIsProcessing(false);
          return;
        }
      } else if (trimmedInput.startsWith('![') && trimmedInput.includes('](')) {
        const mdMatch = trimmedInput.match(/\(([^)]+)\)/);
        if (mdMatch && mdMatch[1]) {
          finalDataUrl = mdMatch[1];
        } else {
          setError('Detected Markdown markup, but failed to extract data link.');
          setIsProcessing(false);
          return;
        }
      }

      // Check if it's already a complete Data URL
      if (!finalDataUrl.startsWith('data:')) {
        // If it starts with a base64 signature, construct data URL
        const estimatedMime = guessMimeType(finalDataUrl);
        // Ensure whitespace/newlines are stripped before prepending
        const cleanBase64 = finalDataUrl.replace(/\s/g, '');
        finalDataUrl = `data:${estimatedMime};base64,${cleanBase64}`;
        isRaw = true;
      } else {
        // Normalize space in complete Data URL strings
        const parts = finalDataUrl.split(',');
        if (parts.length > 1) {
          finalDataUrl = parts[0] + ',' + parts[1].replace(/\s/g, '');
        }
      }

      // Test loading the generated Data URL into an image
      const imageObj = new Image();
      imageObj.onload = () => {
        // Extract size
        const base64Data = finalDataUrl.split(',')[1] || '';
        const size = estimateSizeInBytes(base64Data);
        // Extract MIME
        const mimeMatch = finalDataUrl.match(/^data:([^;]+);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';

        setDecoded({
          width: imageObj.width,
          height: imageObj.height,
          sizeInBytes: size,
          mimeType: mimeType,
          dataUrl: finalDataUrl
        });
        setIsProcessing(false);
      };

      imageObj.onerror = () => {
        setError('Failed to render: pasted input is not a valid Base64 encoded image sequence. Ensure it is not corrupted or incomplete.');
        setDecoded(null);
        setIsProcessing(false);
      };

      imageObj.src = finalDataUrl;

    }, 250);

    return () => clearTimeout(timer);
  }, [inputText]);

  // Convert estimated size to human-readable text
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Convert MIME type to file extension
  const getExtensionFromMime = (mime: string): string => {
    if (mime.includes('png')) return 'png';
    if (mime.includes('jpeg') || mime.includes('jpg')) return 'jpg';
    if (mime.includes('svg')) return 'svg';
    if (mime.includes('webp')) return 'webp';
    if (mime.includes('gif')) return 'gif';
    if (mime.includes('icon') || mime.includes('x-icon')) return 'ico';
    return 'png'; // Safe standard fallback
  };

  const handleDownloadDecoded = () => {
    if (!decoded) return;
    const a = document.createElement('a');
    a.href = decoded.dataUrl;
    const extension = getExtensionFromMime(decoded.mimeType);
    // Sanitize user file name input
    const cleanName = customFilename.trim().replace(/[^a-zA-Z0-9-_]/g, '') || 'decoded-image';
    a.download = `${cleanName}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="decoder-section">
      {/* MONOSPACE INPUT LEFT PANEL */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
            <FileText className="w-4 h-4" />
            Paste Base64 Text
          </div>
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt"
              onChange={handleTxtUpload}
              className="hidden"
              id="txt-file-input"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-semibold text-zinc-400 hover:text-zinc-250 transition-colors flex items-center gap-1.5 cursor-pointer"
              id="upload-txt-btn"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload TXT
            </button>
            <span className="w-px h-3 bg-zinc-800" />
            <button
              type="button"
              onClick={handleClear}
              disabled={!inputText}
              className="text-xs font-semibold text-zinc-400 hover:text-red-400 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
              id="clear-decoder-btn"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset Space
            </button>
          </div>
        </div>

        <div className="relative flex-1 flex flex-col">
          <textarea
            aria-label="Paste Base64 string here"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            placeholder="Paste raw Base64 string, HTML Image tag, CSS background url, or complete Data URI here... (or drag and drop a .txt file here)"
            className={`w-full h-80 md:h-[400px] font-mono text-xs p-4 bg-zinc-950 border rounded-xl leading-relaxed focus:outline-hidden focus:ring-1 focus:ring-zinc-700 resize-none shadow-inner text-zinc-300 transition-all ${
              dragActive
                ? 'border-indigo-500 bg-indigo-950/20'
                : 'border-zinc-850'
            }`}
            id="base64-text-input-field"
          />

          {isProcessing && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-zinc-900 text-white rounded-lg px-2.5 py-1 text-[11px] font-medium shadow-xs border border-zinc-800 animate-pulse">
              <RefreshCw className="w-3 h-3 animate-spin text-zinc-400" />
              Parsing String...
            </div>
          )}
        </div>

        {/* Demo Tryables Area */}
        <div className="bg-zinc-950/40 rounded-xl p-3 border border-zinc-850 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-zinc-450 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            No Base64 handy? Load a sample:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => loadDemoSample('star')}
              className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 rounded-lg font-medium transition-all active:scale-95 cursor-pointer"
              id="sample-star-btn"
            >
              ⭐ Gold Star (SVG)
            </button>
            <button
              type="button"
              onClick={() => loadDemoSample('circle')}
              className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-755 text-zinc-300 rounded-lg font-medium transition-all active:scale-95 cursor-pointer"
              id="sample-circle-btn"
            >
              🔵 Blue Dot (PNG)
            </button>
            <button
              type="button"
              onClick={() => loadDemoSample('flag')}
              className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-755 text-zinc-300 rounded-lg font-medium transition-all active:scale-95 cursor-pointer"
              id="sample-flag-btn"
            >
              🏁 Checkered (PNG)
            </button>
          </div>
        </div>
      </div>

      {/* DYNAMIC RENDERING PREVIEW RIGHT PANEL */}
      <div className="flex flex-col space-y-4">
        <div className="text-sm font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4" />
          Decoded Graphic Render
        </div>

        <div className="flex-1 min-h-[300px] border border-zinc-805 rounded-2xl bg-neutral-900 p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
          <AnimatePresence mode="wait">
            {decoded ? (
              <motion.div
                key="decoded-graphic"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="w-full h-full flex flex-col items-center justify-between space-y-6"
                id="decoded-display-area"
              >
                {/* Graphics Area */}
                <div className="relative w-full flex-1 min-h-[220px] max-h-[280px] rounded-xl bg-zinc-950 border border-zinc-850 flex items-center justify-center p-4 overflow-auto shadow-inner group">
                  {/* Transparent checkerboard */}
                  <div 
                    className="absolute inset-0 opacity-10 bg-[length:16px_16px]"
                    style={{
                      backgroundImage: `radial-gradient(circle, #888 1.5px, transparent 1.5px), radial-gradient(circle, #888 1.5px, transparent 1.5px)`,
                      backgroundSize: '16px 16px',
                      backgroundPosition: '0 0, 8px 8px'
                    }}
                  />
                  <img
                    src={decoded.dataUrl}
                    alt="Pasted base64 rendered view"
                    className="relative max-w-full max-h-full object-contain rounded-lg shadow-xs group-hover:scale-102 transition-transform duration-300 select-none"
                    id="decoded-image-graphic"
                  />
                </div>

                {/* Diagnostics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-zinc-950 border border-zinc-850 rounded-xl p-3 w-full font-medium text-xs">
                  <div className="flex flex-col space-y-0.5 border-r border-zinc-850">
                    <span className="text-zinc-500 font-semibold uppercase text-[10px] tracking-wider">Dimensions</span>
                    <span className="text-zinc-150 font-mono font-bold">
                      {decoded.width} × {decoded.height}px
                    </span>
                  </div>
                  <div className="flex flex-col space-y-0.5 lg:border-r border-zinc-850 pl-1.5 lg:pl-0">
                    <span className="text-zinc-500 font-semibold uppercase text-[10px] tracking-wider">File Size</span>
                    <span className="text-zinc-150 font-mono font-bold">
                      {formatBytes(decoded.sizeInBytes)}
                    </span>
                  </div>
                  <div className="flex flex-col space-y-0.5 border-r border-zinc-850 border-t lg:border-t-0 pt-2 lg:pt-0 pl-0 lg:pl-1.5">
                    <span className="text-zinc-500 font-semibold uppercase text-[10px] tracking-wider">File Type</span>
                    <span className="text-zinc-150 font-mono uppercase bg-zinc-800 px-2 rounded-full inline-block max-w-[90px] text-center text-[11px]">
                      {decoded.mimeType.split('/')[1] || 'Inferred'}
                    </span>
                  </div>
                  <div className="flex flex-col space-y-0.5 border-t lg:border-t-0 pt-2 lg:pt-0 pl-1.5">
                    <span className="text-zinc-500 font-semibold uppercase text-[10px] tracking-wider">Aspect Ratio</span>
                    <span className="text-zinc-150 font-mono">
                      {(decoded.width / decoded.height).toFixed(2)}:1
                    </span>
                  </div>
                </div>

                {/* Filename configure and Action buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full border-t border-zinc-850 pt-3">
                  <div className="flex-1 flex items-center bg-zinc-950 border border-zinc-850 rounded-lg overflow-hidden group">
                    <span className="pl-3 pr-1 text-zinc-500 font-mono text-xs select-none">File:</span>
                    <input
                      type="text"
                      aria-label="Set custom download file name"
                      value={customFilename}
                      onChange={(e) => setCustomFilename(e.target.value)}
                      placeholder="filename-preset"
                      className="w-full text-xs font-semibold px-2 py-2 bg-transparent text-white border-none focus:outline-hidden"
                      id="custom-filename-input"
                    />
                    <span className="pr-3 text-zinc-450 font-mono text-xs select-none lowercase">
                      .{getExtensionFromMime(decoded.mimeType)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadDecoded}
                    className="px-6 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-semibold rounded-lg text-sm shadow-xs transition-colors active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer animate-none"
                    id="download-decoded-btn"
                  >
                    <Download className="w-4 h-4" />
                    Download File
                  </button>
                </div>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error-render"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center text-center p-6 space-y-3"
                id="decoder-error"
              >
                <div className="w-12 h-12 rounded-full bg-amber-950/20 text-amber-500 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-md font-semibold text-zinc-100">
                  Parsing Limitations Encountered
                </h3>
                <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
                  {error}
                </p>
                <p className="text-[11px] text-zinc-405 bg-zinc-950 border border-zinc-850 px-3 py-1.5 rounded-lg font-mono">
                  Tip: A valid Base64 string represents characters like A-Z, a-z, 0-9, +, /, and =.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="await-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center text-zinc-500 space-y-3"
                id="decoder-waiting-state"
              >
                <div className="w-14 h-14 rounded-2xl bg-zinc-950 border border-zinc-850 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-zinc-550" />
                </div>
                <div className="space-y-1">
                  <p className="text-zinc-300 font-semibold text-sm">
                    Awaiting Base64 String
                  </p>
                  <p className="text-xs text-zinc-450 max-w-xs leading-relaxed">
                    Paste encoded data into the text block to instantly compute graphic diagnostics.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
