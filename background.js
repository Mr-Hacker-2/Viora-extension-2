chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    provider: 'OpenAI',
    model: 'gpt-4o-mini',
    apiKey: '',
    premiumMode: true,
    citationsEnabled: true,
  });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === 'save-settings') {
    chrome.storage.sync.set(message.payload, () => sendResponse({ ok: true }));
    return true;
  }

  if (message?.type === 'request-reply') {
    const prompt = String(message.prompt || '').trim();
    const reply = buildReply(prompt);
    sendResponse({ reply });
    return true;
  }

  return false;
});

function buildReply(prompt) {
  if (!prompt) {
    return 'I am ready to help. Ask me anything or give me a task to work on.';
  }

  const lower = prompt.toLowerCase();

  if (lower.includes('code') || lower.includes('debug') || lower.includes('javascript') || lower.includes('python')) {
    return 'I can help write, review, and debug code. If you share a snippet, I can explain the bug, optimize the logic, and propose a cleaner implementation.';
  }

  if (lower.includes('math') || lower.includes('equation') || lower.includes('solve')) {
    return 'For math tasks, I can walk through the steps, simplify the expression, and validate the final result with clear reasoning.';
  }

  if (lower.includes('image') || lower.includes('design') || lower.includes('illustration')) {
    return 'For image generation prompts, I can turn a concept into a crisp visual brief with composition, lighting, style, and subject details.';
  }

  if (lower.includes('automation') || lower.includes('workflow') || lower.includes('browser')) {
    return 'Automation flows can be structured into clear steps, event triggers, and end states so teams can reduce manual work and keep tasks repeatable.';
  }

  if (lower.includes('research') || lower.includes('search') || lower.includes('source')) {
    return 'I can summarize the findings and format them with relevant citations, source links, and trusted references for easier review.';
  }

  return 'Viora is designed to act as a premium AI workspace: think, write, build, design, and reason with a polished, focused experience.';
}
