from fastapi import FastAPI, Request
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch.nn.functional as F
import torch

app = FastAPI()

class Message(BaseModel):
    message: str

# Load model ONCE at startup
model_path = "../notebook/offensive_speech_model"
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForSequenceClassification.from_pretrained(model_path)

@app.get("/")
def health_check():
    return {"status": "ok"}

@app.post("/moderate")
async def moderate(message: Message):
    text = message.message

    inputs = tokenizer(text, return_tensors="pt", truncation=True)
    with torch.no_grad():
        logits = model(**inputs).logits
    probs = F.softmax(logits, dim=1)
    predicted_class = torch.argmax(probs).item()

    return {
        "offensive": bool(predicted_class),
        "confidence": probs.squeeze().tolist()
    }
