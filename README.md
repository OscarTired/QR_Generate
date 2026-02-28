<div align="center">

# QR INFO SYSTEM

**Cyberpunk-styled QR Code Generator & Viewer**

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat-square&logo=tailwindcss)

![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Version](https://img.shields.io/badge/Version-1.0.0-00f5ff?style=flat-square)

</div>

---

## Features

- **Form Input** - Enter project info via form fields (keyboard input)
- **QR Code Generation** - Create styled QR codes with gradient effects
- **Plain Text QR Output** - QR codes display data as readable text when scanned
- **HUD Interface** - Cyberpunk/futuristic UI with neon accents
- **Multi-language Support** - i18n ready with react-i18next
- **Download QR** - Export QR codes as PNG images
- **Copy to Clipboard** - Quick copy QR payload data

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| TailwindCSS | Styling |
| Framer Motion | Animations |
| qr-code-styling | QR Generation |
| React Router | Routing |
| react-i18next | Internationalization |

---

## Pages

### FormPage
Form to input project data (project name, manager, description) and generate a styled QR code with gradient colors and neon effects.

### ViewPage
**Future Functionality** - Designed to decode and display QR information from URL parameters.

---

## Current Workflow

**Form-Based Input** - Users input project data through form fields, generate QR codes with plain text output. When scanned, the QR displays readable text with project information.

---

## Components

| Component | Description |
|-----------|-------------|
| `HUDPanel` | Reusable panel with corner brackets, accent colors (cyan/magenta/green), and holographic shimmer |
| `ScanLine` | Scanline and scan-beam visual effects overlay |
| `GlitchText` | Animated glitch effect text component |
| `Header` | Navigation header with route links |

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

---

<div align="center">

**QR INFO SYSTEM // CLIENT-SIDE**

</div>
