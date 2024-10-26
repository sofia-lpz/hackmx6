import React, { useRef, useState } from 'react';
import { Camera } from 'lucide-react';

const CameraCapture = ({ onImageCapture }) => {
    const videoRef = useRef(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            videoRef.current.srcObject = stream;
            setIsStreaming(true);
            setError(null);
        } catch (err) {
            setError('Could not access camera. Please ensure you have granted camera permissions.');
            console.error('Error accessing camera:', err);
        }
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
            setIsStreaming(false);
        }
    };

    const captureImage = () => {
        if (!videoRef.current) return;

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0);
        
        canvas.toBlob((blob) => {
            onImageCapture(blob);
            stopCamera();
        }, 'image/jpeg', 0.95);
    };

    return (
        <div className="flex flex-col items-center w-full max-w-lg mx-auto">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            
            <div className="relative w-full aspect-[3/4] bg-gray-900 rounded-lg overflow-hidden">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                />
                
                {!isStreaming && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <button
                            onClick={startCamera}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
                        >
                            <Camera size={24} />
                            Start Camera
                        </button>
                    </div>
                )}
            </div>

            {isStreaming && (
                <div className="mt-4 space-x-4">
                    <button
                        onClick={captureImage}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Capture
                    </button>
                    <button
                        onClick={stopCamera}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default CameraCapture;