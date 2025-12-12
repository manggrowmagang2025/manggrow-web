# Manggrow Web Platform 🚀

<div align="center">
  <img src="./public/logo.png" alt="Manggrow Logo" width="150" />
  <br />
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=2E9EF7&center=true&vCenter=true&width=520&lines=Manggrow+Web+Platform;Internship+Management+System;AI+RAG+Chatbot+Integration;Powered+by+n8n+%26+Supabase" alt="Typing SVG" />
</div>

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![n8n](https://img.shields.io/badge/n8n-FF6584?style=for-the-badge&logo=n8n&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

</div>

---

## 🚀 About The Project

**Manggrow Web Platform** is a comprehensive web application designed to facilitate efficient management and operations for the Manggrow internship project. It features a responsive user interface, real-time data integration, and a seamless user experience.

A standout feature is the **INTELLIGENT AI ASSISTANT**, powered by **n8n** and a **RAG (Retrieval-Augmented Generation)** system. This chatbot allows users to query project documentation and internship guidelines instantly, receiving accurate, context-aware answers.

Designed for **Admins** and **Interns**, it transforms manual tracking processes into a digital, organized, and collaborative workflow.

## 📸 Screenshots

<div align="center">
  <img src="./screenshoots/1.png" width="800" alt="Dashboard" />
  <br/><br/>
  
  <p float="left">
    <img src="./screenshoots/2.png" width="30%" />
    <img src="./screenshoots/3.png" width="30%" />
    <img src="./screenshoots/4.png" width="30%" /> 
  </p>
  <p float="left">
    <img src="./screenshoots/5.png" width="30%" />
    <img src="./screenshoots/6.png" width="30%" />
    <img src="./screenshoots/7.png" width="30%" /> 
  </p>
    <p float="left">
    <img src="./screenshoots/8.png" width="45%" />
    <img src="./screenshoots/9.png" width="45%" />
  </p>
</div>

---

## 💡 Key Features

**Manggrow Web Platform** provides a complete ecosystem for plant lovers and administrators:

### 🌱 For Gardeners (Members)
*   **Smart Garden Helper (Chat AI)**: Consultasi 24/7 dengan AI Assistant yang pintar untuk menanyakan masalah tanaman, tips perawatan, dan rekomendasi pupuk.
*   **My Plants Dashboard**: Catat dan kelola koleksi tanaman Anda. Tambahkan foto, jenis tanaman, dan catatan perkembangan.
*   **Automated Reminders**: Lupa menyiram? Sistem reminder otomatis akan mengingatkan jadwal penyiraman dan pemupukan tanaman spesifik Anda.
*   **Community & Education**: Akses database komunitas pecinta tanaman dan video tutorial terkurasi untuk meningkatkan skill berkebun.
*   **Curated Products**: Dapatkan rekomendasi produk perawatan tanaman terbaik yang sesuai dengan kebutuhan kebun Anda.

### 🛡️ For Administrators
*   **Analytics Dashboard**: Pantau pertumbuhan pengguna, tren tanaman populer, dan performa konten melalui grafik visual (Pie, Bar, Line Charts).
*   **Content Management**: Kelola link komunitas dan video tutorial secara dinamis tanpa menyentuh kode.
*   **Product Management**: Tambah, edit, dan hapus rekomendasi produk untuk pengguna.

---

## 🧠 n8n Workflow Architecture

The core intelligence of Manggrow is powered by two specialized **n8n workflows** working in tandem. You can find the source JSON files in the `/n8n` directory of this repository:

### 1. **Knowledge Base Powerhouse** 📚
*   **File**: `n8n/SeV1IQCIV4H9D8QB-Mandesha_Knowledge.json`
*   **Function**: This workflow acts as the **Data Ingestion Engine**. It processes raw text documents (PDFs, docs, etc.) containing agricultural knowledge.
*   **Process**: It splits documents into manageable chunks, generates vector embeddings, and stores them in the **Supabase Vector Store**. This allows the AI to "read" and "remember" vast amounts of plant care information.

### 2. **AI Agent Brain** 🤖
*   **File**: `n8n/E2GaA62H5H1wXDtb-Mandesha_AI_Agent.json`
*   **Function**: This is the customer-facing **Conversational Agent**.
*   **Capabilities**:
    *   **Contextual RAG**: Retrieves relevant context from the vector store created by the Knowledge workflow.
    *   **Natural Language Processing**: Understands user queries about specific plant symptoms (e.g., "Why are my Monstera leaves turning yellow?").
    *   **Response Generation**:Synthesizes expert advice based on the retrieved knowledge, ensuring accurate and helpful answers.

---

## 🛠️ Tech Stack

### 💻 Frontend (Core)
*   **Framework**: **React** (v18)
*   **Language**: **TypeScript**
*   **Build Tool**: **Vite**

### 🔌 State & Backend
*   **State Management**: **TanStack Query**
*   **Backend (Optional)**: **Supabase** (Auth, Database, Storage)

---

## ⚙️ Installation & Setup

### Prerequisites
*   Node.js 18+
*   npm or bun

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-org/manggrow-web.git
cd manggrow-web
```

### 2️⃣ Install Dependencies
```bash
npm install
# or
bun install
```

### 3️⃣ Configure Environment
Copy the example environment file and update the values.
```bash
cp .env.example .env
```

### 4️⃣ Run Development Server
```bash
npm run dev
# 💻 App runs at http://localhost:8080 or port shown in terminal
```

---

## 📂 Project Structure

A clean, clear structure for scalable development.

```text
manggrow-web/
├── .github/                # GitHub templates & workflows
├── public/                 # Static assets
├── src/
│   ├── assets/             # Component-scoped assets
│   ├── components/         # Reusable UI components
│   ├── contexts/           # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities & helpers
│   ├── pages/              # Route pages
│   ├── App.tsx             # Main App component
│   └── main.tsx            # Entry point
├── .editorconfig           # Editor configuration
├── .env.example            # Environment variables example
└── package.json            # Dependencies & scripts
```

---

<div align="center">

⚡ *Empowering Internship Management with AI-Driven Technology.*

</div>
