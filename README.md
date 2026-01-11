# Bimble Kedok - Platform Tryout Online

Web aplikasi bimbel/tryout online menggunakan Next.js 14 dengan App Router.

## 🎯 Status Proyek
- ✅ **Demo Phase:** Complete - Full UI/UX flow dengan dummy data
- 🚀 **MVP Ready:** Refactored dan siap untuk backend integration
- 📋 **Next Steps:** Backend API, Database, Payment Gateway (lihat `MVP_ROADMAP.md`)

## 💡 Tujuan
- Platform tryout online untuk persiapan ujian (UTBK, CPNS, dll)
- Demo untuk presentasi ke client
- Struktur scalable dan production-ready

## 🚀 Cara Menjalankan

### Instalasi Dependencies
```bash
npm install
```

### Menjalankan Development Server
```bash
npm run dev
```

Buka browser dan akses: [http://localhost:3000](http://localhost:3000)

### Build untuk Production
```bash
npm run build
npm start
```

## 📁 Struktur Folder (MVP-Ready)

```
bimble-kedok-app/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Dashboard User
│   │   ├── latihan/
│   │   │   └── page.tsx          # Latihan Harian (10 soal)
│   │   ├── simulasi/
│   │   │   └── page.tsx          # Simulasi Ujian (150 soal)
│   │   ├── hasil/
│   │   │   └── page.tsx          # Hasil Latihan
│   │   ├── hasil-simulasi/
│   │   │   └── page.tsx          # Hasil Simulasi
│   │   ├── login/
│   │   │   └── page.tsx          # Login (Fake Auth)
│   │   ├── layout.tsx            # Root Layout
│   │   ├── page.tsx              # Landing Page
│   │   └── globals.css           # Global Styles
│   ├── components/
│   │   ├── ui/                   # Reusable UI Components
│   │   │   └── index.tsx         # Button, Card, Modal, etc.
│   │   ├── layout/               # Layout Components
│   │   │   └── Navbar.tsx        # Navbar Component
│   │   ├── exam/                 # Exam-specific Components
│   │   │   ├── QuestionCard.tsx  # Question Display
│   │   │   ├── Timer.tsx         # Countdown Timer
│   │   │   └── QuestionNavigator.tsx # Question Grid
│   │   ├── BannerModal.tsx       # Promo Banner Modal
│   │   └── UpgradePrompt.tsx     # Upgrade CTA
│   ├── hooks/                    # Custom React Hooks
│   │   └── index.ts              # useAuth, useExamSession, etc.
│   ├── lib/                      # Core Library Functions
│   │   ├── api.ts                # API Service Layer (ready for backend)
│   │   ├── utils.ts              # Utility Functions
│   │   └── constants.ts          # App Constants
│   ├── types/                    # TypeScript Types
│   │   └── index.ts              # All Type Definitions
│   └── data/                     # Dummy Data (temporary)
│       ├── questions.ts          # 10 soal latihan
│       └── examQuestions.ts      # 150 soal simulasi
├── .env.example                  # Environment Variables Template
├── MVP_ROADMAP.md                # Development Roadmap
├── BACKEND_INTEGRATION.md        # Backend Integration Guide
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.mjs
```
│       └── questions.ts          # Dummy Data Soal
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.mjs
```

## 🎨 Fitur Demo

### 1. Landing Page
- Hero section dengan CTA
- Feature highlights
- Navigasi ke halaman login

### 2. Login (Fake Authentication)
- Input email & password (accept any value)
- Langsung redirect ke dashboard setelah login
- Data user disimpan di localStorage

### 3. Dashboard
- Welcome section dengan nama user
- Kartu statistik (soal hari ini, latihan selesai, nilai)
- Banner promosi modal (muncul otomatis setelah 1 detik)
- Tombol aksi untuk mulai latihan
- Fitur premium yang di-disable

### 4. Latihan Harian
- 10 soal pilihan ganda
- Timer countdown (10 menit)
- Progress tracking soal yang sudah dijawab
- Navigasi antar soal
- State jawaban tersimpan di client

### 5. Hasil Latihan
- Tampilan skor dengan emoji
- Statistik benar/salah
- Pembahasan lengkap setiap soal
- Highlight jawaban benar dan salah
- CTA upgrade ke premium
- Tombol untuk latihan lagi

## 🎭 Flow User

1. User membuka landing page
2. Klik tombol "Masuk" atau "Mulai Belajar Gratis"
3. Masuk ke halaman login (isi email & password apa saja)
4. Redirect ke dashboard
5. **Banner promosi muncul full-screen** (modal interstitial)
6. User menutup banner
7. Klik "Mulai Latihan Harian"
8. Mengerjakan 10 soal dengan timer
9. Submit latihan
10. Melihat hasil dengan pembahasan
11. **Muncul CTA "Upgrade ke Premium"**

## 🛠️ Teknologi

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React useState
- **Storage**: localStorage (untuk fake auth & hasil)
- **Routing**: Next.js useRouter

## 📝 Dummy Data

10 soal pilihan ganda mencakup:
- Matematika
- Sejarah
- Sains
- Geografi
- Teknologi

Setiap soal memiliki:
- Pertanyaan
- 4 pilihan jawaban
- Jawaban benar
- Penjelasan

## 🏗️ Arsitektur MVP

### Current (Demo Mode)
- ✅ Client-side state management (localStorage)
- ✅ Dummy data hardcoded
- ✅ Fake authentication
- ✅ All features work offline

### Ready for Backend Integration
- 🔌 **API Service Layer** (`src/lib/api.ts`) - Ready dengan placeholder untuk backend calls
- 🪝 **Custom Hooks** (`src/hooks/index.ts`) - useAuth, useExamSession, useExamResult
- 📦 **TypeScript Types** (`src/types/index.ts`) - Semua interface defined
- 🧩 **Reusable Components** - Modular dan siap scale
- 📝 **Documentation** - Backend integration guide tersedia

### Backend Integration Steps
1. Setup backend API (Node.js/Express atau Next.js API Routes)
2. Uncomment API calls di `src/lib/api.ts`
3. Setup database (PostgreSQL + Prisma)
4. Implement authentication (JWT)
5. Connect payment gateway (Midtrans/Xendit)

**Lihat `BACKEND_INTEGRATION.md` untuk detail lengkap.**

## 📚 Documentation

- **`README.md`** - Project overview dan quick start
- **`MVP_ROADMAP.md`** - Development roadmap Phase 1-6
- **`BACKEND_INTEGRATION.md`** - Backend integration guide
- **`.env.example`** - Environment variables template
- **`GAP_PENELITIAN_KUALITAS_UDARA.md`** - Tinjauan pustaka penelitian kualitas udara dalam ruangan dan kesehatan pernapasan (research gap analysis)
- **`TENTANG_DOKUMEN_PENELITIAN.md`** - Penjelasan tentang dokumen penelitian

## 🎯 Untuk Demo

Login menggunakan kredensial apapun, contoh:
- **Email**: demo@bimblekedok.com
- **Password**: demo123

Semua input email & password akan diterima dan langsung masuk ke dashboard.

## 📱 Responsive Design

Aplikasi sudah responsive untuk:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🎨 Color Scheme

- **Primary**: Blue (#0ea5e9 - #0c4a6e)
- **Secondary**: Purple & Orange (untuk promosi)
- **Success**: Green
- **Error**: Red
- **Neutral**: Gray scale

## 🚀 Next Steps (Untuk Production)

1. **Backend Setup**
   ```bash
   # Install backend dependencies
   npm install express prisma @prisma/client bcrypt jsonwebtoken
   
   # Initialize Prisma
   npx prisma init
   
   # Run migrations
   npx prisma migrate dev
   ```

2. **Environment Configuration**
   ```bash
   # Copy environment template
   cp .env.example .env.local
   
   # Update with real values
   NEXT_PUBLIC_API_URL=https://api.your-domain.com
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-secret-key
   ```

3. **Enable Backend Integration**
   - Uncomment API calls di `src/lib/api.ts`
   - Update hooks di `src/hooks/index.ts`
   - Test authentication flow
   - Deploy database & API

4. **Payment Integration**
   - Setup Midtrans/Xendit account
   - Implement payment endpoints
   - Update `UpgradePrompt` component

**Follow `MVP_ROADMAP.md` untuk step-by-step guide.**

---

**Dibuat untuk Demo & MVP - Bimble Kedok Platform**  
**Status:** Demo Complete ✅ | MVP Architecture Ready 🚀
