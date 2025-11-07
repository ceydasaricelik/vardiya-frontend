🎯 Vardiya Frontend — Lovable AI Studio (React + TypeScript)

Bu proje, Vardiya Yönetim Sistemi için oluşturulmuş modern bir frontend arayüzüdür.
Lovable AI Studio üzerinde geliştirilmiş olup, sistemin Rails API backend’ine bağlanarak CRUD işlemlerini test eder.

🚀 Proje Özeti
Katman	Teknoloji
Framework	React + TypeScript
Tasarım Aracı	Lovable AI Studio
State Yönetimi	Zustand
API Katmanı	Axios
Test Aracı	Cypress
Routing	React Router DOM v6
UI Kütüphanesi	ShadCN UI + TailwindCSS
📦 Yapı
src/
 ├── api/           # Axios API katmanı
 ├── store/         # Zustand state yönetimi
 ├── components/    # Layout, Navbar, Card vb.
 ├── pages/         # Çalışanlar, Vardiyalar, Atamalar sayfaları
 └── App.tsx        # Ana yönlendirme

⚙️ Kurulum

1️⃣ Gerekli bağımlılıkları yükle

npm install


2️⃣ .env dosyası oluştur

VITE_API_BASE_URL=http://localhost:3000/api/v1


3️⃣ Uygulamayı çalıştır

npm run dev


👉 Aç: http://localhost:8080

🧪 Cypress Testleri

Tüm sayfalar data-cy attribute’ları ile test edilebilir hale getirilmiştir.
Cypress ile çalışan, vardiya ve atama CRUD akışları uçtan uca (E2E) test edilmiştir.

✅ Geçen testler:

employees.cy.js → Çalışan CRUD

shifts.cy.js → Vardiya CRUD

assignments.cy.js → Atama CRUD

vardiya_frontend.cy.js → Ana sayfa erişimi

Tüm testler başarıyla tamamlanmıştır. 🎥

📺 YouTube Demo Videosu

🎬 İzle: https://youtu.be/OfNNLF259mw

🎨 Tasarım Özellikleri

Modern, sade ve soft pastel renk paleti

Tam responsive yapı (desktop & mobile)

Kullanıcı dostu arayüz

Erişilebilirlik odaklı WCAG uyumlu tasarım

💻 Kullanılan Teknolojiler
Katman	Teknoloji
Frontend	React + TypeScript
Tasarım	Lovable AI Studio
Stil	TailwindCSS + ShadCN UI
State	Zustand
Test	Cypress
API	Axios (REST)
🎓 Mentorlar & Teşekkür

Bu proje sürecinde bana rehberlik eden
Nurettin Şenyer ve Ömer Durmuş hocalarıma teşekkür ederim. 💐

📂 İlgili Bağlantılar

🔗 Frontend (Lovable): https://github.com/ceydasaricelik/vardiya-frontend

🔗 Backend (Rails API): https://github.com/ceydasaricelik/vardiya_api

🎥 Demo Video: YouTube

🩷 Hazırlayan: Halide Ceyda Sarıçelik
#React #TypeScript #Cypress #TailwindCSS #ShadCN #LovableAI #RailsAPI #FullStackDevelopment #SoftwareEngineering #UniversityProject #VardiyaFrontend
