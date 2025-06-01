import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initPlayAI } from './utils/playAIConfig';

// Make sure React is defined in the global scope for dependencies
window.React = React;
const script = document.querySelector('script[src*="play-ai"]');
if (script) {
  script.addEventListener('load', initPlayAI);
}


const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const root = createRoot(rootElement);
root.render(<App />);
