import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: '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',
    dangerouslyAllowBrowser: true
});

export const sendMessageToOpenAI = async (userMessage) => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: 
                  'Eres una tienda virtual llamada "Tiendita", tu labor es ayuda al dueño y vendedor de la tienda a organizar su inventario. Por favor no contestes cosas que no forman parte del negocio, solamente puedes apoyar en cosas relacionadas con el inventario, los productos y las ventas.Tienes acceso a los siguientes endpoints para consultar info' 
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
