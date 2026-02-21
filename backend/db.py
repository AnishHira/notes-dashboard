import os
import sqlite3

# Fetches the folder where this file lives
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Creates the full path name to the database file (eg. "C:\\Users.....\notes.db")
DB_PATH = os.path.join(BASE_DIR, "notes.db")


# Whenever this function is called in main, it will open a connection to the database
#FastAPI can also handle multiple requests using the same database
def get_connection():
    return sqlite3.connect(DB_PATH, check_same_thread=False)

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            tags TEXT DEFAULT '[]',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    conn.commit()
    conn.close()
    print("Database initialised")