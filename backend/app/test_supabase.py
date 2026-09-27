import sys
from pathlib import Path

# Setup agar module 'app' bisa diimport
sys.path.append(str(Path(__file__).parent.parent))

from app.core.db import supabase

def test_connection():
    print("="*40)
    print("🔍 MENGUJI KONEKSI SUPABASE")
    print("="*40)
    
    try:
        # Kita coba melakukan query sederhana ke tabel profiles
        # Kalau berhasil jalan tanpa error, artinya URL dan Key sudah benar.
        response = supabase.table("profiles").select("*").limit(1).execute()
        
        print("✅ Koneksi BERHASIL!")
        print("Database berhasil dijangkau.")
        if len(response.data) == 0:
            print("Info: Tabel 'profiles' saat ini masih kosong (wajar, belum ada user register).")
        else:
            print(f"Data ditemukan: {response.data}")
            
    except Exception as e:
        print(f"❌ Koneksi GAGAL!")
        print(f"Pesan Error: {str(e)}")
        print("\nCek kembali SUPABASE_URL dan SUPABASE_KEY di file .env kamu.")

if __name__ == "__main__":
    test_connection()
