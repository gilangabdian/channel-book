import sys
import json
from pathlib import Path

# Setup agar module 'app' bisa diimport
sys.path.append(str(Path(__file__).parent.parent))

from app.main import app

def dump_openapi():
    """
    Script ini akan menyedot skema OpenAPI secara dinamis dari FastAPI
    dan menyimpannya sebagai file statis openapi.json.
    """
    # 1. Mengambil schema OpenAPI yang digenerate OTOMATIS oleh FastAPI
    openapi_schema = app.openapi()
    
    # 2. Membuat folder docs/ jika belum ada
    docs_dir = Path(__file__).parent.parent / "docs"
    docs_dir.mkdir(exist_ok=True)
    
    # 3. Menyimpan ke dalam file docs/openapi.json
    output_path = docs_dir / "openapi.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(openapi_schema, f, indent=2)
        
    print(f"[SUCCESS] BINGO! OpenAPI spec berhasil di-dump ke: {output_path}")

if __name__ == "__main__":
    dump_openapi()
