# ATMI Workshop Overdrive

Game arcade bergaya **Overcooked** untuk booth pameran pendidikan **Politeknik Industri ATMI Cikarang**. Pemain bekerja sama di bengkel otomasi untuk menyelesaikan order produksi dengan memanfaatkan 4 stasiun kerja yang merepresentasikan 3 program studi ATMI.

---

## 🎮 Konsep Game

**"Smart Factory Overdrive"** — pemain menjadi operator bengkel otomasi yang harus:
- Ambil bahan baku di **Raw Depot**
- Proses di **CNC Cutting** (Mesin Industri)
- Rakit di **Robot Assembly** (Mekatronika)
- Program di **Programming Station** (Mekatronika)
- Kirim ke **QC & Shipping** (Manajemen Industri)

Setiap order punya "resep" yang harus diselesaikan dalam waktu terbatas. Makin cepat & tepat, skor makin tinggi!

### Chaos Events (ala Overcooked)
- 🔥 **CNC Overheat** — harus didinginkan dulu sebelum dipakai
- ⚡ **Power Outage** — semua mesin mati, seseorang harus reset breaker
- 🚨 **Rush Order** — order kilat dengan poin ganda

---

## 🖥️ Setup Booth (TV + HP Controller)

### Persiapan Laptop

```bash
# 1. Install dependency
npm install

# 2. Jalankan server
npm start
```

Server akan berjalan di port **3000**. Di terminal akan muncul alamat IP lokal laptop, misalnya:
```
http://192.168.1.50:3000
```

### Konfigurasi Booth

| Perangkat | URL yang dibuka |
|-----------|-----------------|
| **TV / Display** | `http://<IP-LAPTOP>:3000/display.html` |
| **HP Pemain** | `http://<IP-LAPTOP>:3000/controller.html` |

**Tips praktis:**
1. Laptop dihubungkan ke TV melalui **HDMI**
2. Laptop dijadikan **WiFi Hotspot** (atau pakai router portable)
3. HP pemain connect ke WiFi yang sama
4. Buat **QR Code** yang mengarah ke URL controller
5. Kalau ada masalah koneksi, refresh halaman HP

---

## 📁 Struktur File

```
atmi-booth-game/
├── server.js          # WebSocket relay server (Node.js)
├── package.json       # Project metadata
├── display.html       # Layar game untuk TV
├── controller.html    # Kontroler virtual untuk HP
├── index.html         # Halaman awal (pilih Display / Controller)
└── README.md          # Dokumentasi ini
```

---

## 🕹️ Kontrol HP

| Tombol | Fungsi |
|--------|--------|
| ⬆️⬇️⬅️➡️ **D-Pad** | Gerakkan karakter operator |
| **AKSI** | Interaksi dengan stasiun (hold/tap sesuai stasiun) |
| **BUANG** | Buang item yang sedang dipegang |

---

## 🏆 Sistem Skor

- **Order selesai**: 100+ poin (bonus waktu tersisa)
- **Combo**: setiap 3 order berturut-turut tanpa salah → multiplier naik
- **Rush Order**: poin 2× lipat
- **Salah kirim / gagal**: -30 / -50 poin

**Rank:**
- 🏆 Chief Engineer (3000+)
- ⭐ Plant Manager (2000+)
- 🔧 Senior Technician (1200+)
- ⚙️ Line Operator (600+)
- 📦 Assembly Staff (300+)

---

## 🔧 Troubleshooting

| Masalah | Solusi |
|---------|--------|
| HP tidak bisa connect | Pastikan HP dan laptop di **WiFi/jaringan yang sama** |
| Layar TV blank / error | Refresh browser, pastikan buka `/display.html` |
| Kontroler lag | Server relay tanpa logika — seharusnya <10ms di LAN. Cek sinyal WiFi |
| HP mati saat main | Aktifkan "Prevent Sleep" di browser / HP settings |

---

## 📝 Credit

Dibuat untuk **Politeknik Industri ATMI Cikarang**  
Program Studi: D3 Mesin Industri, D4 Teknik Rekayasa Mekatronika, D3 Manajemen Industri

---

## 📄 License

MIT
