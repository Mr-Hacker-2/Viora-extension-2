const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const chatMessages = document.getElementById('chatMessages');
const imagePrompt = document.getElementById('imagePrompt');
const generateImageBtn = document.getElementById('generateImageBtn');
const imagePreview = document.getElementById('imagePreview');
const runAutomationBtn = document.getElementById('runAutomationBtn');
const automationStatus = document.getElementById('automationStatus');
const deployBtn = document.getElementById('deployBtn');
const providerSelect = document.getElementById('providerSelect');

function setActiveTab(targetId) {
  tabs.forEach((tab) => {
    const isActive = tab.dataset.target === targetId;
    tab.classList.toggle('active', isActive);
  });

  panels.forEach((panel) => {
    const isActive = panel.id === targetId;
    panel.classList.toggle('active', isActive);
  });
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => setActiveTab(tab.dataset.target));
});

function appendMessage(role, text) {
  const message = document.createElement('div');
  message.className = `message ${role}`;

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;

  message.appendChild(bubble);
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function askViora(prompt) {
  if (!prompt) {
    return;
  }

  appendMessage('user', prompt);
  chatInput.value = '';

  const reply = await new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: 'request-reply', prompt }, (response) => {
      resolve(response?.reply || 'I am ready to help.');
    });
  });

  appendMessage('assistant', reply);
}

sendBtn.addEventListener('click', () => askViora(chatInput.value.trim()));
chatInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    askViora(chatInput.value.trim());
  }
});

document.querySelectorAll('.feature-card').forEach((card) => {
  card.addEventListener('click', () => {
    setActiveTab('chat-panel');
    askViora(card.dataset.example);
  });
});

generateImageBtn.addEventListener('click', () => {
  const promptText = imagePrompt.value.trim() || 'Futuristic AI workspace with glass panels and neon gradients';
  imagePreview.style.background = `
    linear-gradient(150deg, rgba(34, 211, 238, 0.9), rgba(124, 58, 237, 0.8)),
    radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), transparent 18%),
    url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0" x2="1" y1="0" y2="1"%3E%3Cstop stop-color="%230b1120" offset="0"/%3E%3Cstop stop-color="%232b1f64" offset="1"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="600" height="400" fill="url(%23g)"/%3E%3Cg fill="none" stroke="rgba(255,255,255,0.38)" stroke-width="2"%3E%3Cpath d="M60 280 L180 160 L270 220 L350 90 L520 230 L560 170"/%3E%3Cpath d="M70 330 L200 240 L290 290 L360 210 L520 290"/%3E%3C/g%3E%3Ccircle cx="200" cy="140" r="34" fill="rgba(34,211,238,0.6)"/%3E%3Ccircle cx="398" cy="124" r="26" fill="rgba(124,58,237,0.65)"/%3E%3C/svg%3E');
  `;
  imagePreview.style.backgroundSize = 'cover';
  imagePreview.style.backgroundPosition = 'center';
  imagePreview.title = promptText;
});

runAutomationBtn.addEventListener('click', () => {
  automationStatus.textContent = 'Running workflow: research review → content draft → citations → next steps';
  setTimeout(() => {
    automationStatus.textContent = 'Automation complete. AI tasks generated and queue is ready for review.';
  }, 1200);
});

deployBtn.addEventListener('click', () => {
  const message = 'Deployment package prepared: viora-extension-6-1-Best-VR';
  automationStatus.textContent = message;
  appendMessage('assistant', message);
});

providerSelect.addEventListener('change', () => {
  chrome.storage.sync.set({ provider: providerSelect.value }, () => {
    // no-op; persistence only
  });
});

chrome.storage.sync.get(['provider'], (items) => {
  if (items.provider) {
    providerSelect.value = items.provider;
  }
});
