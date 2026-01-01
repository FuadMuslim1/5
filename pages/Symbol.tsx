import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Symbol.css';

// Constants
const PORTALS = ['vowel', 'diphthong', 'consonant'] as const;
const TENSE_VOWELS = ['ɑ', 'i', 'u', 'æ', 'ɔ'];
const VOICED_CONSONANTS = ['b','d','g','v','ð','z','ʒ','ʤ','l','m','n','ŋ','r','w','y'];

const Symbol: React.FC = () => {
  const navigate = useNavigate();
  const [activePortal, setActivePortal] = useState<string | null>(null);
  const [currentMobilePortal, setCurrentMobilePortal] = useState<number>(0);

  useEffect(() => {
    if (activePortal) {
      const bubbles = document.querySelectorAll(`#portal-${activePortal} .bubble`);
      bubbles.forEach((b, index) => {
        (b as HTMLElement).style.transitionDelay = `${0.35 + (index * 0.04)}s`;
      });
    }
  }, [activePortal]);

  const togglePortal = (portal: string) => {
    setActivePortal(activePortal === portal ? null : portal);
  };

  const handleBubbleClick = (e: React.MouseEvent<HTMLAnchorElement>, symbol: string) => {
    e.preventDefault();
    console.log('Navigating to symbol:', symbol);
    navigate(`/pronunciation/symbol/${encodeURIComponent(symbol)}`);
  };

  const nextPortal = () => {
    setCurrentMobilePortal((prev) => (prev + 1) % PORTALS.length);
  };

  const prevPortal = () => {
    setCurrentMobilePortal((prev) => (prev - 1 + PORTALS.length) % PORTALS.length);
  };

  const renderPortal = (portal: string, index: number) => {
    const isActive = activePortal === portal;
    const isMobileVisible = window.innerWidth <= 480 ? index === currentMobilePortal : true;

    if (!isMobileVisible) return null;

    switch (portal) {
      case 'vowel':
        return (
          <div key={portal} className={`portal-unit ${isActive ? 'active' : ''}`} id="portal-vowel">
            <div className="portal-aura"></div>
            <button className="btn-trigger" onClick={() => togglePortal('vowel')}>Vowel</button>
            <div className="door-frame">
              <div className="shard s1"></div><div className="shard s2"></div>
              <div className="shard s3"></div><div className="shard s4"></div>
            </div>
            <div className="content-box">
              <div className="cat-label">Vowels</div>
              <div className="bubble-wrap">
                <span className="label">Lax</span>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'ʌ')}>ʌ</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'ɪ')}>ɪ</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'ʊ')}>ʊ</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'ɛ')}>ɛ</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'ə')}>ə</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'ɚ')}>ɚ</a>
                <span className="label">Tense</span>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'ɑ')}>ɑ</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'i')}>i</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'u')}>u</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'æ')}>æ</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'ɔ')}>ɔ</a>
              </div>
            </div>
          </div>
        );
      case 'diphthong':
        return (
          <div key={portal} className={`portal-unit ${isActive ? 'active' : ''}`} id="portal-diphthong">
            <div className="portal-aura"></div>
            <button className="btn-trigger" onClick={() => togglePortal('diphthong')}>Diphthong</button>
            <div className="door-frame">
              <div className="shard s1"></div><div className="shard s2"></div>
              <div className="shard s3"></div><div className="shard s4"></div>
            </div>
            <div className="content-box">
              <div className="cat-label">Diphthongs</div>
              <div className="bubble-wrap">
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'aɪ')}>aɪ</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'eɪ')}>eɪ</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'ɔɪ')}>ɔɪ</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'ɪə')}>ɪə</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'eə')}>eə</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'ʊə')}>ʊə</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'oʊ')}>oʊ</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'aʊ')}>aʊ</a>
              </div>
            </div>
          </div>
        );
      case 'consonant':
        return (
          <div key={portal} className={`portal-unit ${isActive ? 'active' : ''}`} id="portal-consonant">
            <div className="portal-aura"></div>
            <button className="btn-trigger" onClick={() => togglePortal('consonant')}>Consonant</button>
            <div className="door-frame">
              <div className="shard s1"></div><div className="shard s2"></div>
              <div className="shard s3"></div><div className="shard s4"></div>
            </div>
            <div className="content-box">
              <div className="cat-label">Consonants</div>
              <div className="bubble-wrap">
                <span className="label">Voiceless</span>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'p')}>p</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 't')}>t</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'k')}>k</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'f')}>f</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'θ')}>θ</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 's')}>s</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'ʃ')}>ʃ</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'ʧ')}>ʧ</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'h')}>h</a>
                <span className="label">Voiced</span>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'b')}>b</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'd')}>d</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'g')}>g</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'v')}>v</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'ð')}>ð</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'z')}>z</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'ʒ')}>ʒ</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'ʤ')}>ʤ</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'l')}>l</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'm')}>m</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'n')}>n</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'ŋ')}>ŋ</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'r')}>r</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'w')}>w</a>
                <a href="#" className="bubble" onClick={(e) => handleBubbleClick(e, 'y')}>y</a>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="main-container">
      {window.innerWidth <= 480 ? (
        <>
          <button className="nav-btn prev-btn" onClick={prevPortal}>{'<'}</button>
          {renderPortal(PORTALS[currentMobilePortal], currentMobilePortal)}
          <button className="nav-btn next-btn" onClick={nextPortal}>{'>'}</button>
        </>
      ) : (
        PORTALS.map((portal, index) => renderPortal(portal, index))
      )}
    </div>
  );
};

export default Symbol;
