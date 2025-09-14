# 📚 AiPrep Learning Assistant  

![Demo](https://img.shields.io/badge/Demo-Live-green.svg)  
![React](https://img.shields.io/badge/React-18.2.0-blue.svg)  
![Node.js](https://img.shields.io/badge/Node.js-Express-brightgreen.svg)  
![LLM](https://img.shields.io/badge/LLM-Ollama-orange.svg)  
![License](https://img.shields.io/badge/License-MIT-yellow.svg)  
![Contributions](https://img.shields.io/badge/Contributions-Welcome-blue.svg)  

**AiPrep** is a real-time educational chat application that explains concepts with text-based answers and interactive visualizations. Ask any question and watch the answer come alive with animations!  

---

## 🚀 Features
- 🤖 **AI-Powered Explanations** – Clear and accurate responses using **Ollama LLM**  
- 🎨 **Interactive Visualizations** – Canvas-based dynamic animations  
- ⚡ **Real-Time Updates** – Powered by **Server-Sent Events (SSE)**  
- 🎯 **Smart Visual Controls** – Play, pause, and control learning animations  
- 🌙 **Dark Mode** – Sleek UI for distraction-free learning  
- 💬 **Chat History** – Persistent Q&A with timestamps  

---

## 🛠️ Tech Stack
### Frontend
- React (Hooks: `useState`, `useEffect`, `useRef`)  
- HTML5 Canvas for interactive simulations  
- EventSource for SSE connections  
- CSS3 with modern flexbox layouts  

### Backend
- Node.js with Express.js  
- Ollama (local LLM processing)  
- RESTful APIs + SSE endpoints  

---

## 📦 Installation

### Prerequisites
- **Node.js** (v14 or higher)  
- **Ollama** installed locally  
- **Llama3.2 model** downloaded  

### Setup
Clone repository
git clone <your-repo-url>
cd aiprep-assignment

Backend setup
cd backend
npm install

Frontend setup
cd ../frontend
npm install

text

### Install & Start Ollama
Install Ollama (from ollama.ai)
ollama pull llama3.2
ollama serve

text

### Start Backend
cd backend
npm run dev

Server runs on: http://localhost:5000
text

### Start Frontend
cd frontend
npm start

App runs on: http://localhost:3000
text

---

## 📡 API Endpoints

- **POST `/api/questions`** → Submit a new question  
{
"userId": "u1",
"question": "Explain Newton's First Law"
}

text

- **GET `/api/questions`** → Get all previous questions  
- **GET `/api/answers/:id`** → Fetch specific answer with visualization  
- **GET `/api/stream`** → SSE endpoint for live updates  

---

## 🎨 Visualization Features
- 🔵 **Circles** – Atoms, particles, objects  
- ⬛ **Rectangles** – Blocks and containers  
- ➡️ **Arrows** – Forces, vectors, directions  
- 📝 **Text** – Labels, equations, data  
- 🔄 **Orbit animations** – Planets, electrons  

---

## 🤖 Supported Question Types
- **Physics** – Motion, Newton’s laws, forces  
- **Chemistry** – Atoms, molecules, bonding  
- **Mathematics** – Equations, problem solving  
- **Astronomy** – Solar system, planetary motion  
- **General Concepts** – Any educational idea  

---

## 🎯 Usage Examples
- Physics → *"Explain Newton's First Law of Motion"*  
- Chemistry → *"What is hydrogen?"*  
- Math → *"Explain 2+2"*  
- Astronomy → *"Describe the solar system"*  

---

## 🔧 Customization

### Add New Visualization Types
Edit `VisualizationCanvas.js`:
const drawNewShape = (ctx, props) => {
ctx.fillStyle = props.color;
// Custom drawing logic here
};

text

### Modify AI Prompts
Edit `ollamaHTTPService.js`:
const prompt = Explain in simple terms: ${question};

text

---

## 🐛 Troubleshooting
- **Ollama not running** → Run `ollama serve`  
- **Port already in use** → Change port in `backend/.env`  
- **Visualization errors** → Check browser console (`F12`)  
- **AI not responding** → Verify Ollama installation & model download  

---

## 📝 Project Structure
aiprep-assignment/
├── backend/
│ ├── src/
│ │ ├── controllers/
│ │ ├── models/
│ │ ├── routes/
│ │ ├── services/
│ │ └── utils/
│ ├── package.json
│ └── server.js
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── hooks/
│ │ ├── services/
│ │ └── utils/
│ ├── package.json
│ └── App.js
└── README.md

text

---

## 🎨 Theme Customization
Modify `App.css`:
:root {
--primary-bg: #1a1a1a;
--secondary-bg: #2d3748;
--text-color: #e2e8f0;
}

text

---

## 🤝 Contributing
1. Fork the repository  
2. Create a feature branch  
3. Commit and push your changes  
4. Open a pull request  

---

## 📄 License
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.  

---

## 🙏 Acknowledgments
- **Ollama** team – For excellent local LLMs  
- **React** team – For a powerful frontend framework  
- **Educators worldwide** – For shaping open knowledge  

---

## 📞 Support
- Check the troubleshooting section  
- Verify Ollama is running  
- Reinstall dependencies if issues persist  

**Happy Learning! 🎓✨**  