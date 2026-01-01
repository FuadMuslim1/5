import React, { useState, useEffect, useRef } from 'react';

interface Word {
  text: string;
  ipa: string;
  start: number;
  end: number;
}

interface FocusModeButtonProps {
  words: Word[];
  symbol: string;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const FocusModeButton: React.FC<FocusModeButtonProps> = ({ words, symbol }) => {
  console.log('FocusModeButton component loaded for symbol:', symbol);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [videoId, setVideoId] = useState<string>('e6rjJiOxVCs'); // Default fallback
  const [pendingPlay, setPendingPlay] = useState(false);
  const floatingPlayerRef = useRef<HTMLDivElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Load Google Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@700&family=Roboto:wght@400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Video ID maps based on symbol categories
  const videoIdMaps = {
    vowel_lax: {
      'ʌ': 'e6rjJiOxVCs',
      'ɪ': 'rX96zUAApyo',
      'ʊ': 'nEhnJj_bLbM',
      'ɛ': 'II9KgEF3K7E',
      'ə': 'NaM-ynp6lRA',
      'ɚ': 'UUNI1k8tNSY'
    },
    vowel_tense: {
      'ɑ': 'rBFB2VXmAI0',
      'i': '9XcUY0nunfw',
      'u': 'qJiVghRtg1I',
      'æ': 'qg0IjcUZdso',
      'ɔ': '1Kjyf1D7jvE'
    },
    diphthong: {
      'aɪ': 'xndGoQmWYxU',
      'eɪ': 'Gk_ZufNX5jQ',
      'ɔɪ': 'TL8bvCYD0dk',
      'ɪə': 'WzlK8CnFh8c',
      'eə': '08MZWPOwiYw',
      'ʊə': 'y1b2QqgSyxg',
      'oʊ': '7xk2EBlcwt4'
    },
    consonant_voiced: {
      'b': 'THcT0SvCjK4',
      'd': '9h7EWDTAAoY',
      'g': 'RvJDhwEcZ8Q',
      'v': 'fC6BCT_KF-o',
      'ð': 'Q0R1DFsM_ds',
      'z': 'mEoGA6y-fQo',
      'ʒ': 'RmQncMXQdG4',
      'ʤ': 'XJQzE4tDW0A',
      'l': 'VKiTgQdJXjI',
      'm': 'iuIOJHjztzc',
      'n': 'uCZEU-h2JSs',
      'ŋ': 'X3dSWxLvNKc',
      'r': 'Fa9FuZBe820',
      'w': '_EX0UaxUKEc',
      'y': 'mi9lFzpu42Y'
    },
    consonant_voiceless: {
      'p': 'P2d0CZG4dlw',
      't': 'HXsyO2iWY44',
      'k': 'VJaW7kOly1s',
      'f': 'ODkqeBCL49o',
      'θ': 'riRrCGw2-6I',
      's': 'r92ZzmP_15k',
      'ʃ': 'Dxc20oQ6VX8',
      'ʧ': 'fXB0-xkV7Vg',
      'h': '_-OvqIXGrGI'
    }
  };

  // Get video ID based on symbol
  const getVideoId = (symbol: string): string => {
    if (['ʌ', 'ɪ', 'ʊ', 'ɛ', 'ə', 'ɚ'].includes(symbol)) {
      return videoIdMaps.vowel_lax[symbol] || 'e6rjJiOxVCs';
    } else if (['ɑ', 'i', 'u', 'æ', 'ɔ'].includes(symbol)) {
      return videoIdMaps.vowel_tense[symbol] || 'rBFB2VXmAI0';
    } else if (['aɪ', 'eɪ', 'ɔɪ', 'ɪə', 'eə', 'ʊə', 'oʊ', 'aʊ'].includes(symbol)) {
      return videoIdMaps.diphthong[symbol] || 'xndGoQmWYxU';
    } else if (['b', 'd', 'g', 'v', 'ð', 'z', 'ʒ', 'ʤ', 'l', 'm', 'n', 'ŋ', 'r', 'w', 'y'].includes(symbol)) {
      return videoIdMaps.consonant_voiced[symbol] || 'THcT0SvCjK4';
    } else if (['p', 't', 'k', 'f', 'θ', 's', 'ʃ', 'ʧ', 'h'].includes(symbol)) {
      return videoIdMaps.consonant_voiceless[symbol] || 'P2d0CZG4dlw';
    }
    return 'e6rjJiOxVCs'; // Default fallback
  };

  // Set video ID based on symbol and reset focus mode
  useEffect(() => {
    if (symbol) {
      // Immediately destroy existing player when symbol changes
      if (player) {
        console.log('Destroying player due to symbol change');
        player.destroy();
        setPlayer(null);
        setPlayerReady(false);
      }

      const selectedVideoId = getVideoId(symbol);
      console.log('FocusModeButton: symbol =', symbol, 'selectedVideoId =', selectedVideoId);
      setVideoId(selectedVideoId);
      // Reset focus mode when symbol changes
      setIsFocusMode(false);
      setPendingPlay(false);
      const pageContainer = document.querySelector('.pronunciation-symbol-page');
      if (pageContainer) {
        pageContainer.classList.remove('focus-active');
      }
    }
  }, [symbol, player]);

  // Load YouTube API and create player
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);

