import Desktop from '../src/components/desktop/Desktop';
import { AudioProvider } from '../src/contexts/AudioContext';

export default function Home() {
  return (
    <AudioProvider>
      <Desktop />
    </AudioProvider>
  );
}