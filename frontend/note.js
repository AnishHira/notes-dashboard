const API = "http://127.0.0.1:8000";

const params = new URLSearchParams(window.location.search);
const noteId = params.get("id");

async function loadNote() {
    const res = await fetch(`${API}/notes/${noteId}`);

    if (!res.ok) {
        alert("Note not found");
        window.location.href = "/";
        return;
    }

    const note = await res.json();

    document.getElementById("title").value = note.title || "Untitled Note";
    document.getElementById("content").value = note.content || "";
}

async function updateNote() {
    const title = document.getElementById("title").value || "Untitled Note";
    const content = document.getElementById("content").value || "";

    if (noteId) {
        await fetch(`${API}/notes/${noteId}`, { 
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({title, content})
        });
    } else {
        const res = await fetch(`${API}/notes`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({title, content})
        });

        const data = await res.json();
        window.location.href = `note.html?id=${data.id}`;
        return;
    }
}

async function deleteNote() {
    await fetch(`${API}/notes/${noteId}`, {
        method: "DELETE"
    });

    window.location.href = "/";
}

window.addEventListener("DOMContentLoaded", () => {
    if (noteId) {
        loadNote();
    }
    else {
        document.getElementById("title").value = "";
        document.getElementById("content").value = "";
    }
});

