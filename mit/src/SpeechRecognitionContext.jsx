import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const SpeechRecognitionContext = createContext(null);

// Base Provider without navigation
const BaseSpeechRecognitionProvider = ({ children, onLupitaDetected }) => {
    const [isRecognitionActive, setIsRecognitionActive] = useState(false);
    const recognition = useRef(null);
    const currentTranscript = useRef('');
    const interimTranscript = useRef('');  // Store interim transcript
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

    const resetInterimTranscript = () => {
        interimTranscript.current = ''; // Clear interim transcript
        window.dispatchEvent(new CustomEvent('speechTranscript', {
            detail: { 
                transcript: currentTranscript.current,
                interim: interimTranscript.current
            }
        }));
    };

    useEffect(() => {
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

                for (let i = 0; i < results.length; i++) {
                    const transcript = results[i][0].transcript;
                    if (results[i].isFinal) {
                        finalTranscript += transcript + ' ';
                        console.log('Final transcript:', transcript);

                        // Check for "hola lupita" and notify parent
                        if (transcript.toLowerCase().includes('hola lupita')) {
                            onLupitaDetected(transcript);
                        }
                    } else {
                        interimTranscript.current += transcript;
                    }
                }

                currentTranscript.current = finalTranscript;

                window.dispatchEvent(new CustomEvent('speechTranscript', {
                    detail: { 
                        transcript: finalTranscript,
                        interim: interimTranscript.current
                    }
                }));

                // Reset interim transcript if silence is detected for 2 seconds
                clearTimeout(processingTimeout.current);
                processingTimeout.current = setTimeout(resetInterimTranscript, 2000);
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

            setTimeout(startRecognition, 1000);
            isInitialized.current = true;
        }

        return () => {
            if (processingTimeout.current) {
                clearTimeout(processingTimeout.current);
            }
            if (recognition.current) {
                recognition.current.abort();
            }
        };
    }, [onLupitaDetected]);

    return (
        <SpeechRecognitionContext.Provider value={{ isRecognitionActive }}>
            {children}
        </SpeechRecognitionContext.Provider>
    );
};

// Wrapper component with navigation
import { useNavigate, useLocation } from 'react-router-dom';

export const SpeechRecognitionProvider = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentLocation = useRef(location.pathname);

    // Update the ref whenever location changes
    useEffect(() => {
        currentLocation.current = location.pathname;
    }, [location.pathname]);

    const handleLupitaDetection = (transcript) => {
        console.log('Lupita detected! Current path:', currentLocation.current);
        if (currentLocation.current !== '/') {
            console.log('Not in root, navigating...');
            navigate('/', { replace: true });
        } else {
            // If already on root and "hola lupita" is detected, clear interim transcript
            resetInterimTranscript();
        }
    };

    const resetInterimTranscript = () => {
        // Function to clear interim transcript from the BaseSpeechRecognitionProvider
        if (BaseSpeechRecognitionProvider.current) {
            BaseSpeechRecognitionProvider.current.resetInterimTranscript();
        }
    };

    return (
        <BaseSpeechRecognitionProvider onLupitaDetected={handleLupitaDetection}>
            {children}
        </BaseSpeechRecognitionProvider>
    );
};

export const useSpeechRecognition = () => {
    const context = useContext(SpeechRecognitionContext);
    if (!context) {
        throw new Error('useSpeechRecognition must be used within a SpeechRecognitionProvider');
    }
    return context;
};
