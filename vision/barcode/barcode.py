import cv2
from pyzbar.pyzbar import decode

# Open the webcam
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()  # Capture frame
    if not ret:
        break

    # Decode barcodes in the frame
    for barcode in decode(frame):
        barcode_data = barcode.data.decode('utf-8')
        barcode_type = barcode.type
        print(f"Decoded {barcode_type} : {barcode_data}")

        # Draw rectangle around the barcode
        points = barcode.polygon
        if points:
            points = [(p.x, p.y) for p in points]
            cv2.polylines(frame, [np.array(points, dtype=np.int32)], True, (0, 255, 0), 2)

    # Display the frame
    cv2.imshow("Barcode Reader", frame)

    # Exit on pressing 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
