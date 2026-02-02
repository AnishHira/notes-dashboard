async function loadNotes() {
    const response = await fetch("http://127.0.0.1:8000/notes");
    const notes = await response.json();

    const container = document.getElementById("notes");
    container.innerHTML = "";

    notes.forEach(note => {
        const div = document.createElement("div");
        div.className = "note";

        const titleInput = document.createElement("input");
        titleInput.id = `title-${note.id}`;
        titleInput.value = note.title;

        const contentInput = document.createElement("textarea");
        contentInput.id = `content-${note.id}`;
        contentInput.value = note.content;

        const saveButton = document.createElement("button");
        saveButton.textContent = "Save";
        saveButton.onclick = () => updateNote(note.id);

        div.appendChild(titleInput);
        div.appendChild(contentInput);
        div.appendChild(saveButton);

        container.appendChild(div);
    });
}

async function createNote() {
    const title = document.getElementById("newTitle").value;
    const content = document.getElementById("newContent").value;

    await fetch("http://127.0.0.1:8000/notes", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({title, content})
    });

    document.getElementById("newTitle").value = "";
    document.getElementById("newContent").value = "";

    loadNotes();
}

async function updateNote(id) {
    const title = document.getElementById(`title-${id}`).value;
    const content = document.getElementById(`content-${id}`).value;

    await fetch(`http://127.0.0.1:8000/notes/${id}`, { 
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({title, content})
    });


    loadNotes();
}

loadNotes();