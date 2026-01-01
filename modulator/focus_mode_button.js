// focus_mode_button.js — Eye-catching fonts
(function() {
  // =====================
  // 0. Add Google Fonts
  // =====================
  const link = document.createElement('link');
  link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@700&family=Roboto:wght@400;500&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);

  // =====================
  // 1. Add CSS to <head>
  // =====================
  const style = document.createElement('style');
  style.textContent = `
    body {
      margin: 0;
      font-family: 'Roboto', sans-serif;
      background-color: #f9f9f9;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      transition: background-color 0.3s, color 0.3s;
      text-align: center;
      color: #111;
    }

    /* Gradient Heading with Shadow */
    h1.center-text {
      font-family: 'Poppins', sans-serif;
      font-size: 3rem;
      font-weight: 700;
      letter-spacing: 1px;
      margin-bottom: 10px;
      background: linear-gradient(90deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
    }

    p.center-text:first-of-type {
      font-size: 1.8rem;
      font-weight: 500;
      margin-bottom: 10px;
    }

    p.center-text:last-of-type {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 10px;
    }

    .center-text { text-align: center; }

    .main-content {
      padding: 30px;
      transition: color 0.3s, padding-bottom 0.3s, padding-top 0.3s;
    }

    .focus-active {
      background-color: #111 !important;
      color: #fff !important;
    }

    body.focus-active a,
    body.focus-active h1,
    body.focus-active h2,
    body.focus-active p,
    body.focus-active li {
      color: #fff !important;
    }

    #focusWrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 10px;
    }

    #focusControls {
      display: none;
      gap: 5px;
      margin-top: 5px;
    }

    /* Eye-catching gradient button */
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
      display: none;
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

    #floatingPlayer.active { display: block; }

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

    #showBtn { display: none; }

    #exampleWords ul {
      list-style: none;
      padding: 0;
      margin: 0;
      text-align: center;
    }

    #exampleWords ul li {
      text-align: center;
      font-size: 20px;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);

  // =====================
  // 2. Add HTML to body
  // =====================
  const mainContentHTML = `
    <div class="main-content" id="mainContent">
      <h1 class="center-text">Vowel</h1>
      <p class="center-text">(Lax)</p>
      <p class="center-text">/ʌ/</p>
      <div id="exampleWords">
        <h2 class="center-text"></h2>
        <div id="focusWrapper">
          <button id="showBtn" class="gradient-button">Show</button>
          <button id="focusModeBtn" class="gradient-button">Focus Mode</button>
          <div id="focusControls">
            <button id="playBtn" class="gradient-button">▶</button>
            <button id="pauseBtn" class="gradient-button">❚❚</button>
            <button id="stopBtn" class="gradient-button">■</button>
          </div>
        </div>
        <ul class="center-text"></ul>
      </div>
    </div>
    <div id="floatingPlayer" class="floating-player">
      <button id="closeFloating" class="close-btn">×</button>
      <div id="player"></div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', mainContentHTML);

  // =====================
  // 3. Data & Variables
  // =====================
  const words = [{ text: "", start: 0.2, end: 0.6 }];
  let player, playerReady = false;
  let isFocusMode = false;
  const playQueue = [];
  const focusModeBtn = document.getElementById('focusModeBtn');
  const showBtn = document.getElementById('showBtn');
  const focusControls = document.getElementById('focusControls');
  const floatingPlayer = document.getElementById('floatingPlayer');
  const playBtn = document.getElementById('playBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const stopBtn = document.getElementById('stopBtn');
  const mainContent = document.getElementById('mainContent');
  const exampleWords = document.getElementById('exampleWords');
  const closeFloating = document.getElementById("closeFloating");

  // =====================
  // 4. Generate Word List
  // =====================
  function generateWordList() {
    const ul = exampleWords.querySelector("ul");
    ul.innerHTML = "";
    words.forEach(w => {
      const li = document.createElement("li");
      li.textContent = w.text;
      li.addEventListener("click", () => {
        if (playerReady) {
          player.seekTo(w.start, true);
          player.playVideo();
        }
      });
      ul.appendChild(li);
    });
  }
  generateWordList();

  // =====================
  // 5. Focus Mode
  // =====================
  focusModeBtn.addEventListener('click', () => {
    focusModeBtn.classList.add('clicked');
    setTimeout(() => focusModeBtn.classList.remove('clicked'), 300);
    isFocusMode = !isFocusMode;
    if (isFocusMode) {
      focusModeBtn.classList.add('active');
      focusModeBtn.textContent = 'Normal Mode';
      focusControls.style.display = 'flex';
      document.body.classList.add('focus-active');
      mainContent.style.paddingBottom = "100px";
      const offsetTop = exampleWords.getBoundingClientRect().top + window.scrollY - 20;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      if (playerReady) {
        player.seekTo(0, true);
        player.playVideo();
      } else { playQueue.push("play"); }
    } else {
      focusModeBtn.classList.remove('active');
      focusModeBtn.textContent = 'Focus Mode';
      focusControls.style.display = 'none';
      document.body.classList.remove('focus-active');
      mainContent.classList.remove('focus-active');
      if (playerReady) {
        player.pauseVideo();
        player.stopVideo();
      }
    }
  });

  // =====================
  // 6. Control Buttons
  // =====================
  playBtn.addEventListener('click', () => playerReady && player.playVideo());
  pauseBtn.addEventListener('click', () => playerReady && player.pauseVideo());
  stopBtn.addEventListener('click', () => playerReady && player.stopVideo());

  // =====================
  // 7. YouTube API
  // =====================
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  document.body.appendChild(tag);
  window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('player', {
      height: '100%',
      width: '100%',
      videoId: 'e6rjJiOxVCs',
      playerVars: { controls: 1 },
      events: { onReady: onPlayerReady }
    });
  };
  function onPlayerReady() {
    playerReady = true;
    playQueue.forEach(() => player.playVideo());
    playQueue.length = 0;
  }

  // =====================
  // 8. Draggable Floating Player
  // =====================
  let isDragging = false, offsetX, offsetY;
  floatingPlayer.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - floatingPlayer.offsetLeft;
    offsetY = e.clientY - floatingPlayer.offsetTop;
  });
  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    floatingPlayer.style.left = e.clientX - offsetX + "px";
    floatingPlayer.style.top = e.clientY - offsetY + "px";
  });
  document.addEventListener("mouseup", () => { isDragging = false; });
  closeFloating.addEventListener("click", () => {
    floatingPlayer.classList.remove('active');
    setTimeout(() => floatingPlayer.style.display = 'none', 300);
    focusControls.style.display = 'none';
  });
})();
