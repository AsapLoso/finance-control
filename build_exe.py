import os
import sys
import subprocess
import shutil

def run_command(command, cwd=None, error_msg="Command failed"):
    print(f"Running: {command} in {cwd or 'current directory'}")
    result = subprocess.run(command, shell=True, cwd=cwd)
    if result.returncode != 0:
        print(f"ERROR: {error_msg} (Exit code: {result.returncode})")
        sys.exit(1)

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    frontend_dir = os.path.join(root_dir, "frontend")
    backend_dir = os.path.join(root_dir, "backend")

    print("=========================================")
    print("      Finance.Control Zipped Builder     ")
    print("=========================================\n")

    # Step 1: Install Python dependencies
    print("--- Step 1: Ensuring Python build dependencies are installed ---")
    run_command(
        f'"{sys.executable}" -m pip install pyinstaller uvicorn fastapi pydantic', 
        error_msg="Failed to install Python dependencies"
    )

    # Step 2: Build the React frontend
    print("\n--- Step 2: Building React Frontend ---")
    dist_dir = os.path.join(frontend_dir, "dist")
    if not os.path.exists(dist_dir) or not os.path.exists(os.path.join(dist_dir, "index.html")):
        print("Installing Node modules...")
        run_command("npm install", cwd=frontend_dir, error_msg="npm install failed")
        print("Building production React assets...")
        run_command("npm run build", cwd=frontend_dir, error_msg="npm run build failed")
    else:
        print("Frontend already built, skipping...")

    # Step 3: Package application using PyInstaller in Directory mode
    print("\n--- Step 3: Compiling Python Backend (Directory Mode) ---")
    
    # We use --onedir instead of --onefile. 
    # Onefile creates a self-extracting zip that triggers Machine Learning Anti-Virus (like Wacatac.B!ml).
    # Onedir creates a standard folder that AVs don't flag as suspicious dropper behavior.
    pyinstaller_cmd = (
        f'"{sys.executable}" -m PyInstaller --onedir --clean --windowed '
        '--name FinanceControl '
        '--add-data "..\\frontend\\dist;frontend\\dist" '
        'main.py'
    )
    
    run_command(pyinstaller_cmd, cwd=backend_dir, error_msg="PyInstaller packaging failed")

    # Step 4: Zip the folder
    print("\n--- Step 4: Zipping the application ---")
    dist_folder = os.path.join(backend_dir, "dist", "FinanceControl")
    zip_target = os.path.join(root_dir, "FinanceControl") # shutil adds .zip automatically
    
    if os.path.exists(f"{zip_target}.zip"):
        os.remove(f"{zip_target}.zip")
        
    print(f"Creating {zip_target}.zip from {dist_folder}...")
    shutil.make_archive(zip_target, "zip", dist_folder)

    print("\n=========================================")
    print("          BUILD SUCCESSFUL!              ")
    print("=========================================")
    print(f"Your standalone application is ready at:\n--> {zip_target}.zip")
    print("\nExtract the ZIP somewhere and double-click FinanceControl.exe to run.")
    print("This method prevents the False Positive VirusTotal flags!")
    print("=========================================")

if __name__ == "__main__":
    main()
