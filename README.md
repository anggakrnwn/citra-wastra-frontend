# Citra Wastra 🧵

Citra Wastra is a **frontend web application** for classifying **Indonesian batik motifs**.  
It is built with **React + TypeScript + Vite** and communicates with a private backend API (Express + Prisma + PostgreSQL).  

The purpose is to **preserve Indonesian cultural heritage** through technology by making batik pattern recognition more accessible.  

---

## Features 🚀
- 🔐 User authentication (Register & Login)
- 📤 Upload batik images
- 🤖 Batik motif classification (via private backend API)
- 📊 Confidence score for each prediction
- 🎨 Clean UI with Tailwind CSS
- 🌐 Optimized for deployment

---

## Tech Stack 🛠
- React + TypeScript + Vite
- Tailwind CSS
- Axios
- React Router
- Context API (state management)


## Getting Started 🏁

### Prerequisites

* Node.js v18+
* pnpm / npm / yarn
* Backend API URL (provided separately)

### Installation

```bash
git clone https://github.com/yourusername/citra-wastra-frontend.git
cd citra-wastra-frontend
pnpm install
pnpm dev
```

---

## Environment Variables 🌱

Create a `.env` file in the frontend root:

```env
VITE_API_URL=https://your-backend-url/api
```

---

## Project Structure 📂

```
src/
 ├─ components/       # Reusable UI components
 ├─ context/          # Global state (WastraContext)
 ├─ pages/            # Auth, Upload, Result pages
 ├─ services/         # API service (axios)
 ├─ App.tsx           # Main app entry
 └─ main.tsx          # Vite bootstrap
```

---

## Future Plans 🔮

* 📱 Mobile-friendly UI/UX
* 🖼️ Multiple image uploads
* 💾 User history & favorites
* 🌍 Multilingual support
* 🔎 More batik motif categories

---

## License 📜

This project is licensed under the MIT License.

---

## Acknowledgements 🙏

* Indonesian Batik Heritage
* Machine Learning community
* Open source contributors
