# Simple Drive

A clean and elegant file sharing system built with SvelteKit.

## ✨ Features

- 🚀 **Multi-file Upload** - Support drag & drop upload, various file formats
- 📁 **File Management** - View, download, delete uploaded files
- 🖼️ **File Preview** - Online preview for image files
- 📊 **Smart Classification** - Distinguish between "All Uploads" and "Local Uploads"
- 🔄 **Real-time Sync** - Real-time file list updates based on Server-Sent Events
- 📱 **Responsive Design** - Support both grid and list display modes
- 🎯 **Multi-dimensional Sorting** - Sort by time, filename, size
- 🎨 **Modern UI** - Clean and beautiful user interface

## 🛠️ Tech Stack

- **Frontend**: SvelteKit + TypeScript
- **Backend**: SvelteKit API Routes
- **Styling**: CSS + Tailwind CSS
- **File Processing**: Node.js File System API
- **Real-time Communication**: Server-Sent Events

## 🚀 Quick Start

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev

# Or start server and auto-open browser
npm run dev -- --open
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📖 Usage Guide

1. **Upload Files**: Click "Select Files" button or drag & drop files to the page
2. **View Files**: Browse uploaded files in the file library
3. **File Operations**: 
   - Click images to preview
   - Click "Download" button to download files
   - Click "Delete" button to delete files
4. **Switch Views**: Use "All Uploads" and "Local Uploads" tabs to switch file views
5. **Sorting and Layout**: Use sort buttons and layout toggle buttons to customize display

## 📁 Project Structure

```
src/
├── lib/
│   ├── icons/          # SVG icon components
│   ├── server/         # Server-side utilities
│   └── types/          # TypeScript type definitions
├── routes/
│   ├── api/            # API routes
│   │   ├── upload/     # File upload endpoint
│   │   ├── images/     # File list endpoint
│   │   └── events/     # Real-time events endpoint
│   └── files/          # File access routes
└── app.html            # Application template
```

## 🚀 Startup Methods

### Linux/macOS
```bash
./start.sh
```

### Windows

#### Method 1: Batch Script (Recommended)
```cmd
start.bat
```

#### Method 2: Simple Batch Script
```cmd
start-simple.bat
```

#### Method 3: PowerShell Script
```powershell
.\start.ps1
```

#### Method 4: Direct Run
```cmd
node index.js
```

## 🔧 Configuration

- Uploaded files are stored in the `uploads/` directory
- Supported file types: images, documents, videos, audio, archives, etc.
- Filenames are automatically timestamped to avoid conflicts
- Supports Chinese filenames

## 📝 Development Guide

### Adding New File Type Support

Add new file extensions in the `getFileIcon` function in `src/routes/+page.svelte`:

```typescript
function getFileIcon(format: string) {
  const ext = format.toLowerCase();
  
  // Add new file types
  if (['new-format'].includes(ext)) {
    return NewFormatIcon;
  }
  
  // ... other types
}
```

### Custom Styling

The project uses Tailwind CSS, you can customize styles in `src/routes/+page.css`.

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📄 License

MIT License
