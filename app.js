function saveNote() {
    const text = document.getElementById("note").value;
    if (text.trim() === "") return;

    const notes = JSON.parse(localStorage.getItem("notes") || "[]");
    notes.push({ text, date: new Date().toISOString() });
    localStorage.setItem("notes", JSON.stringify(notes));
    document.getElementById("note").value = "";
    renderNotes();
}

function renderNotes() {
    const notes = JSON.parse(localStorage.getItem("notes") || "[]");
    const container = document.getElementById("savedNotes");
    container.innerHTML = notes.map(n => 
        `<div class="note"><p>${n.text}</p><small>${new Date(n.date).toLocaleString()}</small></div>`
    ).join("");
}

window.addEventListener("load", renderNotes);