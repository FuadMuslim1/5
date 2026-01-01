// MatrixIntro class - adapted from red-code-intro-app
class MatrixIntro {
  constructor(onComplete) {
    this.onComplete = onComplete;
    this.overlay = null;
    this.canvas = null;
    this.ctx = null;
    this.animationFrameId = null;
    this.timer = null;
    this.resizeHandler = this.resizeCanvas.bind(this);
    this.clickHandler = this.handleClick.bind(this);
    this.init();
  }

  init() {
    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: black;
      z-index: 9999;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    this.overlay.title = 'Click to skip';

    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = `
      display: block;
      width: 100%;
      height: 100%;
    `;

    this.overlay.appendChild(this.canvas);
    document.body.appendChild(this.overlay);

    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();

    // Event listeners
    window.addEventListener('resize', this.resizeHandler);
    this.overlay.addEventListener('click', this.clickHandler);

    // Auto dismiss after 10 seconds
    this.timer = setTimeout(() => {
      this.complete();
    }, 10000);

    this.startAnimation();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  handleClick() {
    this.complete();
  }

  startAnimation() {
    // Realistic "Hacker" Code Snippets
    const codeSnippets = [
      "import { System, Kernel } from '@root/core';",
      "const BREACH_PROTOCOL = 0xFF55;",
      "void inject_payload(char* buffer) { memcpy(target, buffer, 1024); }",
      "0x45 0x89 0x12 0x00 0xFE 0xCA 0x01 0x56 0xAA 0xBB 0xCC 0xDD",
      "System.out.println('Bypassing firewall...');",
      "[ROOT] Access granted to secure node 192.168.0.x",
      "SELECT * FROM users_secure WHERE clearance_level = 'TOP_SECRET';",
      "if (security_token === null) { brute_force.start(); }",
      "Decrypting... [====================] 100%",
      "FATAL ERROR: Segment 0x00453F corrupted. Retrying...",
      "chmod 777 -R /var/www/html/mainframe",
      "Initializing neural handshake protocol...",
      "Connecting to satellite uplink... Success.",
      "Downloading user_data.enc...",
      "while(!connected) { retry_connection(timeout=500ms); }",
      "// TODO: Remove backdoor before production",
      "Warning: Intrusion detected in Sector 7",
      "Executing shell_script.sh...",
      "sudo rm -rf /logs/traces",
      "buffer_overflow_attack(target_ip, port_8080);",
      "Listening on port 443...",
      "Establish_Connection(Target_UUID);",
    ];

    const fontSize = 14;
    this.ctx.font = `600 ${fontSize}px 'JetBrains Mono'`;

    // State for the animation
    let lines = ['> _']; // Start with a prompt
    let currentSnippetIndex = 0;
    let charIndex = 0;
    let frameCount = 0;

    // Pause Control
    let pausesRemaining = 2;
    let pauseTimer = 0;
    let nextPauseThreshold = Math.floor(Math.random() * 200) + 150;
    let charsTypedSinceLastPause = 0;

    let currentText = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];

    const draw = () => {
      const lineHeight = fontSize * 1.5;
      const maxRows = Math.floor(this.canvas.height / lineHeight);

      // Dark background
      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.fillStyle = '#00FF00'; // Green text
      this.ctx.font = `600 ${fontSize}px 'JetBrains Mono'`;

      // Check if in pause state
      if (pauseTimer > 0) {
        pauseTimer--;

        // Render existing lines without adding new text
        for (let i = 0; i < lines.length; i++) {
          this.ctx.globalAlpha = 0.8 + (Math.random() * 0.2);
          this.ctx.fillText(lines[i], 20, (i + 1) * lineHeight);
        }
        this.ctx.globalAlpha = 1.0;

        // Blinking cursor during pause
        frameCount++;
        if (Math.floor(frameCount / 30) % 2 === 0) {
          const lastLine = lines[lines.length - 1];
          const charWidth = this.ctx.measureText(lastLine).width;
          this.ctx.fillRect(20 + charWidth, (lines.length * lineHeight) - lineHeight + 4, 10, fontSize);
        }

        this.animationFrameId = requestAnimationFrame(draw);
        return;
      }

      // Typing Logic
      const speed = 3;

      for (let s = 0; s < speed; s++) {
        // Check for pause trigger
        if (pausesRemaining > 0 && charsTypedSinceLastPause >= nextPauseThreshold) {
          pausesRemaining--;
          pauseTimer = 90; // ~1.5 seconds pause
          charsTypedSinceLastPause = 0;
          nextPauseThreshold = Math.floor(Math.random() * 300) + 300;
          break;
        }

        // If finished current line/snippet
        if (charIndex >= currentText.length) {
          lines.push('> ');
          currentText = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
          charIndex = 0;

          // Random indentation
          if (Math.random() > 0.5) {
            lines[lines.length - 1] += '  ';
          }
        }

        // Add next character
        const charToAdd = currentText[charIndex];
        lines[lines.length - 1] += charToAdd;
        charIndex++;
        charsTypedSinceLastPause++;
      }

      // Scroll logic
      if (lines.length > maxRows) {
        lines.splice(0, lines.length - maxRows);
      }

      // Render all lines
      for (let i = 0; i < lines.length; i++) {
        this.ctx.globalAlpha = 0.8 + (Math.random() * 0.2);
        this.ctx.fillText(lines[i], 20, (i + 1) * lineHeight);
      }
      this.ctx.globalAlpha = 1.0;

      // Blinking cursor
      frameCount++;
      if (Math.floor(frameCount / 15) % 2 === 0) {
        const lastLine = lines[lines.length - 1];
        const charWidth = this.ctx.measureText(lastLine).width;
        this.ctx.fillStyle = '#00FF00';
        this.ctx.fillRect(20 + charWidth, (lines.length * lineHeight) - lineHeight + 4, 10, fontSize);
      }

      this.animationFrameId = requestAnimationFrame(draw);
    };

    draw();
  }

