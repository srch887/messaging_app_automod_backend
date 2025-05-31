from fastapi import FastAPI, Request
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch.nn.functional as F
import torch

app = FastAPI()

# Load model ONCE at startup
model_path = "../notebook/offensive_speech_model"
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForSequenceClassification.from_pretrained(model_path)

@app.post("/moderate")
async def moderate(request: Request):
    body = await request.json()
    text = body.get("text", "")

    inputs = tokenizer(text, return_tensors="pt", truncation=True)
    with torch.no_grad():
        logits = model(**inputs).logits
    probs = F.softmax(logits, dim=1)
    predicted_class = torch.argmax(probs).item()

    return {
        "offensive": bool(predicted_class),
        "confidence": probs.squeeze().tolist()
    }
