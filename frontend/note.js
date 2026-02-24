const API = "http://127.0.0.1:8000";

const params = new URLSearchParams(window.location.search);
let noteId = params.get("id");

let autosaveTimer = null;
let isLoaded = false;
let currentTags = [];
let allExistingTags = [];

async function loadExistingTags() {
    const response = await fetch(`${API}/notes`);
    const notes = await response.json();
    
    const tagSet = new Set();
    notes.forEach(note => {
        if (note.tags) {
            note.tags.forEach(tag => tagSet.add(tag));
        }
    });
    
    allExistingTags = Array.from(tagSet);
}

function addExistingTag(tag) {
    currentTags.push(tag);
    renderTags();
    if (isLoaded) {
         autosave();
    }
}

function renderTags() {
    const display = document.getElementById("tags-display");
    const input = document.getElementById("tag-input");
    const filterTerm = input.value.toLowerCase();

    display.innerHTML = "";
    currentTags.forEach(tag => {
        const span = document.createElement("span");
        span.textContent = tag + " ";

        const btn = document.createElement("button");
        btn.textContent = "x";
        btn.addEventListener("click", () => removeTag(tag));

        span.appendChild(btn);
        display.appendChild(span);
    });

    let suggestionDiv = document.getElementById("existing-tags-container");
    if (!suggestionDiv) {
        suggestionDiv = document.createElement("div");
        suggestionDiv.id = "existing-tags-container";
        display.parentNode.appendChild(suggestionDiv);
    }
    suggestionDiv.innerHTML = "";

    const availableTags = allExistingTags.filter(tag => 
        !currentTags.includes(tag) &&
        (filterTerm === '' || tag.toLowerCase().includes(filterTerm))
    );

    if (availableTags.length > 0) {
        const label = document.createElement("span");
        label.textContent = "Existing tags: ";
        label.className = "existing-tags-label";
        suggestionDiv.appendChild(label);

        availableTags.forEach(tag => {
            const btn = document.createElement("button");
            btn.textContent = tag;
            btn.className = "existing-tag-btn";
            btn.addEventListener("click", () => {
                addExistingTag(tag);
                renderTags();
            });
            suggestionDiv.appendChild(btn);
        });
    }
}

function addTag() {
    const input = document.getElementById("tag-input");
    const tag = input.value.trim();
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

window.addEventListener("DOMContentLoaded", async () => {
    await loadExistingTags();

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

    document.getElementById("tag-input").addEventListener('input', function() {
        renderTags();
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