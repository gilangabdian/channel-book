from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    message: str = Field(..., description="Pesan teks dari pengguna", json_schema_extra={"example": "Halo, ada rekomendasi buku?"})
    mascot: str = Field(..., description="Pilihan maskot: 'narra' atau 'syra'", json_schema_extra={"example": "narra"})

class ChatResponse(BaseModel):
    reply: str = Field(..., description="Balasan dari maskot AI", json_schema_extra={"example": "Ini adalah rekomendasi buku yang bagus untukmu!"})
    mascot: str = Field(..., description="Maskot yang membalas", json_schema_extra={"example": "narra"})
