from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import boto3
import io
import pandas as pd
from PIL import Image

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def preprocess_image(image_array):
    # Convert to grayscale
    gray = cv2.cvtColor(image_array, cv2.COLOR_BGR2GRAY)
    
    # Apply Gaussian blur
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Binarization
    _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    
    # Dilate to connect text components
    kernel = np.ones((2,2), np.uint8)
    dilated = cv2.dilate(thresh, kernel, iterations=1)
    
    return dilated

def get_text(cell, response):
    text = ""
    if 'Relationships' in cell:
        for relationship in cell['Relationships']:
            if relationship['Type'] == 'CHILD':
                for childId in relationship['Ids']:
                    child = next(block for block in response['Blocks'] if block['Id'] == childId)
                    if child['BlockType'] == 'WORD':
                        text += child['Text'] + ' '
    return text.strip()

@app.post("/process-image")
async def process_image(file: UploadFile = File(...)):
    try:
        # Read image file
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Preprocess image
        processed_img = preprocess_image(img)
        
        # Convert to bytes for Textract
        is_success, buffer = cv2.imencode(".jpg", processed_img)
        io_buf = io.BytesIO(buffer)
        
        # Initialize Textract client
        client = boto3.client('textract')
        
        # Analyze with Textract
        response = client.analyze_document(
            Document={'Bytes': io_buf.getvalue()},
            FeatureTypes=['TABLES']
        )
        
        # Process Textract response
        data = []
        for block in response['Blocks']:
            if block['BlockType'] == 'CELL':
                if 'Relationships' in block:
                    text = get_text(block, response)
                    data.append({
                        'Row': block.get('RowIndex', 0),
                        'Column': block.get('ColumnIndex', 0),
                        'Content': text
                    })
        
        # Convert to table format
        if data:
            df = pd.DataFrame(data)
            pivot_table = df.pivot(index='Row', columns='Column', values='Content')
            return pivot_table.to_dict('records')
        
        return []
        
    except Exception as e:
        print(f"Error processing image: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)