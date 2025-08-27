# LTU Moodle Prototype

A **Next.js** application for building a Moodle-style prototype with navigation, tabs, and coding exercises.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Create the Project](#create-the-project)
- [Git Setup](#git-setup)
- [Run the Development Server](#run-the-development-server)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This project is a **Next.js** app used to build a Moodle-like prototype. It includes:

- **Course-style navigation**
- **Tabs** for sections/modules
- **Coding exercise components/placeholders**

The goal is to serve as a foundation for experimenting with LMS features and UI flows.

---

## Tech Stack

- **Framework:** Next.js (App Router, Turbopack)
- **Language:** JavaScript (no TypeScript)
- **Linting:** ESLint
- **Styling:** Custom choice (Tailwind not enabled by default)

---

## Prerequisites

Make sure the following are installed on your Mac:

- **macOS** (Ventura / Sonoma recommended)
- **Node.js (LTS)** and **npm**
- **Git** (with SSH setup if using GitHub over SSH)

Check versions in your terminal:

```bash
# Check Node.js version
node -v
v22.18.0

# Check npm version
npm -v
10.9.3

# Check Git version
git --version
git version 2.46.0
```

---

## Environment Setup

1. **Install Node.js & npm**  
   Download the LTS version from [nodejs.org](https://nodejs.org)  
   or use Homebrew:

   ```bash
   brew install node
   ```

2. **Install Git (if not already installed)**

   ```bash
   brew install git
   ```

   Configure your Git identity (if first time):

   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your@email.com"
   ```

---

## Create the Project

Use **create-next-app**:

```bash
npx create-next-app@latest ltu-moodle-prototype
```

Answer prompts:

- TypeScript → **No**
- Linter → **ESLint**
- Tailwind CSS → **No**
- `src/` directory → **No**
- App Router → **Yes**
- Turbopack → **Yes**
- Import alias customization → **No**

Sample output:

```bash
✔ Would you like to use TypeScript? › No
✔ Which linter would you like to use? › ESLint
✔ Would you like to use Tailwind CSS? › No
✔ Would you like your code inside a `src/` directory? › No
✔ Would you like to use App Router? (recommended) › Yes
✔ Would you like to use Turbopack? (recommended) › Yes
✔ Would you like to customize the import alias? › No

Success! Created ltu-moodle-prototype
```

---

## Git Setup

Initialize a repo (if not already done):

```bash
cd ltu-moodle-prototype
git init
git add .
git commit -m "Initial commit"
```

Add GitHub remote (HTTPS example):

```bash
git remote add origin https://github.com/your-username/ltu-moodle-prototype.git
git push -u origin main
```

---

## Run the Development Server

Start the dev server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
ltu-moodle-prototype/
├── app/             # App Router pages
├── public/          # Static assets
├── .eslintrc.json   # ESLint config
├── package.json     # Dependencies & scripts
└── README.md
```

---

## Available Scripts

- `npm run dev` – Start development server
- `npm run build` – Build production bundle
- `npm start` – Start production server
- `npm run lint` – Run ESLint checks

---

## Troubleshooting

- **Port already in use:** Kill existing process on port 3000

  ```bash
  lsof -i :3000
  kill -9 <PID>
  ```

- **Dependencies out of date:**
  ```bash
  npm install
  ```

---

## Contributing

Pull requests are welcome. Please fork the repo and use a feature branch.

---

## License

This project is licensed under the **MIT License**.

---
