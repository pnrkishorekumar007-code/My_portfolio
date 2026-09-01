import { useState, Suspense, useEffect, useCallback, lazy } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { Preload, useTexture } from '@react-three/drei';

import Preloader from './components/dom/Preloader';
import PaperTransition from './components/dom/PaperTransition';
import { AudioProvider } from './context/AudioManager';
import { useAudio } from './context/useAudio';
import { initAudio } from './utils/audioManager';
import { PerformanceProvider } from './context/PerformanceContext';
import { usePerformance } from './context/usePerformance';
import { SceneProvider } from './context/SceneContext';
import { useScene } from './context/useScene';
import NavigationUI from './components/ui/NavigationUI';
import GlobalOverlay from './components/ui/GlobalOverlay';
import ScreenReaderOverlay from './components/ui/ScreenReaderOverlay';
import ScrollProgress from './components/ui/ScrollProgress';
import { useDocumentMeta } from './hooks/useDocumentMeta';

// Lazy load the heavy 3D experience
const Experience = lazy(() => import('./components/canvas/Experience'));

import './styles/main.scss';

import {
  ENTRANCE_TEXTURES,
  CORRIDOR_TEXTURES,
  UI_TEXTURES,
  GALLERY_TEXTURES,
  CONTACT_TEXTURES,
  ABOUT_TEXTURES,
  STUDIO_TEXTURES,
  IMAGE_ASSETS,
  filterTexturesByDevice
} from './config/texturePreloadList';
import { TextureLoader } from 'three';

// Standard Browser-level Image Preloader (for <img> tags)
const preloadBrowserImage = (path) => {
  if (typeof window === 'undefined') return;
  const img = new Image();
  img.src = path;
};

const supportsHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

// Textures needed for the ENTRANCE experience - loaded eagerly at boot.
// Room textures are deferred (see preloadRoomTextures) so the preloader
// doesn't block on ~13MB of assets the user won't see until they navigate.
const eagerCore = filterTexturesByDevice(
  [...ENTRANCE_TEXTURES, ...CORRIDOR_TEXTURES, ...UI_TEXTURES, ...IMAGE_ASSETS],
  supportsHover
);
eagerCore.forEach(path => useTexture.preload(path));

// Room textures (Gallery/Contact via useTexture, About/Studio via useLoader),
// fetched in the background AFTER the entrance is interactive.
let deferredPreloadStarted = false;
const preloadRoomTextures = () => {
  if (deferredPreloadStarted) return;
  deferredPreloadStarted = true;
  const t0 = performance.now();
  filterTexturesByDevice([...GALLERY_TEXTURES, ...CONTACT_TEXTURES], supportsHover)
    .forEach(path => useTexture.preload(path));
  filterTexturesByDevice([...ABOUT_TEXTURES, ...STUDIO_TEXTURES], supportsHover)
    .forEach(path => useLoader.preload(TextureLoader, path));
  if (import.meta.env.DEV) {
    console.info(`[Preload] Deferred room textures requested ${((performance.now() - t0) / 1000).toFixed(2)}s after interactive`);
  }
};

const scheduleDeferredPreload = () => {
  if (deferredPreloadStarted) return;
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(preloadRoomTextures, { timeout: 3000 });
  } else {
    setTimeout(preloadRoomTextures, 1500);
  }
};

// Helper component to handle global audio enable on interaction
const GlobalAudioEnabler = () => {
  const { enableAudio } = useAudio();
  useEffect(() => {
    const handleInteraction = () => enableAudio();
    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });
    window.addEventListener('keydown', handleInteraction, { once: true });
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [enableAudio]);
  return null;
};

// Bridge component to handle dynamic meta tags + deep link auto-teleport
function DocumentMetaBridge() {
  useDocumentMeta();
  const { initialRoom, deeplinkHandled, hasEntered, teleportTo } = useScene();

  useEffect(() => {
    if (initialRoom && hasEntered && !deeplinkHandled.current) {
      deeplinkHandled.current = true;
      setTimeout(() => teleportTo(initialRoom), 300);
    }
  }, [initialRoom, hasEntered, teleportTo, deeplinkHandled]);

  return null;
}

function AppContent() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const { settings, tier } = usePerformance();

  useEffect(() => {
    initAudio();
  }, []);

  // Entrance is interactive -> fetch room textures in the background
  useEffect(() => {
    if (isLoaded) scheduleDeferredPreload();
  }, [isLoaded]);

  const handleSceneReady = useCallback(() => {
    requestAnimationFrame(() => {
      setSceneReady(true);
    });
  }, []);

  return (
    <AudioProvider>
      <SceneProvider>
        <DocumentMetaBridge />
        <GlobalAudioEnabler />
        <div className="app">
          {/* Full screen 3D Canvas */}
          <div className="canvas-wrapper">
            <Canvas
              camera={{
                position: [0, 0.2, 28],
                fov: 60,
                near: 0.1,
                far: 150
              }}
              gl={{
                antialias: settings.antialias,
                alpha: false,
                powerPreference: settings.powerPreference,
                localClippingEnabled: true,
                failIfMajorPerformanceCaveat: true
              }}
              dpr={settings.dpr}
              shadows={settings.shadows}
            >
              <color attach="background" args={['#fdf8e2']} /> {/* TINTED TO DEEP PURPLE */}
              <fog attach="fog" args={['#fdf8e2', 15, 50]} /> {/* FOG TINTED TO DEEP PURPLE */}

              <Suspense fallback={null}>
                <Experience
                  isLoaded={isLoaded}
                  onSceneReady={handleSceneReady}
                  performanceTier={tier}
                />
                <Preload all />
              </Suspense>
            </Canvas>
          </div>

          {/* Navigation UI - Hamburger, Map, Back, Audio */}
          {isLoaded && (
            <>
              <ScrollProgress />
              <NavigationUI />
              <GlobalOverlay />
              <PaperTransition />
              <ScreenReaderOverlay />
            </>
          )}

          {/* 2D Preloader */}
          <Preloader
            ready={sceneReady}
            onComplete={() => setIsLoaded(true)}
          />
        </div>
      </SceneProvider>
    </AudioProvider>
  );
}

import { AchievementsProvider } from './context/AchievementsContext';

export default function App() {
  useEffect(() => {
    const filteredImages = filterTexturesByDevice(IMAGE_ASSETS, supportsHover);
    filteredImages.forEach(path => preloadBrowserImage(path));
  }, []);

  return (
    <PerformanceProvider>
      <AchievementsProvider>
        <AppContent />
      </AchievementsProvider>
    </PerformanceProvider>
  );
}