      window.onYouTubeIframeAPIReady = () => {
        createPlayer();
      };
    } else {
      createPlayer();
    }

    function createPlayer() {
      if (playerContainerRef.current && videoId) {
        // Destroy existing player if it exists
        if (player) {
          console.log('Destroying existing YouTube player');
          player.destroy();
          setPlayer(null);
          setPlayerReady(false);
        }

        console.log('Creating new YouTube player with videoId:', videoId);
        const ytPlayer = new window.YT.Player(playerContainerRef.current, {
          height: '100%',
          width: '100%',
          videoId: videoId,
          playerVars: {
            controls: 1,
            autoplay: 0,
            rel: 0,
            modestbranding: 1
          },
          events: {
            onReady: () => {
              console.log('YouTube player ready for videoId:', videoId);
              setPlayerReady(true);
              if (pendingPlay) {
                ytPlayer.seekTo(0, true);
                ytPlayer.playVideo();
                setPendingPlay(false);
              }
            },
            onError: (error: any) => {
              console.error('YouTube player error:', error);
            }
          }
        });
        setPlayer(ytPlayer);
      }
    }

    return () => {
      // Cleanup function to destroy player when component unmounts or videoId changes
      if (player) {
        console.log('Cleaning up YouTube player');
        player.destroy();
        setPlayer(null);
        setPlayerReady(false);
      }
    };
  }, [videoId]);

  // Toggle focus mode
  const toggleFocusMode = () => {
    const newFocusMode = !isFocusMode;
    setIsFocusMode(newFocusMode);

    // Find the pronunciation symbol page container
    const pageContainer = document.querySelector('.pronunciation-symbol-page');

    if (newFocusMode) {
      // Enter focus mode
      if (pageContainer) {
        pageContainer.classList.add('focus-active');
      }

      // Try to play video immediately or set pending play
      if (player && playerReady) {
        try {
          player.seekTo(0, true);
          // Add a small delay to ensure seekTo completes
          setTimeout(() => {
            if (player && playerReady) {
              player.playVideo();
            }
          }, 100);
        } catch (error) {
          console.warn('Error playing video immediately:', error);
          setPendingPlay(true);
        }
      } else {
        // If player not ready, set pending play
        setPendingPlay(true);
      }

      // Scroll to examples
      const exampleWords = document.querySelector('.examples-container');
      if (exampleWords) {
        const offsetTop = exampleWords.getBoundingClientRect().top + window.scrollY - 20;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    } else {
      // Exit focus mode
      if (pageContainer) {
        pageContainer.classList.remove('focus-active');
      }
      if (player && playerReady) {
        try {
          player.pauseVideo();
          player.stopVideo();
        } catch (error) {
          console.warn('Error stopping video:', error);
        }
      }
      setPendingPlay(false);
    }
  };

  // Control buttons
  const playVideo = () => {
    if (player && playerReady && typeof player.playVideo === 'function') {
      player.playVideo();
    } else {
      console.warn('YouTube player not ready for playVideo');
    }
  };
  const pauseVideo = () => {
    if (player && playerReady && typeof player.pauseVideo === 'function') {
      player.pauseVideo();
    } else {
      console.warn('YouTube player not ready for pauseVideo');
    }
  };
  const stopVideo = () => {
    if (player && playerReady && typeof player.stopVideo === 'function') {
      player.stopVideo();
    } else {
      console.warn('YouTube player not ready for stopVideo');
    }
  };

  // Dragging functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (floatingPlayerRef.current) {
      setIsDragging(true);
      setOffset({
        x: e.clientX - floatingPlayerRef.current.offsetLeft,
        y: e.clientY - floatingPlayerRef.current.offsetTop
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && floatingPlayerRef.current) {
        floatingPlayerRef.current.style.left = `${e.clientX - offset.x}px`;
        floatingPlayerRef.current.style.top = `${e.clientY - offset.y}px`;
      }
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, offset]);

  const closeFloatingPlayer = () => {
    setIsFocusMode(false);
    const pageContainer = document.querySelector('.pronunciation-symbol-page');
    if (pageContainer) {
      pageContainer.classList.remove('focus-active');
    }
    if (player && playerReady) {
      player.pauseVideo();
      player.stopVideo();
    }
  };

  return (
    <>
      <style>{`
        .focus-active {
          background-color: #111 !important;
          color: #fff !important;
        }

        .focus-active a,
        .focus-active h1,
        .focus-active h2,
        .focus-active p,
        .focus-active li {
          color: #fff !important;
        }

        #focusWrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 10px;
        }

        #focusControls {
          display: ${isFocusMode ? 'flex' : 'none'};
          gap: 5px;
          margin-top: 5px;
        }

        .gradient-button {
          position: relative;
          display: inline-block;
          border-radius: 50px;
          padding: 10px 18px;
          background-color: #111;
          color: white;
          font-family: 'Roboto', sans-serif;
          font-weight: 500;
          cursor: pointer;
          overflow: hidden;
          z-index: 0;
          font-size: 14px;
          transition: color 0.3s, background-color 0.3s, transform 0.2s;
          border: none;
        }

        .gradient-button::before {
          content: '';
          position: absolute;
          top: -3px; left: -3px; right: -3px; bottom: -3px;
          background: conic-gradient(from 0deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888, #f09433);
          border-radius: 50px;
          z-index: -1;
        }

        .gradient-button.active::before {
          animation: rotateGradient 2.5s linear infinite;
        }

        @keyframes rotateGradient {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulseClick {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }

        .gradient-button.clicked {
          animation: pulseClick 0.3s ease-in-out;
        }

        .gradient-button:hover {
          transform: scale(1.05);
          background-color: #222;
          color: #fff;
        }

        #floatingPlayer {
          visibility: ${isFocusMode ? 'visible' : 'hidden'};
          width: 25%;
          height: 240px;
          position: fixed;
          bottom: 0;
          left: 0;
          background-color: #000;
          z-index: 50;
          transition: bottom 0.5s, left 0.3s, top 0.3s;
          border: 2px solid #fff;
          border-radius: 8px;
          overflow: hidden;
        }

        #floatingPlayer .close-btn {
          position: absolute;
          top: 4px;
          right: 6px;
          z-index: 10;
          background: red;
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px; height: 24px;
          cursor: pointer;
        }

        @media (max-width: 600px) {
          #floatingPlayer { height: 220px; width: 80%; }
          .gradient-button { padding: 8px 14px; font-size: 12px; }
        }
      `}</style>

      <div id="focusWrapper">
        <button
          id="focusModeBtn"
          className={`gradient-button ${isFocusMode ? 'active' : ''}`}
          onClick={toggleFocusMode}
        >
          {isFocusMode ? 'Normal Mode' : 'Focus Mode'}
        </button>
        <div id="focusControls">
          <button className="gradient-button" onClick={playVideo}>▶</button>
          <button className="gradient-button" onClick={pauseVideo}>❚❚</button>
          <button className="gradient-button" onClick={stopVideo}>■</button>
        </div>
      </div>

      <div
        id="floatingPlayer"
        ref={floatingPlayerRef}
        onMouseDown={handleMouseDown}
      >
        <button className="close-btn" onClick={closeFloatingPlayer}>×</button>
        <div id="player" ref={playerContainerRef}></div>
      </div>
    </>
  );
};

export default FocusModeButton;
