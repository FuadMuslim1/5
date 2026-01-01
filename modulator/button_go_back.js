class GoBackButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
      <style>
        .wrapper {
          position: fixed;
          top: 15px;
          right: 15px;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: linear-gradient(45deg, #feda75, #fa7e1e, #d62976, #8134af);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 1002;
        }

        .button {
          width: 37px;
          height: 37px;
          border-radius: 50%;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .wrapper:hover .button {
          transform: scale(1.08);
          box-shadow: 0 4px 10px rgba(0,0,0,0.35);
        }

        i {
          font-size: 18px;
          color: #000;
        }
      </style>

      <div class="wrapper" id="goBackButton">
        <div class="button">
          <i class="fas fa-arrow-left"></i>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    this.shadowRoot
      .getElementById('goBackButton')
      .addEventListener('click', () => history.back());
  }
}

customElements.define('go-back-button', GoBackButton);
