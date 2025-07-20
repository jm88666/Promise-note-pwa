import { useState } from "react";

export default function App() {
  const [note, setNote] = useState("");
  const [savedNotes, setSavedNotes] = useState(() => {
    return JSON.parse(localStorage.getItem("notes") || "[]");
  });

  const saveNote = () => {
    const newNote = {
      id: Date.now(),
      text: note,
      created: new Date().toISOString(),
    };
    const updated = [...savedNotes, newNote];
    localStorage.setItem("notes", JSON.stringify(updated));
    setSavedNotes(updated);
    setNote("");
  };

  const deleteNote = (id) => {
    const updated = savedNotes.filter((n) => n.id !== id);
    localStorage.setItem("notes", JSON.stringify(updated));
    setSavedNotes(updated);
  };

  const handleSpeech = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "nl-NL";
    recognition.onresult = (event) => {
      setNote(event.results[0][0].transcript);
    };
    recognition.start();
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Promise Note</h1>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full p-2 border rounded"
        rows={4}
        placeholder="Typ of spreek je notitie..."
      ></textarea>

      <div className="flex gap-2 mt-2">
        <button onClick={handleSpeech} className="bg-blue-500 text-white px-4 py-1 rounded">
          🎙️ Spreek
        </button>
        <button onClick={saveNote} className="bg-green-600 text-white px-4 py-1 rounded">
          💾 Opslaan
        </button>
      </div>

      <div className="mt-4">
        {savedNotes.map((n) => (
          <div key={n.id} className="border p-2 mb-2 rounded">
            <p className="whitespace-pre-wrap">{n.text}</p>
            <small className="text-gray-500 block">📅 {new Date(n.created).toLocaleString()}</small>
            <div className="flex gap-2 mt-2 flex-wrap">
              <button onClick={() => deleteNote(n.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                🗑️ Verwijder
              </button>
              {/* Hier komen later knoppen voor AI, mail, Promise */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}