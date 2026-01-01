// ====================================================
// MODULATOR: Word List with IPA + Focus Mode + Animasi
// ====================================================

(function() {
  // =====================
  // 0. Tambahkan Google Fonts
  // =====================
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Roboto:wght@400;500;700&display=swap';
  document.head.appendChild(link);

  // =====================
  // 1. Tambahkan CSS dinamis
  // =====================
  const style = document.createElement('style');
  style.textContent = `
    * { margin:0; padding:0; box-sizing:border-box; font-family:'Roboto', 'Segoe UI', sans-serif; }

    body {
      width:100%;
      background:#f9f9f9;
      display:flex;
      flex-direction:column;
      align-items:center;
      padding:20px 0;
      transition: background 0.3s, color 0.3s;
    }

    .container {
      max-width:1200px;
      width:95%;
      margin:40px auto;
      padding:20px;
      text-align:center;
      background:#fdf6fb;
      border-radius:12px;
      transition: background 0.3s, transform 0.3s, opacity 0.3s;
    }

    .container h1 {
      margin-bottom:30px;
      font-size:2.5rem;
      color:#333;
      letter-spacing:1px;
      font-family: 'Montserrat', sans-serif;
    }

    .word-grid {
      display:grid;
      grid-template-columns:repeat(auto-fill, minmax(120px,1fr));
      gap:20px;
      justify-items:center;
      align-items:start;
    }

    .word-card {
      background: linear-gradient(135deg, #b951b6ff, #fffaf8ff);
      border-radius:30px;
      padding:20px 15px;
      width:120px;
      box-shadow:0 5px 15px rgba(0,0,0,0.15);
      transition: transform 0.3s, box-shadow 0.3s, background 0.5s;
      cursor:default;
      opacity:0;
      transform:scale(0.8);
      animation: fadeScaleIn 0.5s forwards;
      position:relative;
      overflow:hidden;
    }

    .word-card:hover {
      transform:translateY(-10px) scale(1.1);
      box-shadow:0 20px 40px rgba(0,0,0,0.3);
      background: linear-gradient(135deg, #fbc2eb, #a6c1ee);
    }

    .word-card .word {
      font-size:1.2rem;
      font-weight:600;
      color:#2d2d2d;
      margin-bottom:8px;
      transition:color 0.3s;
      position:relative;
      z-index:1;
    }

    .word-card .ipa {
      font-size:0.9rem;
      color:#5f5f6e;
      transition: color 0.3s, font-weight 0.3s, transform 0.3s;
      position:relative;
      z-index:1;
    }

    .word-card:hover .ipa {
      color:#fff;
      font-weight:700;
      transform: translateY(-5px) scale(1.1);
    }

    @keyframes fadeScaleIn {
      to { opacity:1; transform:scale(1); }
    }

    @media(max-width:600px){
      .word-card{width:90px; padding:15px 10px;}
      .word-card .word{font-size:1rem;}
      .word-card .ipa{font-size:0.8rem;}
    }

    /* ===============================
       FOCUS MODE
    =============================== */
    body.focus-active {
      background:#111;
      color:#fff;
    }

    body.focus-active .module-container.focus-primary {
      background:#111 !important;
      opacity:1 !important;
      transform:scale(1) !important;
    }

    body.focus-active .module-container.focus-primary > h1 {
      color:#f0f0f0 !important;
    }

    body.focus-active .module-container.focus-primary .word-card {
      background: linear-gradient(135deg, #090909, #111);
    }

    body.focus-active .module-container.focus-primary .word-card .word,
    body.focus-active .module-container.focus-primary .word-card .ipa {
      color: #f8f0f0;
    }

    body.focus-active .module-container.focus-primary .word-card::before {
      content:"";
      position:absolute;
      inset:0;
      border-radius:30px;
      padding:2px;
      background: linear-gradient(135deg, #a855f7, #c084fc, #8b5cf6);
      -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events:none;
      opacity:0.9;
      animation: neonPulse 2s infinite alternate;
    }

    @keyframes neonPulse {
      0% { filter: drop-shadow(0 0 4px rgba(168,85,247,0.7)) drop-shadow(0 0 8px rgba(192,132,252,0.5)); }
      50% { filter: drop-shadow(0 0 10px rgba(168,85,247,1)) drop-shadow(0 0 18px rgba(192,132,252,0.8)); }
      100% { filter: drop-shadow(0 0 4px rgba(168,85,247,0.7)) drop-shadow(0 0 8px rgba(192,132,252,0.5)); }
    }

    body.focus-active .module-container.focus-primary .word-card:hover::before {
      filter: drop-shadow(0 0 12px rgba(168,85,247,1)) drop-shadow(0 0 20px rgba(192,132,252,0.9));
    }
  `;
  document.head.appendChild(style);

  // =====================
  // 2. Buat container HTML
  // =====================
  const container = document.createElement('div');
  container.classList.add('container', 'module-container', 'focus-primary');

  const title = document.createElement('h1');
  title.textContent = 'Examples:';
  container.appendChild(title);

  const wordGrid = document.createElement('div');
  wordGrid.classList.add('word-grid');
  container.appendChild(wordGrid);

  document.body.appendChild(container);

  // =====================
  // 3. Array kata
  // =====================
  const words = [
    { text:"Up", ipa:"/ʌp/" }, { text:"Cup", ipa:"/kʌp/" },
    { text:"But", ipa:"/bʌt/" }, { text:"Luck", ipa:"/lʌk/" },
    { text:"Fun", ipa:"/fʌn/" }, { text:"Love", ipa:"/lʌv/" },
    { text:"Come", ipa:"/kʌm/" }, { text:"Bus", ipa:"/bʌs/" },
    { text:"Sunday", ipa:"/ˈsʌnˌdeɪ/" }, { text:"Cut", ipa:"/kʌt/" },
    { text:"Much", ipa:"/mʌʧ/" }, { text:"Us", ipa:"/ʌs/" },
    { text:"Run", ipa:"/rʌn/" }, { text:"Gun", ipa:"/gʌn/" },
    { text:"Jump", ipa:"/ʤʌmp/" }, { text:"Shut", ipa:"/ʃʌt/" },
    { text:"Dust", ipa:"/dʌst/" }, { text:"Trust", ipa:"/trʌst/" },
    { text:"Stuff", ipa:"/stʌf/" }, { text:"Dull", ipa:"/dʌl/" },
    { text:"Ugly", ipa:"/ˈʌgli/" }, { text:"Uncle", ipa:"/ˈʌŋkəl/" },
    { text:"Under", ipa:"/ˈʌndɚ/" }, { text:"Onion", ipa:"/ˈʌnjən/" },
    { text:"Money", ipa:"/ˈmʌni/" }, { text:"Honey", ipa:"/ˈhʌni/" },
    { text:"Cover", ipa:"/ˈkʌvɚ/" }, { text:"Worry", ipa:"/ˈwʌri/" },
    { text:"Hurry", ipa:"/ˈhʌri/" }, { text:"Touch", ipa:"/tʌʧ/" },
  ];

  // =====================
  // 4. Buat word cards
  // =====================
  words.forEach((item,index)=>{
    const card=document.createElement('div');
    card.classList.add('word-card');
    card.style.animationDelay=`${index*0.05}s`;

    const wordElem=document.createElement('div');
    wordElem.classList.add('word');
    wordElem.textContent=item.text;

    const ipaElem=document.createElement('div');
    ipaElem.classList.add('ipa');
    ipaElem.textContent=item.ipa;

    card.appendChild(wordElem);
    card.appendChild(ipaElem);
    wordGrid.appendChild(card);
  });

  
})();
