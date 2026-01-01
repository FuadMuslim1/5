import React, { useState, useEffect, useMemo } from 'react';

interface TipsButtonProps {
  symbol: string;
}

const TipsButton: React.FC<TipsButtonProps> = ({ symbol }) => {
  const [overlayActive, setOverlayActive] = useState(false);
  const [detailOverlayActive, setDetailOverlayActive] = useState(false);
  const [detailData, setDetailData] = useState<{ title: string; image?: string; text: string } | null>(null);
  const [tipsData, setTipsData] = useState<any>(null);

  useEffect(() => {
    fetch('/data_symbol/tips_common_letters.json')
      .then(res => res.json())
      .then(setTipsData)
      .catch(err => console.error('Failed to load tips data:', err));
  }, []);

  const getIpaData = (symbol: string) => {
    if (!tipsData) return null;

    let item = null;

    // Check vowels lax
    item = tipsData.vowels.lax.find((i: any) => i.symbol === symbol);
    if (!item) {
      // Check vowels tense
      item = tipsData.vowels.tense.find((i: any) => i.symbol === symbol);
    }
    if (!item) {
      // Check diphthongs
      item = tipsData.diphthongs.find((i: any) => i.symbol === symbol);
    }
    if (!item) {
      // Check consonants
      item = tipsData.consonants.find((i: any) => i.symbol === symbol);
    }

    if (!item) return null;

    const spellingsText = item.spellings.map((s: any) => `• ${s.letters} → ${s.examples.join(', ')}`).join('\n');
    const letters = `Sering muncul dari huruf:\n${spellingsText}${item.trap ? '\n\nJebakan: ' + item.trap : ''}`;

    const steps = item.trap || 'Practice the sound carefully.';

    return {
      sound: {
        title: `How to sound /${symbol}/`,
        image: '',
        steps: steps
      },
      letters: {
        title: `Common letters for /${symbol}/`,
        letters: letters
      }
    };
  };

  const ipaData = useMemo(() => getIpaData(symbol), [symbol, tipsData]);

  const handleOpenTips = () => setOverlayActive(true);
  const handleCloseTips = () => setOverlayActive(false);
  const handleCloseDetail = () => setDetailOverlayActive(false);

  const handleTypeClick = (type: 'sound' | 'letters') => {
    setOverlayActive(false);
    const data = ipaData?.[type];
    if (data) {
      setDetailData({
        title: data.title,
        image: type === 'sound' ? (data as any).image : undefined,
        text: type === 'sound' ? (data as any).steps : (data as any).letters
      });
      setDetailOverlayActive(true);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setOverlayActive(false);
    }
  };

  const handleDetailOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setDetailOverlayActive(false);
    }
  };

  return (
    <>
      <style>{`
        .tips-btn {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045);
          box-shadow: 0 10px 25px rgba(0,0,0,.4);
          color: white;
          font-size: 22px;
          transition: transform .2s ease, box-shadow .2s ease;
          margin-top: 10px;
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
        }
        .tips-btn:hover {
          transform: scale(1.08) rotate(6deg);
          box-shadow: 0 14px 30px rgba(0,0,0,.55);
        }
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.55);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(6px);
          z-index: 1001;
          padding: 10px;
        }
        .popup {
          background: linear-gradient(160deg, #1b1b22, #0f0f12);
          padding: 28px;
          border-radius: 20px;
          width: 100%;
          max-width: 320px;
          box-shadow: 0 20px 50px rgba(0,0,0,.7);
          animation: pop .35s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        @keyframes pop { from { transform: scale(.85); opacity:0;} to {transform: scale(1); opacity:1;} }
        .popup h3 {
          margin-bottom: 16px;
          font-size: 20px;
          text-align: center;
          background: linear-gradient(90deg, #833ab4, #fd1d1d, #fcb045);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        #detailTitle {
          font-size: 18px;
          text-align: center;
          margin-bottom: 12px;
          font-weight: 600;
          color: #fff;
        }
        #detailText {
          font-size: 15px;
          line-height: 1.7;
          color: #ddd;
          margin-top: 8px;
          white-space: pre-line;
          word-wrap: break-word;
          text-align: left;
          width: 100%;
        }
        .popup-actions {
          display: grid;
          gap: 12px;
          margin-top: 10px;
          width: 100%;
        }
        .popup-actions button {
          padding: 12px;
          border-radius: 14px;
          border:none;
          cursor:pointer;
          font-size:14px;
          font-weight:600;
          color:#fff;
          transition: transform .15s ease, box-shadow .15s ease;
          width: 100%;
        }
        .popup-actions button:nth-child(1) { background: linear-gradient(135deg, #833ab4, #fd1d1d);}
        .popup-actions button:nth-child(2) { background: linear-gradient(135deg, #fd1d1d, #fcb045);}
        .popup-actions button:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,.4);}
        .close {
          margin-top:16px;
          text-align:center;
          font-size:12px;
          color:#aaa;
          cursor:pointer;
          width: 100%;
        }
        .close:hover { color:#fff; }
        #detailImage {
          width:100%;
          max-width:100%;
          height:auto;
          border-radius:14px;
          margin-bottom:14px;
        }
      `}</style>
      <button className="tips-btn" onClick={handleOpenTips}>💡</button>
      {overlayActive && (
        <div className="overlay" onClick={handleOverlayClick}>
          <div className="popup">
            <h3>Pronunciation Tips</h3>
            <div className="popup-actions">
              <button onClick={() => handleTypeClick('sound')}>How to sound /{symbol}/</button>
              <button onClick={() => handleTypeClick('letters')}>Common letters</button>
            </div>
            <div className="close" onClick={handleCloseTips}>Tap to close</div>
          </div>
        </div>
      )}
      {detailOverlayActive && detailData && (
        <div className="overlay" onClick={handleDetailOverlayClick}>
          <div className="popup">
            <h3 id="detailTitle">{detailData.title}</h3>
            {detailData.image && <img id="detailImage" src={detailData.image} alt="" referrerPolicy="no-referrer" />}
            <p id="detailText">{detailData.text}</p>
            <div className="close" onClick={handleCloseDetail}>Tap to close</div>
          </div>
        </div>
      )}
    </>
  );
};

export default TipsButton;
