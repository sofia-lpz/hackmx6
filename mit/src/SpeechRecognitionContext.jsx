import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const SpeechRecognitionContext = createContext(null);

export const SpeechRecognitionProvider = ({ children }) => {
    const [isRecognitionActive, setIsRecognitionActive] = useState(false);
    const recognition = useRef(null);
    const currentTranscript = useRef('');
    const processingTimeout = useRef(null);
    const isInitialized = useRef(false);

    const startRecognition = () => {
        if (recognition.current && !isRecognitionActive) {
            try {
                recognition.current.start();
                setIsRecognitionActive(true);
                console.log('Recognition started');
            } catch (error) {
                console.error('Error starting recognition:', error);
            }
        }
    };

    useEffect(() => {
        // Only initialize once
        if (isInitialized.current) return;
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognition.current = new SpeechRecognition();
            recognition.current.continuous = true;
            recognition.current.lang = 'es-ES';
            recognition.current.interimResults = true;

            recognition.current.onstart = () => {
                console.log('Recognition started successfully');
                setIsRecognitionActive(true);
            };

            recognition.current.onresult = (event) => {
                const results = event.results;
                let finalTranscript = '';
                let interimTranscript = '';
                
                for (let i = 0; i < results.length; i++) {
                    // Log each result as it comes in
                    const transcript = results[i][0].transcript;
                    if (results[i].isFinal) {
                        finalTranscript += transcript + ' ';
                        console.log('Final transcript:', transcript);
                    } else {
                        interimTranscript += transcript;
                        console.log('Interim transcript:', transcript);
                    }
                }

                // Log the complete transcript for this recognition event
                console.log('Current complete transcript:', finalTranscript || interimTranscript);

                currentTranscript.current = finalTranscript;
                
                // Dispatch custom event with the transcript
                window.dispatchEvent(new CustomEvent('speechTranscript', {
                    detail: { 
                        transcript: finalTranscript,
                        interim: interimTranscript 
                    }
                }));
            };

            recognition.current.onerror = (event) => {
                console.error('Error en el reconocimiento de voz:', event.error);
                setIsRecognitionActive(false);
                setTimeout(startRecognition, 1000);
            };

            recognition.current.onend = () => {
                console.log('Recognition ended');
                setIsRecognitionActive(false);
                setTimeout(startRecognition, 1000);
            };

            recognition.current.onspeechstart = () => {
                console.log('Speech detected');
            };

            recognition.current.onspeechend = () => {
                console.log('Speech ended');
            };

            recognition.current.onnomatch = () => {
                console.log('No speech was recognized');
            };

            recognition.current.onaudiostart = () => {
                console.log('Audio capturing started');
            };

            recognition.current.onaudioend = () => {
                console.log('Audio capturing ended');
            };

            recognition.current.onsoundstart = () => {
                console.log('Sound detected');
            };

            recognition.current.onsoundend = () => {
                console.log('Sound ended');
            };

            // Start initial recognition after a short delay
            setTimeout(startRecognition, 1000);
            isInitialized.current = true;
        }

        // Cleanup function
        return () => {
            if (processingTimeout.current) {
                clearTimeout(processingTimeout.current);
            }
            if (recognition.current) {
                recognition.current.abort();
            }
        };
    }, []);

    return (
        <SpeechRecognitionContext.Provider value={{ isRecognitionActive }}>
            {children}
        </SpeechRecognitionContext.Provider>
    );
};

export const useSpeechRecognition = () => {
    const context = useContext(SpeechRecognitionContext);
    if (!context) {
        throw new Error('useSpeechRecognition must be used within a SpeechRecognitionProvider');
    }
    return context;
};