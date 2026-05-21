# Base64 Image Converter

A professional, offline-first, client-side utility workspace to convert images to Base64 strings and reconstruct images from Base64 data. 

🚀 **Live Demo**: [https://silivia8.github.io/Base64/](https://silivia8.github.io/Base64/)

---

## ✨ Features

### 🖼️ Image to Base64 Converter
- **Drag and Drop / File Browser**: Easily drop any image format (PNG, JPEG, WEBP, SVG, GIF, ICO) up to 20MB.
- **Multiple Output Syntax Formats**:
  - **Data URL**: Fully qualified URI for standard browser elements (`data:image/...`).
  - **Raw Base64**: Pure alphanumeric character sequence.
  - **HTML**: Direct copyable JSX/HTML `<img>` tag.
  - **CSS**: Background image url format (`background-image: url(...)`).
  - **Markdown**: Image link tag ready for `.md` documentation.
- **Optimized UI Rendering**: Virtualized textarea limits display for large files to keep the page highly responsive, while copying and downloading actions always operate on 100% of the raw data.

### 🔠 Base64 to Image Converter
- **Intelligent Input Parsing**: Automatically strips code tags if you paste raw HTML `<img>` elements, CSS `background-image: url(...)` blocks, or Markdown image formats.
- **Auto-MIME Type Detection**: Guesses the file format using magic file header signatures (e.g. PNG, JPEG, WEBP, SVG, GIF) if a raw Base64 string is supplied without headers.
- **Text File Import Options**:
  - **Upload Button**: Choose and read locally stored `.txt` files containing huge Base64 strings.
  - **Drag and Drop**: Drop `.txt` files directly onto the input text box to instantly load them.
- **Diagnostics Grid**: Displays image dimensions, computed file size, aspect ratio, and mime types.
- **Custom Downloads**: Customize the file name and download the reconstructed graphic in its native extension.

### 🔒 Privacy & Offline Security
- Runs 100% on the local client using browser APIs.
- No files or strings ever leave your device or contact external web servers. Fully functional offline.

---

## 🛠️ Tech Stack
- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 6
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React

---

## 💻 Local Development

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or another package manager

### Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build the production bundle**:
   ```bash
   npm run build
   ```
   Compiled static files will be located in the `dist/` directory.

---

## 🚀 GitHub Pages Deployment

The project is configured for automated deployment via GitHub Actions.

- The deployment workflow is located in [.github/workflows/deploy.yml](.github/workflows/deploy.yml).
- Every push to the `main` branch automatically triggers a production compile and publishes the updated code to GitHub Pages.
- The `base` directory path is set to `/Base64/` in [vite.config.ts](vite.config.ts) to match the GitHub Pages hosting layout.
