import os
import json
import hashlib
from pathlib import Path
from app.core.config import settings

# ============================
# CACHE SETUP
# ============================
CACHE_DIR = Path(__file__).parent.parent.parent / "cache"
CACHE_FILE = CACHE_DIR / "responses.json"

def _cache_key(pesan, system_prompt):
    raw = f"{system_prompt or ''}|{pesan}"
    return hashlib.md5(raw.encode()).hexdigest()

def call_cache(pesan, system_prompt=None):
    if not CACHE_FILE.exists():
        return None
    with open(CACHE_FILE, "r", encoding="utf-8") as f:
        cache = json.load(f)
    key = _cache_key(pesan, system_prompt)
    return cache.get(key)

def save_to_cache(pesan, system_prompt, response_text):
    CACHE_DIR.mkdir(exist_ok=True)
    cache = {}
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
def call_gemini(pesan, system_prompt=None, temperature=0.7):
    from google import genai

    if not settings.GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY tidak diset di .env")

    client = genai.Client(api_key=settings.GEMINI_API_KEY)

    kwargs = {
        "model": "gemini-3.8-flash",
        "input": pesan,
    }
    if system_prompt:
        kwargs["system_instruction"] = system_prompt
    kwargs["generation_config"] = {"temperature": temperature}

    interaction = client.interactions.create(**kwargs)
    return interaction.output_text

def call_groq(pesan, system_prompt=None, temperature=0.7):
    from groq import Groq

    if not settings.GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY tidak diset di .env")

    client = Groq(api_key=settings.GROQ_API_KEY)

    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": pesan})

    response = client.chat.completions.create(
        messages=messages,
        model="openai/gpt-oss-120b",
        temperature=temperature,
    )
    return response.choices[0].message.content

# ============================
# MAIN INTERFACE
# ============================
def chat_with_ai(pesan, system_prompt=None, temperature=0.7):
    is_development = settings.APP_ENV == "development"

    # 1. Cek cache
    if is_development:
        cached = call_cache(pesan, system_prompt)
        if cached:
            print(f"  [📦 Response diambil dari cache]")
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
