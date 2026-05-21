import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  FileImage, 
  Copy, 
  Check, 
  Download, 
  Trash2, 
  Sparkles, 
  FileText, 
  Sliders, 
  Maximize2 
} from 'lucide-react';
import { ImageData, OutputFormat } from '../types';
// @ts-ignore
import demoJpg from '../../demo.jpg';

export default function ImageToBase64() {
  const [dragActive, setDragActive] = useState(false);
  const [image, setImage] = useState<ImageData | null>(null);
  const [format, setFormat] = useState<OutputFormat>('data-url');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFullString, setShowFullString] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clear copied notification after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPEG, SVG, WEBP, GIF, etc.)');
      return;
    }

    setIsLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        setError('Failed to read file.');
        setIsLoading(false);
        return;
      }

      // Extract raw base64 from data url
      const dataUrlParts = result.split(',');
      const rawBase64 = dataUrlParts.length > 1 ? dataUrlParts[1] : '';

      // Get dimensions by loading into temporary image object
      const imgObj = new Image();
      imgObj.onload = () => {
        setImage({
          name: file.name,
          size: file.size,
          type: file.type || 'image/png',
          lastModified: file.lastModified,
          width: imgObj.width,
          height: imgObj.height,
          base64Raw: rawBase64,
          dataUrl: result,
        });
        setIsLoading(false);
      };
      imgObj.onerror = () => {
        // Fallback without width & height details
        setImage({
          name: file.name,
          size: file.size,
          type: file.type || 'image/png',
          lastModified: file.lastModified,
          base64Raw: rawBase64,
          dataUrl: result,
        });
        setIsLoading(false);
      };
      imgObj.src = result;
    };

    reader.onerror = () => {
      setError('An error occurred while reading the image file.');
      setIsLoading(false);
    };

    reader.readAsDataURL(file);
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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Human readable file size
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Generate output string based on selected format
  const getFormattedString = (): string => {
    if (!image) return '';
    switch (format) {
      case 'raw':
        return image.base64Raw;
      case 'data-url':
        return image.dataUrl;
      case 'img':
        return `<img src="${image.dataUrl}" alt="${image.name.replace(/"/g, '&quot;')}" />`;
      case 'css':
        return `background-image: url("${image.dataUrl}");`;
      case 'markdown':
        return `![${image.name.replace(/[[\]]/g, '')}](${image.dataUrl})`;
      default:
        return image.dataUrl;
    }
  };

  const outputString = getFormattedString();
  const LIMIT = 15000;
  const isTooLargeForRendering = outputString.length > LIMIT;
  const showTruncated = isTooLargeForRendering && !showFullString;

  const getDisplayText = (): string => {
    if (showTruncated) {
      return outputString.substring(0, LIMIT) + `\n\n... [${(outputString.length - LIMIT).toLocaleString()} characters truncated for UI performance. Rest assured, copying or downloading will capture the full text, or click "Reveal entire string" above to bypass visual limitations]`;
    }
    return outputString;
  };

  const handleCopy = async () => {
    if (!outputString) return;
    try {
      await navigator.clipboard.writeText(outputString);
      setCopied(true);
    } catch (err) {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = outputString;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
      } catch (e) {
        setError('Failed to copy to clipboard automatically. Please select text manually.');
      }
      document.body.removeChild(textArea);
    }
  };

  const handleDownloadTxt = () => {
    if (!image || !outputString) return;
    const blob = new Blob([outputString], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // Strip original extension, append .txt
    const baseName = image.name.substring(0, image.name.lastIndexOf('.')) || image.name;
    a.download = `${baseName}-${format}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadPresetSample = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(demoJpg);
      const blob = await response.blob();
      const file = new File([blob], 'demo.jpg', { type: blob.type || 'image/jpeg' });
      processFile(file);
    } catch (e) {
      setError('Could not load demo.jpg file.');
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setImage(null);
    setError(null);
    setShowFullString(false);
  };

  return (
    <div className="space-y-6" id="encoder-section">
      {/* Upper Area: Upload and Drag-drop */}
      <AnimatePresence mode="wait">
        {!image ? (
          <motion.div
            key="has-no-image"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 lg:p-12 transition-all duration-300 min-h-[320px] ${
              dragActive 
                ? 'border-indigo-500 bg-indigo-950/20' 
                : 'border-zinc-800 hover:border-zinc-700 bg-neutral-900/40'
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            id="drag-drop-zone"
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleChange}
              id="image-file-input"
            />

            <div className="flex flex-col items-center text-center space-y-4 max-w-md">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:scale-105 transition-transform duration-200 shadow-xs">
                {isLoading ? (
                  <div className="w-8 h-8 border-3 border-zinc-700 border-t-zinc-300 rounded-full animate-spin" />
                ) : (
                  <Upload className="w-8 h-8" />
                )}
              </div>
              
              <div className="space-y-1.5">
                <p className="text-zinc-100 font-semibold text-lg">
                  Drag and drop your image here
                </p>
                <p className="text-zinc-400 text-sm">
                  Supports PNG, JPEG, WEBP, SVG, GIF up to 20MB
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onButtonClick}
                  disabled={isLoading}
                  className="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl font-medium shadow-xs hover:shadow-md transition-all active:scale-[0.98] cursor-pointer disabled:opacity-55 disabled:pointer-events-none"
                  id="browse-files-btn"
                >
                  Browse Files
                </button>
                <button
                  type="button"
                  onClick={loadPresetSample}
                  disabled={isLoading}
                  className="px-4 py-2.5 border border-zinc-800 hover:bg-zinc-900 text-zinc-300 rounded-xl font-medium transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] cursor-pointer"
                  id="load-sample-btn"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Try a Demo
                </button>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-4 left-4 right-4 bg-red-950/20 text-red-400 p-3 rounded-lg text-sm font-medium border border-red-950/50 text-center"
              >
                {error}
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="has-image"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-neutral-900 border border-zinc-800/80 rounded-2xl p-6 shadow-sm"
          >
            {/* Visual Preview Left Block */}
            <div className="md:col-span-1 flex flex-col space-y-4">
              <div className="text-sm font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                <FileImage className="w-4 h-4" />
                Input Image
              </div>
              <div className="relative aspect-square w-full rounded-xl bg-zinc-950 border border-zinc-850 p-3 flex items-center justify-center overflow-hidden group shadow-inner">
                {/* Checkered pattern background for transparent PNG files */}
                <div 
                  className="absolute inset-0 opacity-10 bg-[length:16px_16px]"
                  style={{
                    backgroundImage: `radial-gradient(circle, #888 1.5px, transparent 1.5px), radial-gradient(circle, #888 1.5px, transparent 1.5px)`,
                    backgroundSize: '16px 16px',
                    backgroundPosition: '0 0, 8px 8px'
                  }}
                />
                
                <img 
                  src={image.dataUrl} 
                  alt={image.name} 
                  className="relative max-w-full max-h-full object-contain rounded-lg shadow-sm group-hover:scale-102 transition-transform duration-300"
                  id="uploaded-image-preview"
                />

                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute bottom-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-lg shadow-lg hover:shadow-red-900/10 transition-transform active:scale-95 cursor-pointer"
                  title="Remove Image"
                  id="remove-image-btn"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Metadata Indicators */}
              <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-850 space-y-3 font-medium text-sm">
                <div className="flex justify-between items-start">
                  <span className="text-zinc-400">Filename:</span>
                  <span className="text-zinc-100 truncate max-w-[150px] font-mono text-right" title={image.name}>
                    {image.name}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-zinc-850 pt-2">
                  <span className="text-zinc-400">Dimensions:</span>
                  <span className="text-zinc-150 font-mono text-right flex items-center gap-1">
                    <Maximize2 className="w-3.5 h-3.5 text-zinc-500" />
                    {image.width && image.height ? `${image.width} × ${image.height}px` : 'Inferred'}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-zinc-850 pt-2">
                  <span className="text-zinc-400">File Size:</span>
                  <span className="text-zinc-150 font-mono text-right font-semibold">
                    {formatBytes(image.size)}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-zinc-850 pt-2">
                  <span className="text-zinc-400">Type:</span>
                  <span className="text-zinc-150 uppercase text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 text-right">
                    {image.type.split('/')[1] || image.type}
                  </span>
                </div>
              </div>
            </div>

            {/* Config & Output Right Block */}
            <div className="md:col-span-2 flex flex-col space-y-4">
              <div className="text-sm font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                <Sliders className="w-4 h-4" />
                Format & Output Options
              </div>

              {/* Toggle Formats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-zinc-950 border border-zinc-850 p-1.5 rounded-xl">
                {(['data-url', 'raw', 'img', 'css', 'markdown'] as OutputFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => {
                      setFormat(fmt);
                      setShowFullString(false); // Reset rendering fallback on option switch
                    }}
                    className={`px-2 py-2 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                      format === fmt
                        ? 'bg-zinc-100 text-zinc-900 shadow-sm'
                        : 'text-zinc-400 bg-transparent hover:bg-zinc-800'
                    }`}
                    id={`format-toggle-${fmt}`}
                  >
                    {fmt === 'data-url' ? 'Data URL' : fmt === 'img' ? 'HTML <img>' : fmt === 'raw' ? 'Raw Base64' : fmt === 'css' ? 'CSS url()' : 'Markdown'}
                  </button>
                ))}
              </div>

              {/* Dynamic explanations */}
              <div className="text-xs text-zinc-400 bg-zinc-950/40 p-3 rounded-lg border border-zinc-850">
                {format === 'data-url' && "Includes standard mimetype headers so the string is usable immediately in standard HTML 'src' links."}
                {format === 'raw' && "Only raw alphanumeric Base64 string data. Standard clean text payload structure."}
                {format === 'img' && "Encodes image as a ready-to-paste JSX / HTML Image markup tag."}
                {format === 'css' && "Formatted specifically for background-image rules in custom stylesheets."}
                {format === 'markdown' && "Ready to insert into raw markdown documentation (.md, GitHub Readme)."}
              </div>

              {/* Output Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2 font-mono text-zinc-400 text-xs">
                  <FileText className="w-3.5 h-3.5" />
                  Length: <span className="font-bold text-zinc-250">{outputString.length.toLocaleString()}</span> chars
                </div>

                <div className="flex items-center gap-2">
                  {isTooLargeForRendering && (
                    <button
                      type="button"
                      onClick={() => setShowFullString(!showFullString)}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                      id="reveal-string-btn"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      {showFullString ? 'Truncate Preview' : 'Reveal Entire String'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleDownloadTxt}
                    className="px-3 py-1.5 border border-zinc-800 hover:bg-zinc-900 text-zinc-300 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                    title="Download string as .txt file"
                    id="download-txt-btn"
                  >
                    <Download className="w-3.5 h-3.5" />
                    TXT
                  </button>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className={`px-4 py-1.5 font-semibold rounded-lg flex items-center gap-1.5 shadow-xs select-none cursor-pointer duration-200 transition-all active:scale-95 ${
                      copied 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900'
                    }`}
                    id="copy-to-clipboard-btn"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy String
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Text Area display */}
              <div className="relative flex-1 flex flex-col">
                <textarea
                  readOnly
                  aria-label="Converted Base64 output"
                  value={getDisplayText()}
                  className="w-full h-64 font-mono text-xs p-4 bg-zinc-950 border border-zinc-850 rounded-xl leading-relaxed focus:outline-hidden focus:ring-1 focus:ring-zinc-700 select-all resize-none shadow-inner text-zinc-300"
                  id="base64-text-output"
                />
                
                {showTruncated && (
                  <div className="pointer-events-none absolute bottom-5 left-5 right-5 text-center">
                    <div className="inline-block bg-zinc-900/95 backdrop-blur-xs text-white/95 text-[11px] font-semibold px-3 py-1.5 rounded-md shadow-md border border-neutral-700">
                      🔒 Rendering restricted for peak device frames. Copy maintains 100% data.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
