from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import get_connection
import sqlite3
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="frontend"), name="static")

class Note(BaseModel):
    title: str
    content: str

@app.post("/notes")
def create_note(note: Note):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("INSERT INTO notes (title, content) VALUES (?, ?)", (note.title, note.content))

    conn.commit()
    conn.close()

    return {"message": "Note Saved"}

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
