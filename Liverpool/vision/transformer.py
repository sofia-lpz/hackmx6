from transformers import AutoImageProcessor, AutoModelForObjectDetection
from PIL import Image
import requests
import torch

# Load model and processor
processor = AutoImageProcessor.from_pretrained("valentinafeve/yolos-fashionpedia")
model = AutoModelForObjectDetection.from_pretrained("valentinafeve/yolos-fashionpedia")

# Load an image from a URL or file
image_url = "https://example.com/path/to/your/image.jpg"
image = Image.open(requests.get(image_url, stream=True).raw)

# Preprocess the image
inputs = processor(images=image, return_tensors="pt")

# Make predictions
outputs = model(**inputs)

# Post-process the predictions
# Assuming the model returns bounding boxes and labels
logits = outputs.logits
boxes = outputs.pred_boxes

# Convert logits to probabilities
probs = torch.nn.functional.softmax(logits, dim=-1)

# Get the predicted class labels and bounding boxes
pred_labels = torch.argmax(probs, dim=-1)
pred_boxes = boxes.detach().cpu().numpy()

# Print the results
for label, box in zip(pred_labels, pred_boxes):
    print(f"Label: {label}, Box: {box}")