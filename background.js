chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    vioraStatus: 'Ready for your next AI workflow.'
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'generateResponse') {
    const prompt = String(message.prompt || '').trim();
    const response = buildResponse(prompt);

    chrome.storage.local.set({
      vioraLastResponse: response,
      vioraStatus: 'AI response generated.'
    }, () => sendResponse({ success: true, response }));

    return true;
  }

  if (message?.type === 'clear') {
    chrome.storage.local.remove(['vioraLastResponse', 'vioraStatus'], () => {
      sendResponse({ success: true });
    });
    return true;
  }

  sendResponse({ success: false, response: 'Unsupported request.' });
  return false;
});

function buildResponse(prompt) {
  if (!prompt) {
    return 'Write a prompt to start with Viora AI.';
  }

  const normalized = prompt.toLowerCase();

  if (normalized.includes('code') || normalized.includes('debug') || normalized.includes('javascript')) {
    return `Viora can help with code generation and debugging. For this prompt, a strong starting approach is to break the task into inputs, outputs, and edge cases before implementing the fix.`;
  }

  if (normalized.includes('image') || normalized.includes('design')) {
    return `Viora image workflows can turn the prompt into a creative concept, composition plan, and style direction. Keep the prompt concise but descriptive for stronger visual output.`;
  }

  if (normalized.includes('math') || normalized.includes('equation')) {
    return `For calculations and reasoning, Viora should first identify the key variables, then work step by step to verify the final result before presenting it clearly.`;
  }

  return `Viora is ready to help with: brainstorming, coding, math reasoning, and creative generation. Your prompt was: "${prompt}". Use a clear goal, constraints, and expected output for best results.`;
}
