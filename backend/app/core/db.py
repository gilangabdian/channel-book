from supabase import create_client, Client
from app.core.config import settings

if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
    raise ValueError("SUPABASE_URL dan SUPABASE_KEY harus diset di file .env")

# Inisialisasi client Supabase
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
