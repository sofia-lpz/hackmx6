import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendMessageToOpenAI } from './openaicaller';

function Mensajes() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([{ text: '¿Qué producto deseas agregar?', sender: 'ai' }]);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    const handleSend = async () => {
        if (input.trim()) {
            const userMessage = { text: input, sender: 'user' };
            setMessages((prevMessages) => [...prevMessages, userMessage]);

            const aiReply = await sendMessageToOpenAI(input);
            const aiMessage = { text: aiReply, sender: 'ai' };
            setMessages((prevMessages) => [...prevMessages, aiMessage]);

            setProducts((prevProducts) => [
                ...prevProducts,
                { name: input },
            ]);

            setInput('');
        }
    };

    const handleFinish = () => {
        navigate('/product-list', { state: { products } });
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-900 p-4">
            <h1 className="text-2xl font-bold text-white mb-4">Chat with AI</h1>
            <div className="border p-4 w-full sm:w-80 h-96 overflow-y-auto mb-4 flex flex-col">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-2 rounded-lg mb-2 max-w-[75%] ${
                            msg.sender === 'user'
                                ? 'bg-blue-500 text-white self-end'
                                : 'bg-green-500 text-white self-start'
                        }`}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Incluye los productos que quieres agregar.."
                className="border p-2 w-full mb-2"
            />
            <div className="flex gap-2">
                <button
                    onClick={handleSend}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
                >
                    Enviar
                </button>
                <button
                    onClick={handleFinish}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
                >
                    Finished
                </button>
            </div>
        </div>
    );
}

export default Mensajes;
