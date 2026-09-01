import { useContext } from 'react';
import { AudioContext } from './AudioManager';

export const useAudio = () => useContext(AudioContext);
