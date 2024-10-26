import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendMessageToOpenAI } from './openaicaller';
import OpenAI from "openai";
import { useSpeechRecognition } from './SpeechRecognitionContext';

const VoiceChat = () => {
    const [currentMessage, setCurrentMessage] = useState('Hola, soy Lupita, tu asistente virtual');
    const [isProcessing, setIsProcessing] = useState(false);
    const processingTimeout = useRef(null);
    const isFirstRender = useRef(true);
    const { isRecognitionActive } = useSpeechRecognition();
    const navigate = useNavigate();
    const isPlaying = useRef(false);

    const speakText = async (text) => {
        // If already playing, don't start a new speech
        if (isPlaying.current) {
            console.log('Already playing audio, skipping...');
            return;
        }

        isPlaying.current = true;
        const openai = new OpenAI({
            apiKey: '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',
            dangerouslyAllowBrowser: true
        });

        try {
            console.log('Starting text-to-speech for:', text);
            const response = await openai.audio.speech.create({
                model: "tts-1-hd",
                voice: "nova",
                input: text
            });

            const audioBlob = new Blob([await response.arrayBuffer()], { type: 'audio/mpeg' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            
            return new Promise((resolve) => {
                audio.onended = () => {
                    URL.revokeObjectURL(audioUrl);
                    isPlaying.current = false;
                    console.log('Finished playing audio');
                    resolve();
                };

                audio.onerror = (error) => {
                    console.error('Audio playback error:', error);
                    isPlaying.current = false;
                    resolve();
                };

                audio.play().catch(error => {
                    console.error('Error playing audio:', error);
                    isPlaying.current = false;
                    resolve();
                });
            });
        } catch (error) {
            console.error('Error in text-to-speech:', error);
            isPlaying.current = false;
        }
    };

    const processMessage = async (transcript) => {
        if (!isProcessing && transcript.toLowerCase().includes('hola lupita')) {
            setIsProcessing(true);
            console.log('Processing message:', transcript);
            
            const message = transcript.toLowerCase().split('hola lupita')[1].trim();
            if (message) {
                try {
                    const aiReply = await sendMessageToOpenAI(message);
                    console.log('Got AI reply:', aiReply);
                    setCurrentMessage(aiReply);
                    await speakText(aiReply);
                } catch (error) {
                    console.error('Error processing message:', error);
                }
            }
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        // Listen for speech transcripts
        const handleTranscript = (event) => {
            const { transcript } = event.detail;
            console.log('Received transcript:', transcript);
            
            if (processingTimeout.current) {
                clearTimeout(processingTimeout.current);
            }

            processingTimeout.current = setTimeout(() => {
                processMessage(transcript);
            }, 3000);
        };

        window.addEventListener('speechTranscript', handleTranscript);
        
        // Only speak initial message on first render
        if (isFirstRender.current) {
            console.log('Speaking initial message');
            speakText(currentMessage);
            isFirstRender.current = false;
        }

        return () => {
            window.removeEventListener('speechTranscript', handleTranscript);
            if (processingTimeout.current) {
                clearTimeout(processingTimeout.current);
            }
        };
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-4 animate-fade-in">
                    {currentMessage}
                </h1>
                {isProcessing && (
                    <div className="text-gray-400 text-sm mt-2">
                        Procesando...
                    </div>
                )}
                <div className="text-gray-400 text-xs mt-2">
                    {isRecognitionActive ? 'Escuchando...' : 'Reconexión en progreso...'}
                </div>
            </div>
        </div>
    );
};

export default VoiceChat;