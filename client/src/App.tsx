import './App.css'
import { useRef, useState } from 'react';
import { PhaserGame } from './components/PhaserGame';

function App() {
  const phaserRef = useRef(null);
  const [currentScene, _setCurrentScene] = useState<string>('MainScene');
  return (
    <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
  )
}

export default App
