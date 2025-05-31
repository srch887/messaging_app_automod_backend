from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import torch.nn.functional as F
import warnings
warnings.filterwarnings("ignore")

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
save_path = "../notebook/offensive_speech_model"

if __name__ == '__main__':
    # Load model and tokenizer from locally saved model
    tokenizer = AutoTokenizer.from_pretrained(save_path)
    model = AutoModelForSequenceClassification.from_pretrained(save_path)
    
    message = input()

    print(is_text_offensive(message)[0])