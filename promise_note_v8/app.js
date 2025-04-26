window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
const recordBtn = document.getElementById('recordBtn');
const recordStatus = document.getElementById('recordStatus');
const noteArea = document.getElementById('noteArea');
const aiBtn = document.getElementById('aiBtn');
const saveBtn = document.getElementById('saveBtn');
const savedNotes = document.getElementById('savedNotes');

let notes = JSON.parse(localStorage.getItem('notes') || '[]');
let editingIndex = null;

function renderNotes() {
  savedNotes.innerHTML = '';
  notes.forEach((n, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="note-text">${n.text}</span>
                    <span class="note-date">${n.date}</span>
                    <div class="note-actions">
                      <button onclick="startEdit(${i})">✏️</button>
                      <button onclick="deleteNote(${i})">🗑️</button>
                    </div>`;
    savedNotes.appendChild(li);
  });
}
function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

if (window.SpeechRecognition) {
  recognition = new window.SpeechRecognition();
  recognition.lang = 'nl-NL'; recognition.interimResults = false;
  recognition.onstart = () => recordStatus.textContent = 'Opnemen...';
  recognition.onend   = () => recordStatus.textContent = '';
  recognition.onresult= (e) => noteArea.value = e.results[0][0].transcript;
  recordBtn.addEventListener('click', () => recognition.start());
} else recordStatus.textContent = '🎙️ Niet ondersteund';

aiBtn.addEventListener('click', async () => {
  const raw = noteArea.value.trim();
  if (!raw) return alert('Voer eerst een notitie in');
  aiBtn.disabled = true; aiBtn.textContent = '🤖 Bezig...';
  const res = await fetch('/.netlify/functions/refineText', {
    method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({text:raw})
  });
  const { refined } = await res.json();
  noteArea.value = refined;
  aiBtn.disabled = false; aiBtn.textContent = '🤖 Verbeter AI';
});

saveBtn.addEventListener('click', () => {
  const txt = noteArea.value.trim(); if (!txt) return;
  const date = new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
  if (editingIndex!=null){ notes[editingIndex]={text:txt,date}; editingIndex=null; saveBtn.textContent='💾 Opslaan'; }
  else notes.unshift({text:txt,date});
  noteArea.value=''; saveNotes(); renderNotes();
});
function startEdit(i){ editingIndex=i; noteArea.value=notes[i].text; saveBtn.textContent='🔄 Bijwerken'; }
function deleteNote(i){ notes.splice(i,1); saveNotes(); renderNotes(); }
renderNotes();