API = "http://127.0.0.1:8000"

async function loadNotes() {
    const response = await fetch(`${API}/notes`);
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

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => deleteNote(note.id);

        div.appendChild(titleInput);
        div.appendChild(contentInput);
        div.appendChild(saveButton);
        div.appendChild(deleteButton);

        container.appendChild(div);
    });
}

async function createNote() {
    const title = document.getElementById("newTitle").value;
    const content = document.getElementById("newContent").value;

    await fetch(`${API}/notes`, {
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

    await fetch(`${API}/notes/${id}`, { 
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({title, content})
    });


    loadNotes();
}

async function deleteNote(id) {
    await fetch(`${API}/notes/${id}`, {
        method: "DELETE"
    });

    loadNotes();
}

loadNotes();