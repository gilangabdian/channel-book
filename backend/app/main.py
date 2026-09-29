import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import ChatRequest, ChatResponse
from app.services.chat_service import ngobrol_dengan_narra, ngobrol_dengan_syra

# Inisialisasi Aplikasi FastAPI
app = FastAPI(
    title="Channel Book AI API",
    description="API RESTful for Channel",
    version="1.0.0"
)

# Konfigurasi CORS (Sangat penting agar Next.js bisa memanggil API ini)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Di production, ganti dengan URL Vercel/Next.js kamu
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Selamat datang di API Channel Book!",
        "docs_url": "/docs"
    }

@app.post(
    "/api/chat", 
    response_model=ChatResponse, 
    tags=["Chat"],
    responses={
        400: {"description": "Mascot not found (Bad Request)"}
    }
)
def chat_with_mascot(request: ChatRequest):
    """
    Endpoint utama untuk ngobrol dengan AI.
    - **message**: Pesan yang ingin dikirim
    - **mascot**: Pilih antara "narra" (fiksi/santai) atau "syra" (non-fiksi/formal)
    """
    mascot = request.mascot.lower()
    pesan = request.message
    
    if mascot == "narra":
        reply = ngobrol_dengan_narra(pesan)
    elif mascot == "syra":
        reply = ngobrol_dengan_syra(pesan)
    else:
        raise HTTPException(
            status_code=400, 
            detail="Maskot tidak dikenal. Silakan pilih 'narra' atau 'syra'."
        )
        
    return ChatResponse(reply=reply, mascot=mascot)
