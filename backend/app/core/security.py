from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.db import supabase

security = HTTPBearer(
    scheme_name="Supabase JWT",
    description="Silakan masukkan JWT Token dari Supabase (tanpa kata 'Bearer ')"
)

def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    FastAPI Dependency untuk memverifikasi Token JWT dari Supabase.
    Jika token tidak valid, akan mengembalikan 401 Unauthorized.
    """
    token = credentials.credentials
    try:
        # Menggunakan Supabase Auth untuk memvalidasi JWT
        user_resp = supabase.auth.get_user(token)
        if not user_resp or not user_resp.user:
            raise HTTPException(
                status_code=401,
                detail="Token tidak valid atau sudah kedaluwarsa",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user_resp.user
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Error saat autentikasi: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
