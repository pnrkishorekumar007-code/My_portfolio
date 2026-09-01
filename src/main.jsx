import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Simple WebGL support detection for a graceful fallback page
// if the browser doesn't support WebGL (the entire experience depends on it).
const webglSupported = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    ));
  } catch {
    return false;
  }
};

const rootEl = document.getElementById('root');

if (!webglSupported()) {
  rootEl.innerHTML = `
    <div style="font-family: Arial, sans-serif; max-width: 40rem; margin: 5rem auto; padding: 0 1.5rem; text-align: center; color: #1a1a1a;">
      <h1 style="font-size: 1.8rem; color: #311059;">Kishorekumar R — Full-Stack Developer</h1>
      <p style="font-size: 1.15rem; line-height: 1.6;">
        Your browser doesn't support WebGL, which this immersive 3D portfolio requires to render.
        Please try a modern browser (Chrome, Firefox, Edge, or Safari) with hardware acceleration enabled.
      </p>
      <p style="font-size: 1rem; margin-top: 1.5rem;">
        In the meantime, you can reach me at
        <a href="mailto:pnrkishorekumar007@gmail.com" style="color: #311059; font-weight: bold;">pnrkishorekumar007@gmail.com</a>
      </p>
    </div>
  `;
} else {
  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
