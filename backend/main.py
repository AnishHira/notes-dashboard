from fastapi import FastAPI
from .db import get_connection
import sqlite3
from pydantic import BaseModel

app = FastAPI()

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

    conn.row_factory = sqlite3.Row

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