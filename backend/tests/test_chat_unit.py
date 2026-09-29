import sys
from pathlib import Path
from unittest.mock import patch

sys.path.append(str(Path(__file__).parent.parent))

from app.services.chat_service import ngobrol_dengan_narra, ngobrol_dengan_syra
from app.services.ai_client import _cache_key

def test_cache_key_generation():
    """Memastikan algoritma _cache_key konsisten membuat hash dari pesan + prompt."""
    key1 = _cache_key("Halo", "Prompt A")
    key2 = _cache_key("Halo", "Prompt A")
    key3 = _cache_key("Halo", "Prompt B")
    
    assert key1 == key2 # Identik
    assert key1 != key3 # Harus beda karena prompt beda

# Menggunakan mock patch untuk "memalsukan" setting dan koneksi internet
@patch('app.services.ai_client.call_groq')
@patch('app.services.ai_client.call_gemini')
@patch('app.services.ai_client.settings')
def test_ngobrol_dengan_narra_mocked(mock_settings, mock_gemini, mock_groq):
    """
    Test apakah fungsi obrolan memanggil provider dengan benar TANPA menghabiskan
    kuota API asli kita (menggunakan teknik Mocking).
    """
    # 1. Setup skenario palsu
    mock_settings.APP_ENV = "testing"
    mock_settings.DEFAULT_AI_PROVIDER = "groq"
    
    # 2. Setup balasan palsu dari API Groq
    mock_groq.return_value = "Ini balasan palsu (mocked) dari Narra!"
    
    # 3. Eksekusi fungsi
    reply = ngobrol_dengan_narra("Halo Narra")
    
    # 4. Verifikasi apakah ekspektasi kita tercapai
    assert reply == "Ini balasan palsu (mocked) dari Narra!"
    mock_groq.assert_called_once() # Memastikan Groq terpanggil 1x
    mock_gemini.assert_not_called() # Memastikan Gemini tidak terpanggil
