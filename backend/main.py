from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import database, models

app = FastAPI(title="Fixed Expenses API")

# Configure CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/expenses", response_model=List[models.Expense])
def read_expenses():
    return database.get_expenses()

@app.post("/expenses", response_model=models.Expense)
def create_expense(expense: models.ExpenseCreate):
    return database.create_expense(expense)

@app.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int):
    database.delete_expense(expense_id)
    return {"message": "Expense deleted"}

@app.get("/incomes", response_model=List[models.Income])
def read_incomes():
    return database.get_incomes()

@app.post("/incomes", response_model=models.Income)
def create_income(income: models.IncomeCreate):
    return database.create_income(income)

@app.delete("/incomes/{income_id}")
def delete_income(income_id: int):
    database.delete_income(income_id)
    return {"message": "Income deleted"}

import os
import sys

# Resolve static files directory
# Try multiple strategies to find the frontend dist folder:
#   1. PyInstaller: uses sys._MEIPASS temp extraction dir
#   2. Nuitka onefile: data files are next to __file__ in the extraction dir
#   3. Development: main.py is in backend/, frontend/dist is one level up

def _find_dist_dir():
    candidates = []
    
    # PyInstaller
    if getattr(sys, 'frozen', False) and hasattr(sys, '_MEIPASS'):
        candidates.append(os.path.join(sys._MEIPASS, 'frontend', 'dist'))
    
    # Nuitka: __file__ is at distribution root
    script_dir = os.path.dirname(os.path.abspath(__file__))
    candidates.append(os.path.join(script_dir, 'frontend', 'dist'))
    
    # Development: go up from backend/
    parent_dir = os.path.dirname(script_dir)
    candidates.append(os.path.join(parent_dir, 'frontend', 'dist'))
    
    for path in candidates:
        if os.path.exists(path) and os.path.isfile(os.path.join(path, 'index.html')):
            return path
    return None

dist_dir = _find_dist_dir()

# Serve React frontend static files
if dist_dir:
    from fastapi.staticfiles import StaticFiles
    app.mount("/", StaticFiles(directory=dist_dir, html=True), name="static")
else:
    @app.get("/")
    def read_root():
        return {"message": "Welcome to the Fixed Expenses API (frontend build not found)"}

# Running from entry point (e.g., compiled .exe)
if __name__ == '__main__':
    import socket
    import threading
    import time
    import webbrowser
    import uvicorn

    def find_free_port(start_port=8000, max_port=8100):
        for p in range(start_port, max_port):
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                try:
                    s.bind(('127.0.0.1', p))
                    return p
                except OSError:
                    continue
        raise RuntimeError("No free port found")

    # Find a free port starting at 8000
    port = find_free_port()
    
    def open_browser():
        # Wait a brief moment for Uvicorn to initialize
        time.sleep(1.2)
        print(f"Opening browser to http://127.0.0.1:{port}...")
        webbrowser.open(f"http://127.0.0.1:{port}")
        
    threading.Thread(target=open_browser, daemon=True).start()
    
    print(f"Starting Finance.Control on http://127.0.0.1:{port}")
    # Disable reload since reload is not supported in compiled state
    uvicorn.run(app, host="127.0.0.1", port=port, log_level="info")
