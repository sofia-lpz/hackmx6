import cv2
import boto3
import io
import pandas as pd
import numpy as np
import json

def capture_image_from_camera():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open camera")
        return None
        
    print("Press 's' to save the image and process it with Textract, or 'q' to quit.")
    
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error: Could not read frame")
            break
            
        cv2.imshow('Capture', frame)
        
        key = cv2.waitKey(1) & 0xFF
        if key == ord('s'):
            cv2.imwrite('captured_image.jpg', frame)
            print("Image saved as 'captured_image.jpg', now processing with Textract.")
            cap.release()
            cv2.destroyAllWindows()
            return frame
        elif key == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    return None

def preprocess_image(image):
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Apply Gaussian blur to reduce noise
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Apply adaptive thresholding instead of simple binary threshold
    thresh = cv2.adaptiveThreshold(
        blurred,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV,
        11,
        2
    )
    
    # Dilate to connect text components
    kernel = np.ones((2,2), np.uint8)
    dilated = cv2.dilate(thresh, kernel, iterations=1)
    
    return dilated

def convert_cv2_image_to_bytes(image):
    is_success, buffer = cv2.imencode(".jpg", image)
    if not is_success:
        raise ValueError("Failed to encode image")
    return io.BytesIO(buffer)

def analyze_image_with_textract(image_bytes):
    try:
        client = boto3.client('textract')
        response = client.analyze_document(
            Document={'Bytes': image_bytes.getvalue()},
            FeatureTypes=['TABLES']
        )
        
        data = []
        for block in response['Blocks']:
            if block['BlockType'] == 'CELL':
                if 'Relationships' in block:
                    text = get_text(block, response)
                    row_idx = block.get('RowIndex', 0)
                    col_idx = block.get('ColumnIndex', 0)
                    data.append({
                        'Row': row_idx,
                        'Column': col_idx,
                        'Content': text
                    })

        if not data:
            print("No table data detected in the image")
            return

        # Create DataFrame and pivot to format table
        df = pd.DataFrame(data)
        df = df.pivot(index='Row', columns='Column', values='Content')
        
        # Sort by row and column indices
        df = df.sort_index()
        df = df.reindex(sorted(df.columns), axis=1)
        
        print("\nExtracted Table:")
        print(df.to_string())
        
        # Save to CSV
        df.to_csv('extracted_table.csv')
        print("\nTable saved to 'extracted_table.csv'")
        
    except Exception as e:
        print(f"Error processing image with Textract: {str(e)}")

def get_text(cell, response):
    text = []
    if 'Relationships' in cell:
        for relationship in cell['Relationships']:
            if relationship['Type'] == 'CHILD':
                for child_id in relationship['Ids']:
                    child = next(
                        (block for block in response['Blocks'] if block['Id'] == child_id),
                        None
                    )
                    if child and child['BlockType'] == 'WORD':
                        text.append(child['Text'])
    return ' '.join(text)

def main():
    try:
        print("Initializing camera...")
        image = capture_image_from_camera()
        
        if image is not None:
            print("Preprocessing image...")
            preprocessed_image = preprocess_image(image)
            
            print("Converting image for Textract...")
            image_bytes = convert_cv2_image_to_bytes(preprocessed_image)
            
            print("Analyzing with AWS Textract...")
            analyze_image_with_textract(image_bytes)
            
    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == '__main__':  # Fixed the string comparison
    main()