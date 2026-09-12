import React, { useEffect, useRef } from 'react';
import './DroneShowcase.css';

declare const anime: any;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

const DroneShowcase: React.FC = () => {
  const modelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    anime.timeline({ easing: 'easeOutExpo' })
      .add({
        targets: '.hero-title .char',
        translateY: [80, 0],
        opacity: [0, 1],
        duration: 1400,
        delay: anime.stagger(50)
      })
      .add({
        targets: '.hero-subtitle',
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 1000,
      }, '-=800')
      .add({
        targets: '.scroll-indicator',
        opacity: [0, 1],
        translateY: [10, 0],
        duration: 800,
      }, '-=400')
      .add({
        targets: modelRef.current,
        opacity: [0, 1],
        duration: 2000,
      }, '-=1800');

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = maxScroll === 0 ? 0 : scrollY / maxScroll;

      

      document.querySelectorAll('.spec-card').forEach((card) => {
        const rect = (card as HTMLElement).getBoundingClientRect();
        const windowH = window.innerHeight;
        const revealPoint = windowH * 0.85;

        if (rect.top < revealPoint) {
          const entryProgress = Math.min(1, (revealPoint - rect.top) / (windowH * 0.3));
          anime.set(card, {
            opacity: entryProgress,
            translateY: (1 - entryProgress) * 40,
            scale: 0.95 + entryProgress * 0.05,
          });
        } else {
          anime.set(card, { opacity: 0, translateY: 40, scale: 0.95 });
        }
      });

      document.querySelectorAll('.section-reveal').forEach((el) => {
        const rect = (el as HTMLElement).getBoundingClientRect();
        const revealPoint = window.innerHeight * 0.8;
        if (rect.top < revealPoint) {
          const p = Math.min(1, (revealPoint - rect.top) / (window.innerHeight * 0.2));
          anime.set(el, { opacity: p, translateY: (1 - p) * 30 });
        } else {
          anime.set(el, { opacity: 0, translateY: 30 });
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const specs = [
    { label: 'Dimensions', value: '1.7 × 1.8m', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> },
    { label: 'Payload', value: 'Up to 2 kg', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 12 12 17 22 12"/><polyline points="2 17 12 22 22 17"/></svg> },
    { label: 'Endurance', value: '50+ min', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
    { label: 'Cruise Speed', value: '108 km/hr', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
    { label: 'Overall Weight', value: '18 kgs', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> },
    { label: 'Operational Range', value: '50 km', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> },
  ];

  const titleChars = "ATVA I".split('').map((char, i) => (
    <span key={i} className="char">{char === ' ' ? '\u00A0' : char}</span>
  ));

  return (
    <div className="page-wrapper">
      <div className="scanline-overlay"></div>
      <div className="grid-floor"></div>

      {/* Fixed Logo - Matching Perartral Reference */}
      <nav className="top-nav">
        <div className="nav-left">
          <div className="logo-dots-group">
            <span className="logo-dot-gold"></span>
            <span className="logo-dot-gold dim"></span>
          </div>
          <span className="nav-logo">Perartral</span>
        </div>
      </nav>

      {/* FIXED LEFT: 3D Model - Always visible */}
      <div className="model-column">
        <model-viewer
          ref={modelRef}
          src="/atva1_.glb"
          auto-rotate
          camera-controls
          shadow-intensity="1.5"
          exposure="0.7"
          disable-zoom
          field-of-view="28deg"
          rotation-per-second="15deg"
        ></model-viewer>
        <div className="model-glow"></div>
      </div>

      {/* SCROLLABLE RIGHT: Content */}
      <div className="content-column">
        {/* Hero Section */}
        <section className="hero-section">
          <p className="hero-eyebrow">01 — AUTONOMOUS UAV PLATFORM</p>
          <h1 className="hero-title">{titleChars}</h1>
          <p className="hero-subtitle">
            Autonomous, electric fixed-wing UAV designed for long-range logistics
            and surveillance missions.
          </p>
          <div className="scroll-indicator">
            <div className="scroll-line"></div>
            <span>SCROLL</span>
          </div>
        </section>

        {/* Specs Section */}
        <section className="specs-section">
          <p className="section-eyebrow section-reveal">02 — TECHNICAL SPECIFICATIONS</p>
          <h2 className="section-title section-reveal">
            ENGINEERED<br /><span className="glow-text">FOR PRECISION</span>
          </h2>
          <p className="section-desc section-reveal">
            India's first fixed-wing cargo drone to be <strong>DGCA certified for day/night operations</strong>.
            Capable of carrying a 2 kg payload across a 50 km operational range.
          </p>

          <div className="specs-grid">
            {specs.map((spec, index) => (
              <div key={index} className="spec-card">
                <div className="card-top-line"></div>
                <div className="spec-icon">{spec.icon}</div>
                <div className="spec-label">{spec.label}</div>
                <div className="spec-value">{spec.value}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="end-section">
          <p className="section-reveal end-text">[ END TRANSMISSION ]</p>
        </section>
      </div>
    </div>
  );
};

export default DroneShowcase;