  complete() {
    if (this.timer) clearTimeout(this.timer);
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('resize', this.resizeHandler);
    if (this.overlay) {
      this.overlay.removeEventListener('click', this.clickHandler);
      document.body.removeChild(this.overlay);
    }
    this.onComplete();
  }
}

// GreetingPopup class - adapted from red-code-intro-app
class GreetingPopup {
  constructor(onComplete) {
    this.onComplete = onComplete;
    this.overlay = null;
    this.timer = null;
    this.init();
  }

  init() {
    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      backdrop-filter: blur(10px);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;

    // Create popup content
    const popup = document.createElement('div');
    popup.style.cssText = `
      max-width: 500px;
      width: 90%;
      padding: 40px;
      background: rgba(30, 41, 59, 0.9);
      border: 1px solid rgba(34, 197, 94, 0.3);
      border-radius: 20px;
      box-shadow: 0 0 60px rgba(34, 197, 94, 0.2);
      text-align: center;
      transform: scale(0.9) translateY(20px);
      transition: all 0.7s ease-out;
    `;

    // Skull icon (using emoji as fallback)
    const skullDiv = document.createElement('div');
    skullDiv.style.cssText = `
      margin-bottom: 30px;
      display: flex;
      justify-content: center;
    `;
    const skullIcon = document.createElement('div');
    skullIcon.style.cssText = `
      font-size: 4rem;
      animation: pulse 2s infinite;
    `;
    skullIcon.textContent = '💀';
    skullDiv.appendChild(skullIcon);

    // Title
    const title = document.createElement('h2');
    title.style.cssText = `
      font-size: 4rem;
      font-weight: bold;
      color: white;
      margin-bottom: 20px;
      letter-spacing: -2px;
    `;
    title.innerHTML = 'Ready<span style="color: #22c55e;">???</span>';

    // Emoji
    const emoji = document.createElement('p');
    emoji.style.cssText = `
      font-size: 3rem;
      margin: 20px 0;
      animation: bounce 1s infinite;
    `;
    emoji.textContent = '😈';

    // Instruction text
    const instruction = document.createElement('div');
    instruction.style.cssText = `
      margin-top: 30px;
      font-size: 0.8rem;
      color: #9ca3af;
      font-family: monospace;
      text-transform: uppercase;
      letter-spacing: 2px;
    `;
    instruction.textContent = 'Click anywhere to continue';

    // Assemble popup
    popup.appendChild(skullDiv);
    popup.appendChild(title);
    popup.appendChild(emoji);
    popup.appendChild(instruction);

    this.overlay.appendChild(popup);
    document.body.appendChild(this.overlay);

    // Event listener
    this.overlay.addEventListener('click', () => this.complete());

    // Auto dismiss after 10 seconds
    this.timer = setTimeout(() => {
      this.complete();
    }, 10000);

    // Trigger entrance animation
    requestAnimationFrame(() => {
      this.overlay.style.opacity = '1';
      popup.style.transform = 'scale(1) translateY(0)';
    });
  }

  complete() {
    if (this.timer) clearTimeout(this.timer);
    if (this.overlay) {
      this.overlay.style.opacity = '0';
      setTimeout(() => {
        if (this.overlay && this.overlay.parentNode) {
          this.overlay.parentNode.removeChild(this.overlay);
        }
      }, 300);
    }
    this.onComplete();
  }
}

// Main popup sequence
function showPopups() {
  new MatrixIntro(() => {
    new GreetingPopup(() => {
      // Popups complete, homepage is now visible
    });
  });
}

// Auto-start popups when page loads
document.addEventListener('DOMContentLoaded', showPopups);
