import os
import json
import hashlib
from pathlib import Path
from typing import Optional, Dict, Any
from app.core.config import settings

# ============================
# CACHE SETUP
# ============================
CACHE_DIR: Path = Path(__file__).parent.parent.parent / "cache"
CACHE_FILE: Path = CACHE_DIR / "responses.json"

def _cache_key(pesan: str, system_prompt: Optional[str]) -> str:
    raw = f"{system_prompt or ''}|{pesan}"
    return hashlib.md5(raw.encode()).hexdigest()

def call_cache(pesan: str, system_prompt: Optional[str] = None) -> Optional[str]:
    if not CACHE_FILE.exists():
        return None
    with open(CACHE_FILE, "r", encoding="utf-8") as f:
        cache: Dict[str, str] = json.load(f)
    key = _cache_key(pesan, system_prompt)
    return cache.get(key)

def save_to_cache(pesan: str, system_prompt: Optional[str], response_text: str) -> None:
    CACHE_DIR.mkdir(exist_ok=True)
    cache: Dict[str, str] = {}
    if CACHE_FILE.exists():
        with open(CACHE_FILE, "r", encoding="utf-8") as f:
            cache = json.load(f)
    key = _cache_key(pesan, system_prompt)
    cache[key] = response_text
    with open(CACHE_FILE, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)

# ============================
# PROVIDERS
# ============================
def call_gemini(pesan: str, system_prompt: Optional[str] = None, temperature: float = 0.7) -> str:
    from google import genai
    
    if not settings.GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY tidak diset di .env")
        
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    
    kwargs: Dict[str, Any] = {
        "model": "gemini-3.8-flash",
        "input": pesan,
    }
    if system_prompt:
        kwargs["system_instruction"] = system_prompt
    kwargs["generation_config"] = {"temperature": temperature}
    
    interaction = client.interactions.create(**kwargs)
    return str(interaction.output_text)

def call_groq(pesan: str, system_prompt: Optional[str] = None, temperature: float = 0.7) -> str:
    from groq import Groq
    
    if not settings.GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY tidak diset di .env")
        
    client = Groq(api_key=settings.GROQ_API_KEY)
    
    messages: list[Dict[str, str]] = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": pesan})
    
    response = client.chat.completions.create(
        messages=messages,
        model="openai/gpt-oss-120b",
        temperature=temperature,
    )
    return str(response.choices[0].message.content)

# ============================
# MAIN INTERFACE
# ============================
def chat_with_ai(pesan: str, system_prompt: Optional[str] = None, temperature: float = 0.7) -> str:
    is_development = settings.APP_ENV == "development"
    
    # 1. Cek cache
    if is_development:
        cached = call_cache(pesan, system_prompt)
        if cached:
            print("  [📦 Response diambil dari cache]")
            return cached
    
    # 2. Panggil API berdasarkan setting
    provider = settings.DEFAULT_AI_PROVIDER
    print(f"  [🔗 Memanggil provider {provider} (Env: {settings.APP_ENV})...]")
    
    if provider == "gemini":
        result = call_gemini(pesan, system_prompt, temperature)
    elif provider == "groq":
        result = call_groq(pesan, system_prompt, temperature)
    else:
        raise ValueError(f"Provider '{provider}' tidak dikenal.")
    
    # 3. Simpan ke cache
    if is_development:
        save_to_cache(pesan, system_prompt, result)
        
    return result
