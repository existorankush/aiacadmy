document.addEventListener('DOMContentLoaded', () => {
  const messagesEl = document.getElementById('chatMessages');
  const inputEl = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendMessage');
  const clearBtn = document.getElementById('clearChat');
  const typingEl = document.getElementById('typingIndicator');

  const LS_KEY = 'aicademy_chat_history_v1';

  function loadHistory() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveHistory(history) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(history)); } catch {}
  }

  function renderMessage({ role, text, time }) {
    const wrapper = document.createElement('div');
    wrapper.className = `d-flex mb-3 ${role === 'user' ? 'justify-content-end' : 'justify-content-start'}`;
    const bubble = document.createElement('div');
    bubble.className = `p-3 rounded ${role === 'user' ? 'bg-primary text-white' : 'bg-light border'}`;
    bubble.style.maxWidth = '70%';
    bubble.innerHTML = `${escapeHTML(text)}<div class="small text-muted mt-1">${time}</div>`;
    wrapper.appendChild(bubble);
    messagesEl.appendChild(wrapper);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function nowTime() {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function showTyping(show) {
    typingEl.style.display = show ? 'block' : 'none';
  }

  function generateReply(userText) {
    const text = userText.toLowerCase();

    if (/hello|hi|hey/.test(text)) {
      return 'Hello! I\'m your AI Study Buddy. Ask me about topics, plans, or practice tips.';
    }
    if (/(plan|study plan|schedule)/.test(text)) {
      return 'Here\'s a simple plan: 1) Pick 3 focus topics, 2) 30-minute deep work blocks, 3) 10-minute spaced recall, 4) Practice 5 questions per topic, 5) Review mistakes and create flashcards.';
    }
    if (/(resource|book|note|material)/.test(text)) {
      return 'Try curated resources: open the Study Resources page from the navbar. Also, summarize your notes with active recall: write what you remember, then check source for gaps.';
    }
    if (/(quiz|practice|question)/.test(text)) {
      return 'Use the Quiz pages in the Pages dropdown (General, SST, Competitive). After each attempt, review incorrect answers and tag concepts.';
    }
    if (/(focus|motivation|stress)/.test(text)) {
      return 'Quick reset: 2 minutes of box breathing (4-4-4-4), write your next micro-goal, and start a 15-minute timer. Momentum beats perfection.';
    }

    // Default supportive response
    return 'Got it. Can you share your current topic and goal? I\'ll suggest a mini plan and a set of practice checkpoints.';
  }

  function sendUserMessage(text) {
    const history = loadHistory();
    const userMsg = { role: 'user', text, time: nowTime() };
    history.push(userMsg);
    saveHistory(history);
    renderMessage(userMsg);
  }

  function sendBotReply(userText) {
    showTyping(true);
    setTimeout(() => {
      const reply = generateReply(userText);
      const botMsg = { role: 'bot', text: reply, time: nowTime() };
      const history = loadHistory();
      history.push(botMsg);
      saveHistory(history);
      renderMessage(botMsg);
      showTyping(false);
    }, 600);
  }

  function handleSend() {
    const text = (inputEl.value || '').trim();
    if (!text) return;
    inputEl.value = '';
    sendUserMessage(text);
    sendBotReply(text);
  }

  function restoreChat() {
    const history = loadHistory();
    if (history.length === 0) {
      const welcome = { role: 'bot', text: 'Welcome! I can help with study plans, resources, and practice strategies. Ask me anything.', time: nowTime() };
      saveHistory([welcome]);
    }
    loadHistory().forEach(renderMessage);
  }

  // Events
  sendBtn.addEventListener('click', handleSend);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend();
  });
  clearBtn.addEventListener('click', () => {
    localStorage.removeItem(LS_KEY);
    messagesEl.innerHTML = '';
    restoreChat();
  });

  // Init
  restoreChat();
});