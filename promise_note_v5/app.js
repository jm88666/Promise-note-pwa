window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
const recordBtn = document.getElementById('recordBtn');
const recordStatus = document.getElementById('recordStatus');
const savedNotes = document.getElementById('savedNotes');
const addBtn = document.getElementById('addBtn');

// Load existing notes from localStorage
let notes = JSON.parse(localStorage.getItem('notes') || '[]');

function renderNotes() {
  savedNotes.innerHTML = '';
  notes.forEach((n, i) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="note-text">${n.text}</span>
      <span class="note-date">${n.date}</span>
      <div class="note-actions">
        <button onclick="editNote(${i})">✏️</button>
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

// Speech recognition
if (window.SpeechRecognition) {
  recognition = new window.SpeechRecognition();
  recognition.lang = 'nl-NL';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => { recordStatus.textContent = 'Opnemen...'; };
  recognition.onend = () => { recordStatus.textContent = ''; };
  recognition.onresult = (event) => { addNote(event.results[0][0].transcript); };
  recordBtn.addEventListener('click', () => recognition.start());
} else {
  recordStatus.textContent = '🎙️ Niet ondersteund';
}

// Add note (from speech or manual)
addBtn.addEventListener('click', () => {
  const text = prompt('Typ je notitie:');
  if (text) addNote(text);
});

function addNote(text) {
  const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  notes.unshift({ text, date });
  saveNotes();
  renderNotes();
}

// Edit note
function editNote(index) {
  const newText = prompt('Bewerk notitie:', notes[index].text);
  if (newText !== null) {
    notes[index].text = newText;
    saveNotes();
    renderNotes();
  }
}

// Delete note
function deleteNote(index) {
  if (confirm('Weet je zeker dat je deze notitie wilt verwijderen?')) {
    notes.splice(index, 1);
    saveNotes();
    renderNotes();
  }
}

// Send note via email
function sendNote(index) {
  const note = notes[index].text;
  const subject = encodeURIComponent('ProMISe Note');
  const body = encodeURIComponent(note);
  window.location.href = `mailto:jeroen.vanderveere@konvertiagroup.com?subject=${subject}&body=${body}`;
}

// Initial render
renderNotes();