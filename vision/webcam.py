from ultralytics import YOLO
import cv2

# Load a model
model = YOLO("./models/yolo11n.pt")

cap = cv2.VideoCapture(0)

# Set the resolution to 640x480
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

# Check if the webcam is opened correctly
if not cap.isOpened():
    print("Error: Could not open webcam.")
    exit()

# Loop to continuously get frames from the webcam
while True:
    # Capture frame-by-frame
    ret, frame = cap.read()
    if not ret:
        print("Error: Could not read frame.")
        break

    # Use the model to make predictions on the current frame
    results = model(frame, imgsz=640, classes = [47])  # Set imgsz to 640x640

    # Draw bounding boxes and labels on the frame
    for result in results:
        for box in result.boxes:
            x1, y1, x2, y2 = box.xyxy[0].int().tolist()
            label = model.names[int(box.cls)]  # Convert class index to class name

            # Draw the bounding box
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

            # Add the label text above the bounding box
            font = cv2.FONT_HERSHEY_SIMPLEX
            font_scale = 0.5
            color = (0, 255, 0)  # Green text
            thickness = 1
            cv2.putText(frame, f'{label}', (x1, y1 - 10), font, font_scale, color, thickness)

    # Display the resulting frame
    cv2.imshow('Webcam', frame)

    # Break the loop on 'q' key press
    if cv2.waitKey(30) & 0xFF == ord('q'):  # Increased delay for key detection
        break

# Release the capture and close windows
cap.release()
cv2.destroyAllWindows()
