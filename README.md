# ⚔️ Claude Zoltraak

### *“Menembus Batasan Rate Limit dengan Sihir Pemusnah”*

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-API-blue)](https://openrouter.ai/)

---

## 📖 Tentang

**Claude Zoltraak** adalah *smart gateway* dan *local proxy* yang dirancang untuk **Claude Code CLI**. Ia bertindak sebagai lapisan intelijen di antara CLI dan OpenRouter API, menangani **rotasi API key otomatis**, **fallback model cerdas**, dan **session consistency** — tanpa perlu intervensi manual.

> “Seperti Zoltraak dalam anime Frieren — sebuah mantra ofensif yang mampu menembus pertahanan apapun. Tools ini menembus batasan rate limit dan kuota harian, memastikan workflow coding-mu tak pernah terhenti.”

---

## 🎯 Masalah yang Diselesaikan

| Masalah | Dampak | Solusi Zoltraak |
| :--- | :--- | :--- |
| **Rate Limit (429)** | Alur coding terputus | Rotasi key otomatis |
| **Kuota model gratis habis** | Tidak bisa melanjutkan | Fallback ke model lain |
| **Single point of failure** | 1 key mati = workflow berhenti | Multiple key support |
| **Edit konfigurasi manual** | Repot & buang waktu | REPL interaktif |
| **Tidak tahu model mana yang aktif** | Sulit debugging | Log jelas + scanner |

---

## ✨ Fitur

| Fitur | Deskripsi |
| :--- | :--- |
| **🔄 Rotasi API Key Otomatis** | Mendeteksi error `429`, `401`, `403` dan langsung beralih ke key berikutnya. |
| **🔁 Rotasi Model Otomatis** | Jika model gagal atau kehabisan kuota, proxy akan mencoba model alternatif. |
| **🔒 Session Consistency** | Satu sesi Claude Code tetap menggunakan model yang sama agar tool calling tetap stabil. |
| **📟 REPL Interaktif** | Kelola konfigurasi (`/keys`, `/models`, `/scan`, `/reset`) langsung dari terminal tanpa restart. |
| **🔍 Model Availability Scanner** | Cek model gratis mana yang aktif untuk setiap API key. |
| **📡 Streaming Support** | Mendukung streaming response secara real-time. |
| **🖥️ Cross-Platform** | Berjalan di **Linux**, **Windows**, dan **macOS** (via WSL). |

---

## 📦 Prasyarat

- **Node.js** v18 atau lebih baru ([Download](https://nodejs.org/))
- **NPM** (biasanya ikut Node.js)
- **Koneksi internet** (untuk akses OpenRouter API)
- **Akun OpenRouter** (minimal 1 API key gratis) — [Daftar di sini](https://openrouter.ai/)

---

## 🚀 Instalasi & Penggunaan

### 1. Install Claude Code CLI

#### 🐧 Linux (Bash)
```bash
curl -fsSL https://claude.ai/install.sh | bash
