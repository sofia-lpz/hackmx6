import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { sendMessageToOpenAI } from './openaicaller';
import OpenAI from "openai";
import { useSpeechRecognition } from './SpeechRecognitionContext';
import { matchQueryToEndpoint, executeQuery } from './dbQueryMatcher';

const openai = new OpenAI({
    apiKey: '',
    dangerouslyAllowBrowser: true
});

const VoiceChat = () => {
    // States
    const [currentMessage, setCurrentMessage] = useState('Hola, soy Lupita, tu asistente virtual');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isWaitingForInventory, setIsWaitingForInventory] = useState(false);
    const [collectedItems, setCollectedItems] = useState([]);
    
    // Refs
    const processingTimeout = useRef(null);
    const isFirstRender = useRef(true);
    const isPlaying = useRef(false);
    
    // Hooks
    const { isRecognitionActive } = useSpeechRecognition();
    const navigate = useNavigate();
    const location = useLocation();

    const speakText = async (text) => {
        if (isPlaying.current) {
            console.log('Already playing audio, skipping...');
            return;
        }

        isPlaying.current = true;
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

    const handleMessage = async (message) => {
        try {
            const result = await matchQueryToEndpoint(message);
            
            if (result.type === 'navigation') {
                // Handle navigation
                await speakText(result.navigationMessage);
                navigate(result.endpoint);
                return true;
            } else if (result.type === 'query') {
                // Handle API query
                const data = await executeQuery(result.endpoint, result.params);
                const response = `${result.explanation}: ${formatResponse(data)}`;
                await speakText(response);
                setCurrentMessage(response);
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Error handling message:', error);
            await speakText('Lo siento, hubo un error procesando tu solicitud.');
            return false;
        }
    };
    const handleDatabaseQuery = async (message) => {
        try {
            const queryMatch = await matchQueryToEndpoint(message);
            console.log('Query match:', queryMatch);

            if (queryMatch?.endpoint) {
                await speakText('Consultando la información...');
                const data = await executeQuery(queryMatch.endpoint, queryMatch.params);
                
                let formattedResponse = queryMatch.explanation + ': ';
                
                if (Array.isArray(data)) {
                    if (data.length === 0) {
                        formattedResponse += "No encontré ningún resultado.";
                    } else if (data.length === 1) {
                        formattedResponse += typeof data[0] === 'object' 
                            ? Object.values(data[0]).join(', ')
                            : data[0].toString();
                    } else {
                        formattedResponse += data.map(item => {
                            if (typeof item === 'object') {
                                return Object.values(item).join(', ');
                            }
                            return item.toString();
                        }).join('; ');
                    }
                } else if (typeof data === 'object' && data !== null) {
                    formattedResponse += Object.entries(data)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(', ');
                } else {
                    formattedResponse += data.toString();
                }

                setCurrentMessage(formattedResponse);
                await speakText(formattedResponse);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error in database query:', error);
            await speakText('Lo siento, hubo un error al consultar la información.');
            return true;
        }
    };

    const parseInventoryItems = async (text) => {
        try {
            const prompt = `
                Analiza el siguiente texto en español y conviértelo en un array de objetos JSON de productos.
                Texto: "${text}"
                
                Reglas:
                1. Cada producto debe tener las siguientes propiedades:
                   - nombre_producto (string)
                   - cantidad (number)
                   - unidad (string: "kg", "g", "l", "ml", "pza")
                   - precio (number)
                   - proveedor_id (number)
                
                2. Convierte unidades habladas a abreviaciones:
                   - "kilos" o "kilogramos" → "kg"
                   - "gramos" → "g"
                   - "litros" → "l"
                   - "mililitros" → "ml"
                   - "piezas" o "unidades" → "pza"
                
                3. Formato de salida:
                [
                    {
                        "nombre_producto": "Naranja",
                        "cantidad": 5,
                        "unidad": "kg",
                        "precio": 0.4,
                        "proveedor_id": 2
                    }
                ]
                
                Solo devuelve el array JSON, sin texto adicional.
            `;

            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "Eres un asistente que solo devuelve arrays JSON válidos." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.3
            });

            const response = completion.choices[0].message.content.trim();
            console.log('AI Response:', response);

            const jsonMatch = response.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                const parsedItems = JSON.parse(jsonMatch[0]);
                console.log('Parsed items:', parsedItems);
                return parsedItems;
            }
            throw new Error('No valid JSON found in response');

        } catch (error) {
            console.error('Error parsing inventory items:', error);
            return null;
        }
    };

    const processInventoryInput = async (text) => {
        const parsedItems = await parseInventoryItems(text);
        if (parsedItems && Array.isArray(parsedItems)) {
            setCollectedItems(prev => [...prev, ...parsedItems]);
            
            const itemCount = parsedItems.length;
            const confirmMessage = `He agregado ${itemCount} ${itemCount === 1 ? 'producto' : 'productos'}. 
                Actualmente tienes ${collectedItems.length + itemCount} productos en total. 
                ¿Quieres agregar más productos o confirmar el inventario?`;
            
            await speakText(confirmMessage);
        } else {
            await speakText('No pude entender los productos. Por favor, intenta de nuevo con el formato: nombre, cantidad, unidad, precio y proveedor.');
        }
    };

    const confirmInventory = async () => {
        if (collectedItems.length > 0) {
            await speakText('Confirmando inventario y enviando a revisión.');
            navigate('/lista-confirmada', { 
                state: { items: collectedItems }
            });
        } else {
            await speakText('No hay productos para confirmar. Por favor, agrega algunos productos primero.');
        }
    };

    const processMessage = async (transcript) => {
        if (!isProcessing && (transcript.toLowerCase().includes('hola lupita') || isWaitingForInventory)) {
            setIsProcessing(true);
            console.log('Processing message:', transcript);
            
            try {
                const message = isWaitingForInventory ? 
                    transcript : 
                    transcript.toLowerCase().split('hola lupita')[1].trim();

                if (message) {
                    if (isWaitingForInventory) {
                        if (message.toLowerCase().includes('confirmar')) {
                            await confirmInventory();
                            setIsWaitingForInventory(false);
                        } else if (message.toLowerCase().includes('cancelar')) {
                            setIsWaitingForInventory(false);
                            setCollectedItems([]);
                            await speakText('He cancelado el registro de inventario. ¿Qué más puedo hacer por ti?');
                        } else {
                            await processInventoryInput(message);
                        }
                    } else {
                        try {
                            // Get the query match and check its type
                            const queryMatch = await matchQueryToEndpoint(message);
                            console.log('Query match result:', queryMatch);

                            if (queryMatch.type === 'navigation') {
                                // Handle navigation
                                console.log('Navigating to:', queryMatch.endpoint);
                                await speakText(queryMatch.navigationMessage || 'Navegando...');
                                navigate(queryMatch.endpoint);
                            } 
                            else if (queryMatch.type === 'query') {
                                // Handle database query
                                console.log('Executing query:', queryMatch.endpoint);
                                await speakText('Consultando la información...');
                                
                                const data = await executeQuery(queryMatch.endpoint, queryMatch.params);
                                console.log('Query response:', data);
                                
                                // Format the response
                                let formattedResponse = queryMatch.explanation + ': ';
                                
                                if (Array.isArray(data)) {
                                    if (data.length === 0) {
                                        formattedResponse += "No encontré ningún resultado.";
                                    } else if (data.length === 1) {
                                        formattedResponse += typeof data[0] === 'object' 
                                            ? Object.values(data[0]).join(', ')
                                            : data[0].toString();
                                    } else {
                                        formattedResponse += data.map(item => {
                                            if (typeof item === 'object' && item !== null) {
                                                return Object.values(item)
                                                    .filter(val => val != null)
                                                    .join(', ');
                                            }
                                            return item?.toString() || '';
                                        }).filter(str => str.length > 0).join('; ');
                                    }
                                } else if (typeof data === 'object' && data !== null) {
                                    formattedResponse += Object.entries(data)
                                        .filter(([_, value]) => value != null)
                                        .map(([key, value]) => `${key}: ${value}`)
                                        .join(', ');
                                } else {
                                    formattedResponse += data?.toString() || 'No hay datos disponibles';
                                }

                                setCurrentMessage(formattedResponse);
                                await speakText(formattedResponse);
                            } 
                            else {
                                // Handle general conversation if no specific type matched
                                console.log('Handling as general conversation');
                                const aiReply = await sendMessageToOpenAI(message);
                                setCurrentMessage(aiReply);
                                await speakText(aiReply);
                            }
                        } catch (error) {
                            console.error('Error processing query:', error);
                            await speakText('Lo siento, hubo un error procesando tu solicitud. ¿Podrías intentarlo de nuevo?');
                        }
                    }
                }
            } catch (error) {
                console.error('Error in message processing:', error);
                await speakText('Lo siento, hubo un error. ¿Podrías repetirlo?');
            }
            setIsProcessing(false);
        }
    };

    useEffect(() => {
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
        
        if (isFirstRender.current && location.pathname === '/') {
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
    }, [location.pathname]);

    if (location.pathname !== '/') return null;

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
                {isWaitingForInventory && (
                    <div className="text-green-400 text-sm mt-2">
                        Modo inventario activo - {collectedItems.length} productos registrados
                    </div>
                )}
                <div className="text-gray-400 text-xs mt-2">
                    {isRecognitionActive ? 'Escuchando...' : 'Reconexión en progreso...'}
                </div>
                {isWaitingForInventory && (
                    <div className="text-gray-400 text-xs mt-4">
                        Di "confirmar" para guardar o "cancelar" para descartar
                    </div>
                )}
            </div>
        </div>
    );
};

export default VoiceChat;