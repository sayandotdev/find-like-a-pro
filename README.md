# Book Content Management App

A Next.js web application for managing book-related content, allowing users to input text or upload files (PDF, DOC/DOCX, CSV) with a sleek, animated interface. The app features a tabbed layout with a fade-slide animation for switching between text and file upload modes, a chatbox for interaction, and a dark theme with pink (`#ec4899`) and violet (`#a855f7`) accents. Content is saved to localStorage for persistence.

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Tabbed Interface**: Switch between "Text" and "File Upload" tabs with a smooth fade-slide animation using Framer Motion.
- **File Upload**:
  - Upload PDF (`.pdf`), DOC (`.doc`), DOCX (`.docx`), or CSV (`.csv`) files.
  - File type validation with error messages for invalid files.
  - Custom upload area (`w-full h-96`) with `Upload` icon (no file) or `File` icon (file selected).
- **Text Input**: Enter and save text content for each book to localStorage.
- **Chatbox**: Placeholder for interactive chat functionality related to books.
- **LocalStorage Persistence**:
  - Stores book metadata (`books`) and content (`book-content-<id>`).
- **Responsive Design**: Mobile-friendly layout with equal-height tabs and chatbox using Tailwind CSS flexbox.
- **Dark Theme**: Gradient background (`from-gray-900 via-gray-800 to-gray-900`) with pink and violet accents.
- **Navigation**: Back arrow (`ArrowLeft`) to return to the homepage.
- **Error Handling**: Displays red error messages for invalid file uploads.

## Screenshots

### Homepage
![Homepage Screenshot](screenshots/homepage.png)

### Book Page - Text Tab
![Text Tab Screenshot](screenshots/text-tab.png)

### Book Page - File Upload Tab
![File Upload Tab Screenshot](screenshots/file-upload-tab.png)

### File Upload - File Selected
![File Selected Screenshot](screenshots/file-selected.png)

> **Note**: Replace `screenshots/*.png` with the actual paths to your screenshots after adding them to a `/screenshots` folder in the repository.

## Technologies

- **Next.js**: React framework for server-side rendering and routing.
- **TypeScript**: Type-safe JavaScript for robust development.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Framer Motion**: Animation library for fade-slide tab transitions.
- **Lucide React**: Icons (`Upload`, `File`, `ArrowLeft`).
- **LocalStorage**: Browser storage for persisting book data.
- **UUID**: Generates unique book IDs.

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/book-content-management.git
   cd book-content-management
2. **Install Dependencies**:
   ```bash
    npm install
2. **Set Up Tailwind CSS**:
   ```bash
        /** @type {import('tailwindcss').Config} */
        module.exports = {
        content: [
            "./app/**/*.{js,ts,jsx,tsx}",
            "./components/**/*.{js,ts,jsx,tsx}",
        ],
        theme: {
            extend: {
            colors: {
                pink: {
                    400: "#f472b6",
                    500: "#ec4899",
                    600: "#db2777",
                },
                violet: {
                    400: "#c084fc",
                    500: "#a855f7",
                    600: "#9333ea",
                },
            },
            },
        },
        plugins: [require("@tailwindcss/forms")],
    }
4. **Setup global Styles**:
   ```bash
    @tailwind base;
        @tailwind components;
        @tailwind utilities;

        @layer base {
        html, body {
            height: 100%;
            margin: 0;
        }
        }

        /* Particle animations for background effects (optional) */
        @keyframes particle-1 { ... }
        @keyframes particle-2 { ... }
        @keyframes particle-3 { ... }
        @keyframes particle-4 { ... }
        .animate-particle-1 { animation: particle-1 8s ease-in-out infinite; }
        .animate-particle-2 { animation: particle-2 10s ease-in-out infinite; }
        .animate-particle-3 { animation: particle-3 9s ease-in-out infinite; }
        .animate-particle-4 { animation: particle-4 7s ease-in-out infinite; }

4. **Add Icons**:
   Ensure `/public/icons.svg` exists with the `book-open` symbol (optional, used if homepage includes book icons).

5. **Run the Development Server**
    ```bash
    npm run dev

Open http://localhost:3000 in your browser.

# Project Structure

book-content-management/
├── app/
│   ├── book/
│   │   ├── [id]/
│   │   │   ├── page.tsx            # Book page with tabs and chatbox
│   │   │   ├── Tabs.tsx            # Tabbed interface with fade-slide animation
│   │   │   ├── TextInput.tsx       # Text input component
│   │   │   ├── FileUpload.tsx      # File upload component (PDF, DOC/DOCX, CSV)
│   │   │   ├── Chatbox.tsx         # Chatbox component
│   ├── globals.css                 # Global styles with Tailwind and animations
├── public/
│   ├── icons.svg                   # SVG sprite for icons (e.g., book-open)
├── screenshots/                    # Folder for screenshots
├── tailwind.config.js              # Tailwind CSS configuration
├── package.json                    # Dependencies and scripts
├── README.md                       # This file