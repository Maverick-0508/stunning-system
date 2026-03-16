// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
    hideOutput();
    hideError();
  });
});

// Generate form
document.getElementById('generate-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('generate-btn');
  const payload = {
    topic: document.getElementById('topic').value,
    content_type: document.getElementById('content_type').value,
    tone: document.getElementById('tone').value,
  };
  await callAPI('/generate', payload, btn);
});

// Summarize form
document.getElementById('summarize-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('summarize-btn');
  const payload = {
    document: document.getElementById('document').value,
    length: document.getElementById('length').value,
  };
  await callAPI('/summarize', payload, btn);
});

async function callAPI(endpoint, payload, btn) {
  setLoading(btn, true);
  hideOutput();
  hideError();

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok || data.error) {
      showError(data.error || 'An unexpected error occurred.');
    } else {
      showOutput(data.result);
    }
  } catch (err) {
    showError('Network error: ' + err.message);
  } finally {
    setLoading(btn, false);
  }
}

function setLoading(btn, loading) {
  btn.disabled = loading;
  btn.querySelector('.btn-text').hidden = loading;
  btn.querySelector('.btn-spinner').hidden = !loading;
}

function showOutput(text) {
  const section = document.getElementById('output-section');
  const box = document.getElementById('output-box');
  box.textContent = text;
  section.hidden = false;
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideOutput() {
  document.getElementById('output-section').hidden = true;
}

function showError(msg) {
  const box = document.getElementById('error-box');
  box.textContent = msg;
  box.hidden = false;
}

function hideError() {
  document.getElementById('error-box').hidden = true;
}

// Copy to clipboard
document.getElementById('copy-btn').addEventListener('click', () => {
  const text = document.getElementById('output-box').textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copy-btn');
    btn.textContent = '✅ Copied!';
    setTimeout(() => { btn.textContent = '📋 Copy'; }, 2000);
  }).catch(() => {
    showError('Could not copy to clipboard. Please copy the text manually.');
  });
});
