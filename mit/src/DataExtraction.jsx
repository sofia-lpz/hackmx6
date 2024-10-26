import React, { useState, useEffect, useRef } from 'react';
import CameraCapture from './CameraCapture';
import DataProcessor from './DataProcessor';
import OpenAI from "openai";

const API_BASE_URL = 'http://localhost:8080/api'; // Update with your API URL
const dataProcessor = new DataProcessor(API_BASE_URL);

const DataExtraction = () => {
    const [imageData, setImageData] = useState(null);
    const [extractedData, setExtractedData] = useState(null);
    const [processedData, setProcessedData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cameraPermission, setCameraPermission] = useState('prompt');
    const [showCamera, setShowCamera] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (navigator.permissions && navigator.permissions.query) {
            navigator.permissions.query({ name: 'camera' })
                .then(permissionStatus => {
                    setCameraPermission(permissionStatus.state);
                    permissionStatus.onchange = () => {
                        setCameraPermission(permissionStatus.state);
                    };
                })
                .catch(error => {
                    console.error('Error checking camera permission:', error);
                });
        }
    }, []);

    const requestCameraPermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop());
            setCameraPermission('granted');
            setShowCamera(true);
        } catch (err) {
            console.error('Error requesting camera permission:', err);
            setCameraPermission('denied');
            setError('Camera access was denied. Please allow camera access in your browser settings.');
        }
    };

    const processWithAI = async (extractedText) => {
        const openai = new OpenAI({
            apiKey: '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',
            dangerouslyAllowBrowser: true
        });
    
        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4", // or "gpt-4" if you have access
                messages: [
                    {
                        role: "system",
                        content: `You are a data parsing assistant. Analyze the provided data and format it for database insertion. 
                        Return ONLY a JSON object with a 'data' array containing the formatted records.
                        Possible formats:
                        1. productos: { "data": [{ "nombre": "", "precio": 0, "stock": "", "categoria": "", "proveedor_id": "" }] }
                        2. ventas: { "data": [{ "fecha": "", "total": 0, "producto_id": "", "cantidad": 0, "cliente": "", "metodo_pago": "" }] }
                        3. proveedores: { "data": [{ "nombre": "", "contacto": "", "direccion": "", "telefono": "", "email": "", "categoria": "" }] }
                        Do not include any additional text or explanations in your response, only the JSON object.`
                    },
                    {
                        role: "user",
                        content: `Parse this data into the appropriate format: ${JSON.stringify(extractedText)}`
                    }
                ],
                temperature: 0.1
            });
    
            const responseText = completion.choices[0].message.content.trim();
            
            // Handle possible JSON formatting issues
            try {
                // Try to parse the response as JSON
                const jsonResponse = JSON.parse(responseText);
                console.log('Successfully parsed AI response:', jsonResponse);
                return jsonResponse;
            } catch (parseError) {
                console.error('Error parsing AI response:', parseError);
                // If there's text before or after the JSON, try to extract it
                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[0]);
                }
                throw new Error('Could not parse AI response as JSON');
            }
        } catch (error) {
            console.error('Error processing with AI:', error);
            throw error;
        }
    };

    const handleImageProcess = async (file) => {
        setIsLoading(true);
        setError(null);
        console.log('Processing image, size:', file.size);
        
        try {
            // 1. Send to Python backend for OCR
            const formData = new FormData();
            formData.append('file', file);

            console.log('Sending to Python backend for OCR...');
            const response = await fetch('http://0.0.0.0:8000/process-image', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to process image');
            }

            // 2. Get OCR results
            const extractedResult = await response.json();
            console.log('Received OCR data:', extractedResult);
            setExtractedData(extractedResult);

            // 3. Process with AI
            try {
                console.log('Processing with AI...');
                const aiProcessedData = await processWithAI(extractedResult);
                console.log('AI processed data:', aiProcessedData);
                setProcessedData(aiProcessedData);

                // 4. Post to database
                const processorResult = await dataProcessor.postData(aiProcessedData);
                console.log('Database post result:', processorResult);

            } catch (processError) {
                console.error('Error during AI processing or database posting:', processError);
                setError('Data was extracted but could not be processed: ' + processError.message);
            }

            // Set the image preview
            setImageData(URL.createObjectURL(file));

        } catch (err) {
            console.error('Error in handleImageProcess:', err);
            setError(err.message || 'Failed to process image. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                handleImageProcess(file);
            } else {
                setError('Please upload an image file.');
            }
        }
    };

    const handleImageCapture = async (blob) => {
        const file = new File([blob], 'captured_image.jpg', { type: 'image/jpeg' });
        await handleImageProcess(file);
    };

    const renderCaptureOptions = () => (
        <div className="flex flex-col items-center space-y-4">
            <h2 className="text-xl font-semibold mb-4">Choose Capture Method</h2>
            <div className="flex space-x-4">
                <button
                    onClick={() => requestCameraPermission()}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded flex items-center space-x-2"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Use Camera</span>
                </button>
                
                <div className="relative">
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded flex items-center space-x-2"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span>Upload Image</span>
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-center mb-6">
                Document Data Extraction
            </h1>

            {cameraPermission === 'denied' && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    Camera access was denied. Please enable camera access in your browser settings and refresh the page.
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
                    {error}
                </div>
            )}

            {!imageData && !showCamera && !isLoading && renderCaptureOptions()}

            {showCamera && !imageData && (
                <div>
                    <CameraCapture onImageCapture={handleImageCapture} />
                    <button
                        onClick={() => setShowCamera(false)}
                        className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Back to Options
                    </button>
                </div>
            )}

            {isLoading && (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4">Processing image...</p>
                </div>
            )}

            {imageData && !isLoading && (
                <div className="mt-6">
                    <div className="mb-4">
                        <img 
                            src={imageData} 
                            alt="Captured document" 
                            className="max-w-full h-auto rounded-lg shadow-lg"
                        />
                    </div>
                    
                    {/* Display Raw OCR Data */}
                    {extractedData && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">Extracted Data:</h3>
                            <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                                {JSON.stringify(extractedData, null, 2)}
                            </pre>
                        </div>
                    )}

                    {/* Display Processed Data */}
                    {processedData && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">Processed Data:</h3>
                            <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                                {JSON.stringify(processedData, null, 2)}
                            </pre>
                        </div>
                    )}

                    <button
                        onClick={() => {
                            setImageData(null);
                            setExtractedData(null);
                            setProcessedData(null);
                            setShowCamera(false);
                        }}
                        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Process Another Image
                    </button>
                </div>
            )}
        </div>
    );
};

export default DataExtraction;