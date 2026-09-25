# ✨ ClearCut — AI Background Remover

ClearCut is a professional, lightning-fast web application that leverages cutting-edge AI to remove image backgrounds instantly. Built with a modern **React (Vite)** frontend and a powerful **FastAPI** backend, it provides a seamless SaaS-like experience directly on your local machine.

![ClearCut Preview](frontend/public/vite.svg)

## 🌐 Live Demo

- **Frontend Application**: [https://clear-cut-lpzf.vercel.app/](https://clear-cut-lpzf.vercel.app/)
- **Backend API**: `https://clear-cut-6h8t.onrender.com`

## 🌟 Features

- **Instant Background Removal**: Powered by `rembg` (U²-Net architecture) for pixel-perfect precision.
- **Custom Backgrounds**: Replace transparent backgrounds with solid colors (via color picker/swatches) or upload your own custom image.
- **Interactive UI**: Drag & drop upload, animated processing states, and a visual before/after compare slider.
- **Privacy-First**: Images are processed entirely locally. No data is stored or sent to external servers.
- **Premium Design**: Dark mode interface with glassmorphism, smooth micro-animations, and responsive layout.

---

## 🚀 Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Styling**: Custom CSS design system (Variables, Flexbox/Grid, Animations)

### Backend
- **Framework**: FastAPI (Python)
- **AI/ML Engine**: `rembg` (ONNX Runtime)
- **Image Processing**: Pillow (PIL)
- **Server**: Uvicorn

---

## 🛠️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### 1. Backend Setup

The backend handles the AI image processing. It runs on `http://localhost:8000`.

**Prerequisites:** Python 3.8+ (Python 3.10+ recommended)

Open a terminal in the root directory:

**Windows (PowerShell):**
```powershell
# Create and activate a virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Start the API server
uvicorn backend.main:app --reload --port 8000
```

**Mac/Linux:**
```bash
# Create and activate a virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the API server
uvicorn backend.main:app --reload --port 8000
```

### 2. Frontend Setup

The frontend provides the user interface. It runs on `http://localhost:5173` (or `5174`).

Open a **separate** terminal window:

```bash
# Navigate to the frontend directory
cd frontend

# Install Node modules
npm install

# Start the development server
npm run dev
```

*Note: The frontend is pre-configured (in `vite.config.js`) to automatically proxy all `/api/*` requests to your backend at `http://localhost:8000`.*

---

## 📦 Building for Production

To build the application for a production environment:

**Frontend:**
```bash
cd frontend
npm run build
```
This will generate highly optimized static files in the `frontend/dist` directory. You can serve these using Nginx, Apache, or any static file host.

**Backend:**
While Uvicorn is great for development, for production it's highly recommended to run it behind a process manager and a reverse proxy (like Nginx) or use Gunicorn with Uvicorn workers:
```bash
pip install gunicorn
gunicorn backend.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
