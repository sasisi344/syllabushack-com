from pathlib import Path
from dotenv import load_dotenv
import os

script_path = Path(__file__).resolve()
print(f"Script location: {script_path}")

project_root = script_path.parent.parent.parent
print(f"Project root: {project_root}")

env_path = project_root / ".env"
print(f"Env path: {env_path}")
print(f"Env exists: {env_path.exists()}")

if env_path.exists():
    with open(env_path, "r") as f:
        print(f"Env content preview: {f.read()[:50]}...")

load_dotenv(dotenv_path=env_path)
api_key = os.environ.get("GOOGLE_API_KEY", "NOT FOUND")
print(f"API Key (first 10 chars): {api_key[:10] if api_key != 'NOT FOUND' else 'NOT FOUND'}...")
