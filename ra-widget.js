// Ra — AI Support Widget | Nile Dreams Digital
// Usage: initRa({ systemPrompt: '...', accentColor: '#FF6B35' })
(function () {
  const RA_ENDPOINT = 'https://hvyfeebazmiqateniupm.supabase.co/functions/v1/ra-chat';

  window.initRa = function ({ systemPrompt = '', accentColor = '#FF6B35', productName = 'Ra' } = {}) {
    if (document.getElementById('ra-fab')) return; // already mounted

    const ac = accentColor;
    const acDim = ac + '22';
    const acBorder = ac + '33';

    const css = `
      #ra-fab {
        position: fixed; bottom: 24px; right: 24px; z-index: 99999;
        display: flex; align-items: center; gap: 8px;
        padding: 12px 18px; border-radius: 28px;
        background: ${ac}; color: #1a0a00;
        font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif;
        font-weight: 800; font-size: 14px; cursor: pointer; border: none;
        box-shadow: 0 6px 24px ${ac}55; transition: transform .2s, box-shadow .2s;
      }
      #ra-fab:hover { transform: translateY(-2px); box-shadow: 0 10px 32px ${ac}77; }
      #ra-modal {
        position: fixed; bottom: 88px; right: 24px; z-index: 99999;
        width: 360px; max-width: calc(100vw - 32px); max-height: 520px;
        display: none; flex-direction: column;
        background: #100818; border: 1px solid ${acBorder};
        border-radius: 18px; box-shadow: 0 16px 56px rgba(0,0,0,0.6);
        font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif;
        overflow: hidden;
      }
      #ra-modal.open { display: flex; }
      #ra-modal-header {
        background: ${ac}; color: #1a0a00;
        padding: 14px 16px; display: flex; justify-content: space-between; align-items: center;
      }
      #ra-modal-header .ra-title { font-weight: 900; font-size: 14px; }
      #ra-modal-header .ra-subtitle { font-size: 10px; font-weight: 600; opacity: .7; margin-top: 1px; }
      #ra-close { cursor: pointer; font-size: 18px; opacity: .7; background: none; border: none; color: #1a0a00; line-height: 1; }
      #ra-close:hover { opacity: 1; }
      #ra-messages {
        flex: 1; overflow-y: auto; padding: 16px;
        display: flex; flex-direction: column; gap: 10px;
        scrollbar-width: thin; scrollbar-color: ${acBorder} transparent;
      }
      .ra-msg { max-width: 88%; line-height: 1.5; font-size: 13px; }
      .ra-msg.ra-bot {
        align-self: flex-start;
        background: #1c0d2a; border: 1px solid ${acBorder};
        border-radius: 4px 14px 14px 14px; padding: 10px 13px; color: #f0e8ff;
      }
      .ra-msg.ra-user {
        align-self: flex-end;
        background: ${ac}; color: #1a0a00; font-weight: 600;
        border-radius: 14px 4px 14px 14px; padding: 10px 13px;
      }
      .ra-msg.ra-loading {
        align-self: flex-start;
        background: #1c0d2a; border: 1px solid ${acBorder};
        border-radius: 4px 14px 14px 14px; padding: 10px 16px;
      }
      .ra-dots { display: inline-flex; gap: 4px; }
      .ra-dots span {
        width: 6px; height: 6px; border-radius: 50%; background: ${ac};
        animation: ra-bounce 1.2s ease-in-out infinite;
      }
      .ra-dots span:nth-child(2) { animation-delay: .2s; }
      .ra-dots span:nth-child(3) { animation-delay: .4s; }
      @keyframes ra-bounce { 0%,80%,100% { transform: scale(.6); opacity:.4; } 40% { transform: scale(1); opacity:1; } }
      #ra-input-row {
        border-top: 1px solid ${acBorder}; padding: 12px 14px;
        display: flex; gap: 8px; align-items: flex-end;
      }
      #ra-input {
        flex: 1; background: #1c0d2a; border: 1px solid ${acBorder};
        color: #f0e8ff; font-size: 13px; border-radius: 10px;
        padding: 9px 12px; resize: none; outline: none; line-height: 1.4;
        font-family: inherit; max-height: 80px;
      }
      #ra-input::placeholder { color: #6b5080; }
      #ra-input:focus { border-color: ${ac}66; }
      #ra-send {
        background: ${ac}; color: #1a0a00; border: none; border-radius: 10px;
        width: 36px; height: 36px; cursor: pointer; font-size: 16px;
        display: flex; align-items: center; justify-content: center;
        transition: opacity .15s; flex-shrink: 0;
      }
      #ra-send:hover { opacity: .85; }
      #ra-send:disabled { opacity: .4; cursor: default; }
      #ra-powered {
        text-align: center; font-size: 10px; color: #4a3560;
        padding: 6px 0 8px; background: #0c0618;
      }
    `;

    const styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    const fab = document.createElement('button');
    fab.id = 'ra-fab';
    fab.innerHTML = '&#x1F4AC; Chat with Ra';
    fab.setAttribute('aria-label', 'Chat with Ra AI support');

    const modal = document.createElement('div');
    modal.id = 'ra-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-label', 'Ra AI support chat');
    modal.innerHTML = `
      <div id="ra-modal-header">
        <div>
          <div class="ra-title">&#x2728; Ra — AI Support</div>
          <div class="ra-subtitle">Powered by Claude Sonnet</div>
        </div>
        <button id="ra-close" aria-label="Close">&#x2715;</button>
      </div>
      <div id="ra-messages" aria-live="polite"></div>
      <div id="ra-input-row">
        <textarea id="ra-input" placeholder="Ask anything..." rows="1"></textarea>
        <button id="ra-send" aria-label="Send">&#x27A4;</button>
      </div>
      <div id="ra-powered">Powered by Claude Sonnet 4.6 &middot; Nile Dreams Digital</div>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(modal);

    const messagesEl = document.getElementById('ra-messages');
    const inputEl = document.getElementById('ra-input');
    const sendBtn = document.getElementById('ra-send');

    const conversationHistory = [];

    function appendMessage(role, text) {
      const el = document.createElement('div');
      el.className = `ra-msg ra-${role}`;
      el.textContent = text;
      messagesEl.appendChild(el);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return el;
    }

    function appendLoading() {
      const el = document.createElement('div');
      el.className = 'ra-msg ra-loading';
      el.innerHTML = '<div class="ra-dots"><span></span><span></span><span></span></div>';
      messagesEl.appendChild(el);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return el;
    }

    function showGreeting() {
      appendMessage('bot', "Hi! I'm Ra, your AI support assistant. How can I help you today?");
    }

    async function sendMessage() {
      const text = inputEl.value.trim();
      if (!text) return;

      inputEl.value = '';
      inputEl.style.height = 'auto';
      sendBtn.disabled = true;

      appendMessage('user', text);
      conversationHistory.push({ role: 'user', content: text });

      const loadingEl = appendLoading();

      try {
        const res = await fetch(RA_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system: systemPrompt,
            messages: conversationHistory,
            maxTokens: 512,
          }),
        });

        const data = await res.json();
        loadingEl.remove();

        if (data.error) {
          appendMessage('bot', 'Sorry, I ran into an issue. Please email thothwisdom7@gmail.com for help.');
          return;
        }

        const reply = data.content?.[0]?.text || 'Sorry, I could not generate a response.';
        conversationHistory.push({ role: 'assistant', content: reply });
        appendMessage('bot', reply);
      } catch {
        loadingEl.remove();
        appendMessage('bot', 'Connection error. Please try again or email thothwisdom7@gmail.com.');
      } finally {
        sendBtn.disabled = false;
        inputEl.focus();
      }
    }

    fab.addEventListener('click', () => {
      const isOpen = modal.classList.toggle('open');
      if (isOpen && messagesEl.children.length === 0) showGreeting();
      if (isOpen) setTimeout(() => inputEl.focus(), 50);
    });

    document.getElementById('ra-close').addEventListener('click', () => {
      modal.classList.remove('open');
    });

    sendBtn.addEventListener('click', sendMessage);

    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    inputEl.addEventListener('input', () => {
      inputEl.style.height = 'auto';
      inputEl.style.height = Math.min(inputEl.scrollHeight, 80) + 'px';
    });
  };
})();
