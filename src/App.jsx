import { useCallback, useState } from 'react';
import useTheme from './hooks/useTheme.js';
import IntroLoader from './components/IntroLoader.jsx';
import Header from './components/Header.jsx';
import LampPullSwitch from './components/LampPullSwitch.jsx';
import Hero from './components/Hero.jsx';
import Services from './components/Services.jsx';
import StoryTimeline from './components/StoryTimeline.jsx';

export default function App() {
  const { dark, toggle } = useTheme();
  const [modalOpen, setModalOpen] = useState(false); // used in Step 10
  const [introDone, setIntroDone] = useState(() => {
    try { return sessionStorage.getItem('intro') === '1'; } catch { return false; }
  });

  const finishIntro = useCallback(() => {
    try { sessionStorage.setItem('intro', '1'); } catch {}
    setIntroDone(true);
  }, []);

  const openModal = () => setModalOpen(true);
  const [inShowcase, setInShowcase] = useState(false);
  return (
    <>
      {!introDone && <IntroLoader onDone={finishIntro} />}
      <Header onContact={openModal} />
      <LampPullSwitch dark={dark} onToggle={toggle} />
      <main>
        <Hero onHire={openModal} />
        <Services />
        <StoryTimeline />
      </main>
      {/* Step 10: <HireMeModal open={modalOpen} onClose={() => setModalOpen(false)} /> */}
      {/* Step 11: <Footer onHire={openModal} /> */}
    </>
  );
}