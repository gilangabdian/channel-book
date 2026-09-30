from fastapi import APIRouter, HTTPException, Depends
from app.core.security import get_current_user
from app.domains.chat.schemas import ChatRequest, ChatResponse
from app.domains.chat.service import ngobrol_dengan_narra, ngobrol_dengan_syra

router = APIRouter(prefix="/api/chat", tags=["Chat"])

@router.post(
    "", 
    response_model=ChatResponse, 
    responses={
        400: {"description": "Mascot not found (Bad Request)"}
    }
)
def chat_with_mascot(request: ChatRequest, user = Depends(get_current_user)):
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
