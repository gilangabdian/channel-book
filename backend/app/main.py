import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.domains.books.router import router as books_router
from app.domains.chat.router import router as chat_router
from app.domains.manga.router import router as manga_router

# Inisialisasi Aplikasi FastAPI
app = FastAPI(
    title="Channel Book AI API",
    description="API RESTful for Channel (Domain-Based)",
    version="1.1.0"
)

# Register routers (Domain-Based)
app.include_router(books_router)
app.include_router(chat_router)
app.include_router(manga_router)

# Konfigurasi CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Selamat datang di API Channel Book! (DDD Version)",
        "docs_url": "/docs"
    }
