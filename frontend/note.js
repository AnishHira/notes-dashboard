const API = "http://127.0.0.1:8000";

const params = new URLSearchParams(window.location.search);
let noteId = params.get("id");

let autosaveTimer = null;
let isLoaded = false;

function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

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

    autoResizeTextarea(document.getElementById("content"));
    
    isLoaded = true;
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
        showStatus("Saved ✓", "saved");
    } else {
        const res = await fetch(`${API}/notes`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({title, content})
        });

        const data = await res.json();
        
        noteId = data.id;
        window.history.replaceState(null, '', `note.html?id=${data.id}`);
        showStatus("Saved ✓", "saved");
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
    const contentArea = document.getElementById("content");
    const titleArea = document.getElementById("title");
    
    contentArea.addEventListener('input', function() {
        autoResizeTextarea(this);

        if (isLoaded) { 
            autosave();
        }
    });

    titleArea.addEventListener('input', function() {
    });

    if (noteId) {
        loadNote();
    } else {
        document.getElementById("title").value = "";
        document.getElementById("content").value = "";
        isLoaded = true;
    }
});

function showStatus(message, type) {
    const status = document.getElementById("autosave-status");
    status.textContent = message;
    status.className = `show ${type}`;
}

function autosave() {
    if (autosaveTimer) {
        clearTimeout(autosaveTimer);
    }

    showStatus("Saving...", "saving");

    autosaveTimer = setTimeout(() => {
        updateNote();
    }, 1000);
}