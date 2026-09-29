from app.services.ai_client import chat_with_ai
from app.utils.prompts import NARRA_PROMPT, SYRA_PROMPT

def ngobrol_dengan_narra(pesan: str) -> str:
    """Bicara dengan maskot Narra (Fiksi, santai, kreatif)."""
    return chat_with_ai(
        pesan=pesan,
        system_prompt=NARRA_PROMPT,
        temperature=0.9 # Lebih tinggi agar lebih kreatif dan absurd
    )

def ngobrol_dengan_syra(pesan: str) -> str:
    """Bicara dengan maskot Syra (Non-fiksi, formal, tegang)."""
    return chat_with_ai(
        pesan=pesan,
        system_prompt=SYRA_PROMPT,
        temperature=0.3 # Lebih rendah agar konsisten dan formal
    )
