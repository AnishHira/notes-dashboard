const API = "http://127.0.0.1:8000"

let allNotes = [];
let selectedTag = 'all';
let searchNote = '';

async function renderNotes() {
    let notes = selectedTag === 'all'
    ? allNotes
    : allNotes.filter(note => note.tags && note.tags.includes(selectedTag));

    if (searchNote) {
        notes = notes.filter(note => {
            const titleMatch = note.title.toLowerCase().includes(searchNote.toLowerCase());
            const contentMatch = note.content.toLowerCase().includes(searchNote.toLowerCase());
            return titleMatch || contentMatch;
        });
    }

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

        if (note.tags) {
            const tags = document.createElement("div");
            tags.innerHTML = note.tags.map(t => `<span>${t}</span>`).join(' ');
            card.appendChild(tags);
        }

        card.onclick = () => {
            window.location.href = `note.html?id=${note.id}`;
        }

        container.appendChild(card);
    });
}

function renderTagFilters() {
    const allTags = new Set();
    allNotes.forEach(note => {
        if (note.tags) note.tags.forEach(tag => allTags.add(tag));
    });
    
    const filterContainer = document.getElementById("tag-filters");
    filterContainer.innerHTML = '';
    
    allTags.forEach(tag => {
        const btn = document.createElement("button");
        btn.textContent = tag;
        btn.onclick = () => filterByTag(tag);
        filterContainer.appendChild(btn);
    });
}

function filterByTag(tag) {
    selectedTag = tag;
    renderNotes();
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

    renderNotes();
}

async function loadNotes() {
    const response = await fetch(`${API}/notes`);
    allNotes = await response.json();
    renderTagFilters();
    renderNotes();

    document.getElementById("search-input").addEventListener('input', function(e) {
        searchNote = e.target.value;
        renderNotes();
    });
}

loadNotes();