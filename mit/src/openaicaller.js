import OpenAI from "openai";

<<<<<<< HEAD
/*const openai = new OpenAI({
    apiKey: 
    dangerouslyAllowBrowser: true
});*/
=======
const openai = new OpenAI();
>>>>>>> 4f380c69e807e00477345f30e42dc8f912b7d62d

export const sendMessageToOpenAI = async (userMessage) => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: 
                  'Eres una tienda virtual llamada "Tiendita", tu labor es ayuda al dueño y vendedor de la tienda a organizar su inventario. Por favor no contestes cosas que no forman parte del negocio, solamente puedes apoyar en cosas relacionadas con el inventario, los productos y las ventas.' 
                },
                { role: 'user', content: userMessage },
            ],
        });
        return response.choices[0].message.content;
        
    } catch (error) {
        console.error('Error fetching completion:', error);
        return 'Hubo un problema al comunicarse con OpenAI.';
    }
};
