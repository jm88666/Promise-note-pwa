window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
const recordBtn = document.getElementById('recordBtn');
const recordStatus = document.getElementById('recordStatus');
const savedNotes = document.getElementById('savedNotes');
const addBtn = document.getElementById('addBtn');

if (window.SpeechRecognition) {
  recognition = new window.SpeechRecognition();
  recognition.lang = 'nl-NL';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => { recordStatus.textContent = 'Opnemen...'; };
  recognition.onend = () => { recordStatus.textContent = ''; };
  recognition.onresult = (event) => { addNote(event.results[0][0].transcript); };

  recordBtn.addEventListener('click', () => { recognition.start(); });
} else {
  recordStatus.textContent = '🎙️ Niet ondersteund';
}

addBtn.addEventListener('click', () => {
  const text = prompt('Typ je notitie:');
  if (text) addNote(text);
});

function addNote(text) {
  const li = document.createElement('li');
  const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  li.innerHTML = `<span class="note-text">${text}</span><span class="note-date">${date}</span>`;
  savedNotes.prepend(li);
}