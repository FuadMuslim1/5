// ====================================================
// MODULATOR: Tips Popup UI (Final Clean & Text Rapi, tanpa favicon)
// ====================================================
(function() {
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --ig-1: #833ab4;
      --ig-2: #fd1d1d;
      --ig-3: #fcb045;
      --dark: #f5f5f9ff;
      --light: #ffffff;
    }
    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: var(--dark);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .tips-btn {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      background: linear-gradient(135deg, var(--ig-1), var(--ig-2), var(--ig-3));
      box-shadow: 0 10px 25px rgba(0,0,0,.4);
      color: white;
      font-size: 22px;
      transition: transform .2s ease, box-shadow .2s ease;
      margin-top: 10px;
    }
    .tips-btn:hover {
      transform: scale(1.08) rotate(6deg);
      box-shadow: 0 14px 30px rgba(0,0,0,.55);
    }
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.55);
      display: none;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(6px);
      z-index: 1000;
      padding: 10px;
    }
    .overlay.active { display: flex; }
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
      background: linear-gradient(90deg, var(--ig-1), var(--ig-2), var(--ig-3));
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
    .popup-actions button:nth-child(1) { background: linear-gradient(135deg, var(--ig-1), var(--ig-2));}
    .popup-actions button:nth-child(2) { background: linear-gradient(135deg, var(--ig-2), var(--ig-3));}
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
      display:none;
    }
  `;
  document.head.appendChild(style);

  const container = document.createElement('div');
  container.innerHTML = `
    <button class="tips-btn" id="openTips">💡</button>

    <div class="overlay" id="overlay">
      <div class="popup">
        <h3>Pronunciation Tips</h3>
        <div class="popup-actions">
          <button data-type="sound">How to sound /ʌ/</button>
          <button data-type="letters">Common letters</button>
        </div>
        <div class="close" id="closeTips">Tap to close</div>
      </div>
    </div>

    <div class="overlay" id="detailOverlay">
      <div class="popup">
        <h3 id="detailTitle"></h3>
        <img id="detailImage" />
        <p id="detailText"></p>
        <div class="close" id="closeDetail">Tap to close</div>
      </div>
    </div>
  `;
  document.body.appendChild(container);

  const overlay = document.getElementById('overlay');
  const detailOverlay = document.getElementById('detailOverlay');
  const openBtn = document.getElementById('openTips');
  const closeBtn = document.getElementById('closeTips');
  const closeDetail = document.getElementById('closeDetail');
  const detailTitle = document.getElementById('detailTitle');
  const detailImage = document.getElementById('detailImage');
  const detailText = document.getElementById('detailText');

  detailImage.referrerPolicy = 'no-referrer';

  const ipaData = {
    'ʌ': {
      sound: {
        title: 'How to sound /ʌ/',
        image: 'https://lh3',
        steps: `- Latih suara /æ/.\n- Tutup mulut sedikit untuk /ʌ/.\n- Lidah berada di posisi tengah mulut.\n- /ʌ/ adalah vokal pendek dan santai.`
      },
      letters: {
        title: 'Common letters for /ʌ/',
        letters: `Sering muncul dari huruf: 
• u → cup, luck, bus
• o → love, money
• ou → country, young

Jebakan: Jangan dibaca u Indonesia. Ini bunyi “a samar”. Buka mulut hanya sedikit untuk bunyi /iy/.`
      }
    }
  };

  openBtn.onclick = () => overlay.classList.add('active');
  closeBtn.onclick = () => overlay.classList.remove('active');
  overlay.onclick = e => { if(e.target === overlay) overlay.classList.remove('active'); };
  closeDetail.onclick = () => detailOverlay.classList.remove('active');
  detailOverlay.onclick = e => { if(e.target === detailOverlay) detailOverlay.classList.remove('active'); };

  overlay.querySelectorAll('button[data-type]').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      overlay.classList.remove('active');

      const data = ipaData['ʌ'][type];
      detailTitle.textContent = data.title;

      if(type === 'sound') {
        detailImage.src = data.image;
        detailImage.style.display = 'block';
      } else {
        detailImage.style.display = 'none';
      }

      detailText.textContent = type === 'sound' ? data.steps : data.letters;

      detailOverlay.classList.add('active');
    });
  });
})();
