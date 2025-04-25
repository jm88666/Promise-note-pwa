window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
const recordBtn = document.getElementById('recordBtn');
const recordStatus = document.getElementById('recordStatus');
const noteArea = document.getElementById('noteArea');
const saveBtn = document.getElementById('saveBtn');
const savedNotes = document.getElementById('savedNotes');
let notes = JSON.parse(localStorage.getItem('notes') || '[]');
let editingIndex = null;

function renderNotes() {
  savedNotes.innerHTML = '';
  notes.forEach((n, i) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="note-text">${n.text}</span>
      <span class="note-date">${n.date}</span>
      <div class="note-actions">
        <button onclick="startEdit(${i})">✏️</button>
        <button onclick="deleteNote(${i})">🗑️</button>
        <button onclick="sendNote(${i})">📤</button>
      </div>
    `;
    savedNotes.appendChild(li);
  });
}

function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

if (window.SpeechRecognition) {
  recognition = new window.SpeechRecognition();
  recognition.lang = 'nl-NL';
  recognition.interimResults = false;
  recognition.onstart = () => { recordStatus.textContent = 'Opnemen...'; };
  recognition.onend = () => { recordStatus.textContent = ''; };
  recognition.onresult = (event) => { noteArea.value = event.results[0][0].transcript; };
  recordBtn.addEventListener('click', () => recognition.start());
} else {
  recordStatus.textContent = '🎙️ Niet ondersteund';
}

saveBtn.addEventListener('click', () => {
  const text = noteArea.value.trim();
  if (!text) return;
  const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  if (editingIndex !== null) {
    notes[editingIndex] = { text, date };
    editingIndex = null;
    saveBtn.textContent = '💾 Opslaan';
  } else {
    notes.unshift({ text, date });
  }
  noteArea.value = '';
  saveNotes();
  renderNotes();
});

function startEdit(index) {
  editingIndex = index;
  noteArea.value = notes[index].text;
  saveBtn.textContent = '🔄 Bijwerken';
}

function deleteNote(index) {
  if (confirm('Weet je zeker dat je deze notitie wilt verwijderen?')) {
    notes.splice(index, 1);
    saveNotes();
    renderNotes();
  }
}

function sendNote(index) {
  const note = notes[index].text;
  const subject = encodeURIComponent('ProMISe Note');
  const body = encodeURIComponent(note);
  window.location.href = `mailto:jeroen.vanderveere@konvertiagroup.com?subject=${subject}&body=${body}`;
}

renderNotes();