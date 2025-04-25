window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition;
const recordBtn = document.getElementById('recordBtn');
const recordStatus = document.getElementById('recordStatus');
const saveBtn = document.getElementById('saveBtn');
const correctBtn = document.getElementById('correctBtn');
const noteArea = document.getElementById('note');
const savedNotes = document.getElementById('savedNotes');

if (window.SpeechRecognition) {
  recognition = new window.SpeechRecognition();
  recognition.lang = 'nl-NL';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    recordStatus.textContent = 'Opnemen...';
    recordBtn.disabled = true;
  };

  recognition.onend = () => {
    recordStatus.textContent = '';
    recordBtn.disabled = false;
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    noteArea.value = transcript;
  };

  recordBtn.addEventListener('click', () => {
    recognition.start();
  });
} else {
  recordBtn.disabled = true;
  recordBtn.textContent = '🎙️ Niet ondersteund';
}

correctBtn.addEventListener('click', () => {
  const raw = noteArea.value;
  if (!raw) return;
  let text = raw.trim().replace(/\s+/g, ' ');
  text = text.charAt(0).toUpperCase() + text.slice(1);
  if (!/[.!?]$/.test(text)) text += '.';
  noteArea.value = text;
});

saveBtn.addEventListener('click', () => {
  const note = noteArea.value;
  if (!note) return;

  const noteEl = document.createElement('div');
  noteEl.className = 'note';
  noteEl.innerHTML = `
    <p>${note}</p>
    <button onclick="editNote(this)">✏️</button>
    <button onclick="deleteNote(this)">🗑️</button>
    <button onclick="sendNote(this)">📤</button>
  `;
  savedNotes.appendChild(noteEl);
  noteArea.value = '';
});

function editNote(btn) {
  const noteText = btn.parentElement.querySelector('p').textContent;
  noteArea.value = noteText;
  btn.parentElement.remove();
}

function deleteNote(btn) {
  btn.parentElement.remove();
}

function sendNote(btn) {
  const text = btn.parentElement.querySelector('p').textContent;
  const mailto = `mailto:jeroen.vanderveere@konvertiagroup.com?subject=ProMISe Note&body=${encodeURIComponent(text)}`;
  window.location.href = mailto;
}

window.addEventListener('load', () => {
  console.log('ProMISe Note v2 loaded');
});