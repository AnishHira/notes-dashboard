from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from .db import get_connection
import sqlite3
from pydantic import BaseModel

app = FastAPI()

app.mount("/static", StaticFiles(directory="frontend"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Note(BaseModel):
    title: str
    content: str

@app.get("/")
def home():
    return FileResponse("frontend/page.html")

@app.get("/note.html")
def note_page():
    return FileResponse("frontend/note.html")

@app.post("/notes")
def create_note(note: Note):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("INSERT INTO notes (title, content) VALUES (?, ?)", (note.title, note.content))

    note_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return {"id": note_id, "message": "Note Saved"}

@app.put("/notes/{note_id}")
def update_notes(note_id: int, note: Note):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("UPDATE NOTES SET title = ?, content = ? WHERE id = ?", (note.title, note.content, note_id))

    conn.commit()
    conn.close()

    return {
        "id": note_id,
        "title": note.title,
        "content": note.content,
    }

@app.get("/notes")
def get_notes():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, title, content, created_at FROM notes")

    rows = cursor.fetchall()

    conn.close()

    return [
        {
            "id": row[0],
            "title": row[1],
            "content": row[2],
            "created_at": row[3]
        }
        for row in rows
    ]

@app.delete("/notes/{note_id}")
def delete_note(note_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM notes WHERE id = ?", (note_id,))

    conn.commit()
    conn.close()
    return {"message": "Note deleted"}

@app.get("/notes/{note_id}")
def get_note(note_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, title, content FROM notes WHERE id = ?",
        (note_id,)
    )
    row = cursor.fetchone()
    conn.close()

    if not row:
        return {"error": "Note not found"}

    return {
        "id": row[0],
        "title": row[1],
        "content": row[2]
    }