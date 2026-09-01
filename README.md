# Kishore Kumar — Portfolio Website

A 3D interactive portfolio website built with React, Vite, and Three.js (React Three Fiber), featuring animated doors, paint-reveal shaders, GSAP transitions, ambient audio, and an achievements system.

## Tech Stack

- **Frontend:** React 19 + Vite 8
- **3D / Graphics:** Three.js, @react-three/fiber, @react-three/drei, @react-three/postprocessing
- **Animation:** GSAP (@gsap/react)
- **Styling:** Sass (SCSS)
- **Linting:** Oxlint

## Prerequisites

Make sure you have the following installed before running the project:

1. **Node.js** (v18 or later) — download from [https://nodejs.org](https://nodejs.org)
2. **npm** (comes bundled with Node.js)

Check your installation:

```bash
node -v
npm -v
```

## Getting Started — Run Locally

Follow these steps to run the project on your local machine:

### Step 1: Navigate to the project folder

```bash
cd My_portfolio-main
```

### Step 2: Install dependencies

```bash
npm install
```

This installs all required packages listed in `package.json` (it may take a few minutes).

### Step 3: Start the development server

```bash
npm run dev
```

### Step 4: Open in your browser

Once the server starts, open this URL in your browser:

```
http://localhost:5173/
```

The app supports Hot Module Replacement (HMR) — any changes you make to the code will instantly reflect in the browser.

## Available Scripts

| Command           | Description                                      |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Starts the development server at `localhost:5173` |
| `npm run build`   | Bundles the app for production into the `dist/` folder |
| `npm run preview` | Locally previews the production build            |
| `npm run lint`    | Runs Oxlint to check code quality                |

## Production Build

To create an optimized production build and preview it locally:

```bash
npm run build
npm run preview
```

## Deployment

This project includes a `vercel.json`, so it can be deployed directly to [Vercel](https://vercel.com):

1. Push the repository to GitHub.
2. Import the repo in Vercel.
3. Vercel auto-detects Vite — just deploy.

## Troubleshooting

- **Port 5173 already in use:** Vite will automatically use the next available port (e.g., `5174`). Check the terminal output for the correct URL.
- **Install errors / peer dependency warnings:** Delete `node_modules` and `package-lock.json`, then run `npm install` again.
- **Blank screen after opening:** Make sure the dev server is still running in the terminal and refresh the page.
