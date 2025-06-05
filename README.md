# 🛡️ Messaging App Backend with AutoModeration

This is the backend service for a messaging board application, built with **Node.js** and integrated with the **KoalaAI/OffensiveSpeechDetector** large language model to detect offensive or harmful content in real time.

---

## 🚀 Features

- RESTful API built using **Node.js + Express**
- Offensive speech detection via **KoalaAI/OffensiveSpeechDetector**
- PostgreSQL database for storing messages
- Modular architecture for easy extension
- Supports scalable automoderation without requiring manual filtering

---

## 🧱 Tech Stack

| Layer          | Technology                        |
|----------------|------------------------------------|
| Backend        | Node.js (Express) + Python (FastAPI + pytorch)                |
| Database       | PostgreSQL                         |
| Moderation     | [KoalaAI/OffensiveSpeechDetector](https://huggingface.co/KoalaAI/OffensiveSpeechDetector) |
