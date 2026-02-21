const API = "http://127.0.0.1:8000";

const params = new URLSearchParams(window.location.search);
let noteId = params.get("id");

let autosaveTimer = null;
let isLoaded = false;
let currentTags = [];

function renderTags() {
    const display = document.getElementById("tags-display");
    display.innerHTML = currentTags.map(tag => 
        `<span>${tag} <button onclick="removeTag('${tag}')">x</button></span>`).join(' ');
}

function addTag() {
    const input = document.getElementById("tag-input");
    const tag = input.value.trim().toLowerCase();
    if (tag && !currentTags.includes(tag)) {
        currentTags.push(tag);
        renderTags();
        input.value = "";
        if (isLoaded) {
            autosave();
        }
    }
}

function removeTag(tag) {
    currentTags = currentTags.filter(t => t !== tag);
    renderTags();
    if (isLoaded) {
        autosave();
    }
}

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
    currentTags = note.tags || [];
    
    renderTags();

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
            body: JSON.stringify({title, content, tags: currentTags})
        });
        showStatus("Saved ✓", "saved");
    } else {
        const res = await fetch(`${API}/notes`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({title, content, tags: currentTags})
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

    document.getElementById("tag-input").addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    });

    if (noteId) {
        loadNote();
    } else {
        document.getElementById("title").value = "";
        document.getElementById("content").value = "";
        currentTags = [];
        renderTags();
        
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