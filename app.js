let recognition;
const recordBtn = document.getElementById('recordBtn');
const saveBtn = document.getElementById('saveBtn');
const correctBtn = document.getElementById('correctBtn');
const noteArea = document.getElementById('note');
const savedNotes = document.getElementById('savedNotes');

if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.lang = 'nl-NL';
  recognition.continuous = false;
  recognition.interimResults = false;

  recordBtn.addEventListener('click', () => {
    recognition.start();
  });

  recognition.onresult = (event) => {
    noteArea.value = event.results[0][0].transcript;
  };
} else {
  recordBtn.disabled = true;
  recordBtn.textContent = '🎙️ Niet ondersteund';
}

correctBtn.addEventListener('click', () => {
  const text = noteArea.value;
  noteArea.value = text.charAt(0).toUpperCase() + text.slice(1).replace(/\s+/g, ' ').trim() + '.';
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
  const note = btn.parentElement.querySelector('p');
  noteArea.value = note.textContent;
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