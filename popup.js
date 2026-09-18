const promptInput = document.getElementById('promptInput');
const generateBtn = document.getElementById('generateBtn');
const clearBtn = document.getElementById('clearBtn');
const responseOutput = document.getElementById('responseOutput');
const featureButtons = document.querySelectorAll('.feature-btn');

let currentMode = 'chat';

featureButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentMode = button.dataset.mode;
    featureButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
    promptInput.placeholder = getPlaceholder(currentMode);
  });
});

generateBtn.addEventListener('click', async () => {
  const prompt = promptInput.value.trim();

  if (!prompt) {
    responseOutput.textContent = 'Please enter a prompt before generating.';
    return;
  }

  responseOutput.textContent = 'Generating...';

  const response = await chrome.runtime.sendMessage({
    type: 'generateResponse',
    prompt: `${currentMode}: ${prompt}`
  });

  if (response?.success) {
    responseOutput.textContent = response.response;
  } else {
    responseOutput.textContent = 'Unable to generate a response.';
  }
});

clearBtn.addEventListener('click', async () => {
  const result = await chrome.runtime.sendMessage({ type: 'clear' });

  if (result?.success) {
    promptInput.value = '';
    responseOutput.textContent = 'Ready for your next AI workflow.';
  }
});

function getPlaceholder(mode) {
  const placeholders = {
    chat: 'Ask Viora to brainstorm, answer questions, or plan a task...',
    code: 'Ask Viora to write, debug, or explain code...',
    image: 'Describe the image concept or design you want to generate...'
  };

  return placeholders[mode] || placeholders.chat;
}

chrome.storage.local.get(['vioraLastResponse', 'vioraStatus'], (result) => {
  if (result.vioraLastResponse) {
    responseOutput.textContent = result.vioraLastResponse;
  } else if (result.vioraStatus) {
    responseOutput.textContent = result.vioraStatus;
  }
});
