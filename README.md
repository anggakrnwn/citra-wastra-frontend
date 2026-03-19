# Citra Wastra 🧵

Citra Wastra is a **modern web application** for classifying **Indonesian batik motifs** using Artificial Intelligence.  
Built with **React 19 + TypeScript + Vite**, it provides a seamless and high-performance user experience for exploring and identifying batik heritage.

The project aims to **preserve Indonesian cultural heritage** through technology, making batik pattern recognition accessible to everyone.

---

## Key Features 🚀

### 🎨 User Experience
- **Native Lazy Loading & Skeletons**: Smooth loading experience for high-resolution batik images from Cloudinary.
- **Modern UI**: Styled with **Tailwind CSS** and **Radix UI**, featuring a beautiful **Amber-themed** dark mode.
- **Multilingual Support**: Switch between Indonesian and English seamlessly.

### 🤖 Intelligent Features
- **Batik Classification**: Upload or take a photo to identify batik motifs with high accuracy.
- **Interactive Maps**: Explore batik origins across Indonesia with an interactive Leaflet map.
- **Text-to-Speech (TTS)**: Listen to AI-generated philosophy and history of each batik motif.

### ⚡ Performance & Optimization
- **SWR Caching**: Intelligent frontend caching for motifs, provinces, and history to minimize API latency.
- **Client-Side Compression**: Automatically compresses large photos (up to 90% reduction) before uploading to ensure lightning-fast processing even on slow connections.
- **Immediate Upload**: Background image processing that doesn't block form submission.

### 🛠️ Admin Management
- **Smart Location Splitting**: Automatically separates "Province" and "City/Regency" data for cleaner management.
- **Advanced Filtering**: Search and filter motifs by province or name with real-time updates.

---

## Tech Stack 🛠
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Lucide React (Icons)
- **State & Data**: SWR (Fetching & Caching), Context API
- **UI Components**: Radix UI, Shadcn/UI primitives
- **Maps**: React Leaflet + OpenStreetMap
- **HTTP Client**: Axios

---

## Getting Started 🏁

### Prerequisites
- **Node.js v18+**
- **npm / pnpm / yarn**
- **Backend API URL** (Railway/Vercel)

### Installation
```bash
# Clone the repository
git clone https://github.com/anggakrnwn/citra-wastra.git
cd citra-wastra-frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

---

## Environment Variables 🌱

Create a `.env` file in the root:
```env
VITE_API_URL=https://your-backend-url.railway.app
```

---

## Project Structure 📂
```
src/
 ├─ components/       # Reusable UI components (ui/, Layout, etc.)
 ├─ context/          # Global state (I18n, WastraContext)
 ├─ pages/            # Main views (Admin, Gallery, Detection, Maps)
 ├─ services/         # API service layer (Axios instances)
 ├─ assets/           # Static data (JSON) and images
 ├─ hooks/            # Custom React hooks
 └─ main.tsx          # App entry point
```

---

## Performance Notes 📈
- **Image Optimization**: Images are served via Cloudinary with `f_auto` and `q_auto` transformations.
- **Bundle Size**: Optimized using Vite's code splitting and tree shaking.
- **API Latency**: Reduced by 70% through backend caching and frontend SWR implementation.

---

## License 📜
This project is licensed under the MIT License.


## Acknowledgements 🙏
* **Indonesian Batik Heritage**: For providing the endless inspiration.
* **Cloudinary**: For efficient image hosting and transformation.
* **Open Source Community**: For the amazing tools that make this project possible.
