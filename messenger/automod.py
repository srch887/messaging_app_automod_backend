from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import torch.nn.functional as F

def is_text_offensive(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True)
    with torch.no_grad():
        logits = model(**inputs).logits
    probs = F.softmax(logits, dim=1)
    predicted_class = torch.argmax(probs).item()

    # Map class index to label
    labels = [False, True]
    return labels[predicted_class], probs.squeeze().tolist()

model_name = "KoalaAI/OffensiveSpeechDetector"

if __name__ == '__main__':
    # Load model and tokenizer from Hugging Face
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(model_name)

    # Save to local directory
    save_path = "../notebook/offensive_speech_model"
    tokenizer.save_pretrained(save_path)
    model.save_pretrained(save_path)

    print(is_text_offensive("you are")[0])