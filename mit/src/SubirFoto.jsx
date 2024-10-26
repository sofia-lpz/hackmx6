import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function SubirFoto() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const handleOpenCamera = () => {
    setIsCameraOpen(true);
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch((err) => {
        console.error("Error accessing camera: ", err);
      });
  };

  const handleCapture = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    const dataUrl = canvasRef.current.toDataURL('image/png');
    setPreview(dataUrl);
    setSelectedFile(dataUrl);
    setIsCameraOpen(false);
  };

  const handleUpload = () => {
    if (selectedFile) {
      // Implement the upload functionality here
      console.log('Uploading:', selectedFile);
      // Reset the state after upload
      setSelectedFile(null);
      setPreview(null);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreview(null);
    setIsCameraOpen(false);
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-900 p-4">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-white mb-4">Subir Foto</h1>
        {!isCameraOpen && !preview && (
          <button
            onClick={handleOpenCamera}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Abrir Cámara
          </button>
        )}
        {isCameraOpen && (
          <div className="mb-4">
            <video ref={videoRef} className="w-full max-w-md mx-auto mb-4" />
            <button
              onClick={handleCapture}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Capturar
            </button>
          </div>
        )}
        {preview && (
          <div className="mb-4">
            <img src={preview} alt="Preview" className="max-w-full h-auto mx-auto m-2 border-2 border-white" />
            <p className="text-white">{selectedFile.name}</p>
          </div>
        )}
        {selectedFile && (
          <div className="flex gap-4">
            <button
              onClick={handleUpload}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Subir
            </button>
            <button
              onClick={handleCancel}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancelar
            </button>
          </div>
        )}
        <button
          onClick={() => navigate('/')}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Regresar al Menú Principal
        </button>
      </div>
      <canvas ref={canvasRef} className="hidden" width="640" height="480"></canvas>
    </div>
  );
}

export default SubirFoto;