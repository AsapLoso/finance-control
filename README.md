# Finance.Control

Finance.Control is a modern, lightweight personal finance dashboard built with **React** (Vite + TypeScript) on the frontend and **FastAPI** (Python) with **SQLite** on the backend.

## Features
- **Clean UI**: A beautiful, modern interface built with TailwindCSS and custom styling.
- **Dynamic Port Allocation**: The backend automatically finds an open port if the default is in use.
- **Standalone Executable**: Can be built into a standalone Windows application using PyInstaller, making it incredibly easy to distribute without requiring users to install Python or Node.js.
- **Local Database**: All data is stored locally in an `expenses.db` SQLite database, ensuring privacy.

## Project Structure
- `/frontend`: React application built with Vite, TypeScript, and TailwindCSS.
- `/backend`: FastAPI Python server handling the API and database operations.
- `build_exe.py`: Automation script to compile the entire application (frontend + backend) into a single distributable zip file.

## Development Setup

### Backend (Python)
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

## Releasing / Building for Production

To build the application into a standalone distribution that you can share:
1. Ensure you have Python installed.
2. Run `python build_exe.py` in the root directory.
3. The script will build the React frontend, bundle the FastAPI backend with PyInstaller (in Directory mode to avoid ML heuristic AV flags), and output a `FinanceControl.zip`.

## Security & Integrity (Checksums)

To verify the integrity of your download, you can check the SHA-256 hash of `FinanceControl.zip` (or `FinanceControl.exe`) against the hashes documented in `CHECKSUM.md`. This ensures your file has not been corrupted or tampered with.
