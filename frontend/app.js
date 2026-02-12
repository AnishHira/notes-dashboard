const API = "http://127.0.0.1:8000"

async function loadNotes() {
    const response = await fetch(`${API}/notes`);
    const notes = await response.json();

    const container = document.getElementById("notes");
    container.innerHTML = "";

    notes.forEach(note => {
        const card = document.createElement("div");
        card.className = "note-card";

        const textBg = document.createElement("div");
        textBg.className = "text-bg";

        
        card.innerHTML = `
            <h3>${note.title || "Untitled Note"}</h3>
        `;

        const skeleton = document.createElement("div");
        skeleton.className = "skeleton";
        skeleton.innerHTML = `
            <div class="line"></div>
            <div class="line"></div>
            <div class="line short"></div>
        `;

        card.appendChild(textBg);
        card.appendChild(skeleton)

        card.onclick = () => {
            window.location.href = `note.html?id=${note.id}`;
        }

        container.appendChild(card);
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

loadNotes();