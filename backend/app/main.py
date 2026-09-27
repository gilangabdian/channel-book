import sys
from pathlib import Path

# Setup agar module 'app' bisa diimport dari dalam folder app/
sys.path.append(str(Path(__file__).parent.parent))

from app.services.chat_service import ngobrol_dengan_narra, ngobrol_dengan_syra

def main():
    print("="*50)
    print("🤖 TESTING MASKOT CHANNEL BOOK")
    print("="*50)
    
    pesan = "Aku lagi ngerasa capek banget dan gak punya harapan sama hidup. Ada rekomendasi buku buatku?"
    print(f"\nUser: {pesan}\n")
    
    print("-" * 20 + " TES NARRA " + "-" * 20)
    balasan_narra = ngobrol_dengan_narra(pesan)
    print(f"\nNarra: {balasan_narra}\n")
    
    print("-" * 20 + " TES SYRA " + "-" * 20)
    balasan_syra = ngobrol_dengan_syra(pesan)
    print(f"\nSyra: {balasan_syra}\n")

if __name__ == "__main__":
    main()
