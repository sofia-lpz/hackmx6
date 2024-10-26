import cv2
import boto3
import io
import pandas as pd
import numpy as np
import json

def capture_image_from_camera():
    cap = cv2.VideoCapture(0)
    print("Press 's' to save the image and process it with Textract, or 'q' to quit.")
    
    while True:
        ret, frame = cap.read()
        cv2.imshow('Capture', frame)

        if cv2.waitKey(1) & 0xFF == ord('s'):
            cv2.imwrite('captured_image.jpg', frame)
            print("Image saved as 'captured_image.jpg', now processing with Textract.")
            return frame
        elif cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

def preprocess_image(image):
    # Convertir a escala de grises
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Aplicar desenfoque gaussiano para reducir el ruido
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Binarización de la imagen para mejorar el contraste del texto
    _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    
    # Dilatar para conectar componentes del texto
    kernel = np.ones((2,2), np.uint8)
    dilated = cv2.dilate(thresh, kernel, iterations=1)
    
    return dilated

def convert_cv2_image_to_bytes(image):
    is_success, buffer = cv2.imencode(".jpg", image)
    io_buf = io.BytesIO(buffer)
    return io_buf


def analyze_image_with_textract(image_bytes):
    client = boto3.client('textract')
    response = client.analyze_document(
        Document={'Bytes': image_bytes.getvalue()},
        FeatureTypes=['TABLES']
    )

    print(json.dumps(response, indent=4))

    print("Response from Textract received. Starting to process the data...")

    data = []
    cells = {}
    print("Processing blocks:")
    for block in response['Blocks']:
        print(f"Block Type: {block['BlockType']}")
        if block['BlockType'] == 'CELL':
            cells[block['Id']] = block
            print(f"Processing CELL at RowIndex: {block.get('RowIndex')} ColumnIndex: {block.get('ColumnIndex')}")
            if 'Relationships' in block:
                text = get_text(block, response)
                print(f"Text extracted from CELL: {text}") 
                data.append({
                    'Row': block.get('RowIndex', 0),
                    'Column': block.get('ColumnIndex', 0),
                    'Content': text
                })

    if data:
        df = pd.DataFrame(data, columns=['Row', 'Column', 'Content'])
        if not df.empty and {'Row', 'Column', 'Content'}.issubset(df.columns):
            df = df.pivot(index='Row', columns='Column', values='Content') 
            print("Final Table:")
            print(df)
        else:
            print("No data available to display as a table.")
    else:
        print("No cells were processed.")

    if data:
        df = pd.DataFrame(data, columns=['Row', 'Column', 'Content'])
        if not df.empty and {'Row', 'Column', 'Content'}.issubset(df.columns):
            df = df.pivot(index='Row', columns='Column', values='Content') 
            print("Final Table:")
            print(df.to_string(index=False, header=False))  # Imprime sin índices ni encabezados de columna
        else:
            print("No data available to display as a table.")
    else:
        print("No cells were processed.")


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

def main():
    image = capture_image_from_camera()
    if image is not None:
        preprocessed_image = preprocess_image(image)  # Aplicar preprocesamiento
        image_bytes = convert_cv2_image_to_bytes(preprocessed_image)  # Convertir imagen preprocesada a bytes
        analyze_image_with_textract(image_bytes)

if __name__ == '__main__':
    main()
