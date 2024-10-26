from ultralytics import YOLO
from typing import Union, List
import numpy as np

def get_coco_class_name(class_id: int) -> str:
    """Get COCO class name from class ID."""
    # COCO class names
    coco_names = ['person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat', 'traffic light',
                'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow',
                'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee',
                'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard',
                'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple',
                'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch',
                'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 
                'cell phone', 'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors',
                'teddy bear', 'hair drier', 'toothbrush']
    
    if 0 <= class_id < len(coco_names):
        return coco_names[class_id]
    return "unknown"

def count_detections(inference_results, confidence_threshold: float = 0.5) -> dict:
    """
    Count detections for each class in the inference results.
    
    Args:
        inference_results: YOLO inference results
        confidence_threshold: Minimum confidence score to count a detection
    
    Returns:
        Dictionary with class names and their counts
    """
    try:
        # Get the first result if results are in a list
        result = inference_results[0] if isinstance(inference_results, list) else inference_results
        
        # Get boxes and confidence scores
        boxes = result.boxes
        class_counts = {}
        
        # Count detections for each class
        for box in boxes:
            confidence = float(box.conf)
            if confidence >= confidence_threshold:
                class_id = int(box.cls)
                class_name = get_coco_class_name(class_id)
                class_counts[class_name] = class_counts.get(class_name, 0) + 1
        
        return class_counts
    
    except Exception as e:
        print(f"Error processing inference results: {e}")
        return {}

# Load model and perform inference
try:
    model = YOLO("./models/yolo11n.pt")
    inference = model("./images/images.jpg")  # 47 is banana in COCO
    
    # Count and print detections
    detections = count_detections(inference)
    
    if detections:
        print("\nDetected objects:")
        for class_name, count in detections.items():
            print(f"{class_name}: {count} object(s)")
    else:
        print("No objects detected above the confidence threshold.")

except Exception as e:
    print(f"Error: {e}")