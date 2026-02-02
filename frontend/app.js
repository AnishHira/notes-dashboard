async function loadNotes() {
    const response = await fetch("http://127.0.0.1:8000/notes");
    const notes = await response.json();

    const container = document.getElementById("notes");
    container.innerHTML = "";

    notes.forEach(note => {
        const div = document.createElement("div");
        div.className = "note";

        const title = document.createElement("h3");
        title.textContent = note.title;

        const content = document.createElement("p");
        content.textContent = note.content;

        div.appendChild(title);
        div.appendChild(content);
        container.appendChild(div);
    });

}

loadNotes();