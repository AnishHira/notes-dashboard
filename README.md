# Notes Dashboard

A full-stack CRUD notes application built with FastAPI and SQLite, developed to deepen my practical understanding of API design, database integration, and frontend–backend architecture. The dashboard enables users to efficiently organise, search, and manage notes using a flexible tagging and filtering system.

## Features

- **Create & Edit Notes**: Easily create, modify, and manage notes with structured titles and content
- **Tag System**: Organise notes with custom tags for easy categorisation
- **Search & Filter**: Quickly find notes by title, content, or tags
- **Delete Notes**: Remove notes you no longer need
- **Individual Note View**: Dedicated page for viewing and editing single notes
- **API Endpoints**: Clean FastAPI backend with structured HTTP methods
- **SQLite Database**: Lightweight, serverless database for reliable storage

## Getting Started

### Prerequisites
- Python 3.8 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd notes-dashboard
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**
   ```bash
   # On macOS/Linux
   source venv/bin/activate
   
   # On Windows
   venv\Scripts\activate
   ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Run the application**
   ```bash
   uvicorn backend.main:app --reload
   ```

6. **Open in browser**
   ```
   http://127.0.0.1:8000
   ```

The database will be automatically initialised on first run!

## Tech Stack

### Backend
- **FastAPI** – Structured API endpoints and backend logic
- **SQLite** – Relational database for persistent storage

### Frontend
- **HTML5 & CSS3** – Responsive user interface
- **Vanilla JavaScript** – Dynamic client-side behaviour, chosen to learn core web development without relying on external frameworks
- **Fetch API** – Client–server communication

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Serves main dashboard page |
| GET | `/note.html` | Serves individual note page |
| GET | `/notes` | Retrieve all notes |
| GET | `/notes/{note_id}` | Retrieve a specific note |
| POST | `/notes` | Create a new note |
| PUT | `/notes/{note_id}` | Update an existing note |
| DELETE | `/notes/{note_id}` | Delete a note |

## Usage
- **Create a Note**: Click "New Note" button, enter a title and content, optionally add tags, and save
- **Add Tags**: Type tags when creating or editing a note for easy categorisation
- **Search**: Use the search bar to filter notes by title or content in real-time
- **Edit**: Click on any note card to open the detailed view, make changes, and save
