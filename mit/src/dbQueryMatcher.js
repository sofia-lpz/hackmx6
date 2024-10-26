import OpenAI from "openai";

const API_BASE_URL = 'http://localhost:8080/api';
const openai = new OpenAI({
    apiKey: '',
    dangerouslyAllowBrowser: true
});

const NAVIGATION_PATTERNS = [
    {
        keywords: ['foto', 'imagen', 'camara', 'capturar', 'escanear'],
        route: '/data-extraction',
        message: 'Te llevaré a la captura por foto'
    },
    {
        keywords: ['chat', 'mensaje', 'escribir', 'texto'],
        route: '/mensajes',
        message: 'Te llevaré al chat para agregar productos'
    },
    {
        keywords: ['proveedor', 'distribuidor', 'vendedor'],
        route: '/proveedores',
        message: 'Te llevaré a la gestión de proveedores'
    },
    {
        keywords: ['venta', 'cobrar', 'vender', 'facturar'],
        route: '/ListaVentaMobile',
        message: 'Te llevaré al registro de ventas'
    },
    {
        keywords: ['confirmar', 'revisar lista', 'verificar productos'],
        route: '/lista-confirmada',
        message: 'Te llevaré a confirmar la lista'
    },

    {
        keywords: ['listar','enseñar', 'productos' ],
        route: '/lista-productos',
        message: 'Te llevaré a confirmar la lista'
    }
];

// First prompt to check navigation intent
const checkNavigationPrompt = async (question) => {
    const navigationPrompt = `
        Analiza si la siguiente frase indica una intención de navegación o acción en la aplicación.
        
        Frase: "${question}"

        Posibles destinos de navegación:
        1. Captura por foto (/data-extraction): para escanear, fotografiar o capturar productos
        2. Chat (/mensajes): para escribir o mensajear productos
        3. Proveedores (/proveedores): para gestionar nuevos proveedores o distribuidores
        4. Ventas (/ListaVentaMobile): para registrar ventas o cobros cuando los clientes compran
        5. Confirmar lista (/lista-confirmada): para revisar o confirmar productos que serán ingresados en el stock
        6. listar todos mis productos y o modificarlos (/lista-productos)

        Si detectas intención de navegación, responde con un JSON:
        {
            "type": "navigation",
            "endpoint": "ruta correspondiente",
            "navigationMessage": "mensaje explicativo",
            "confidence": número del 0 al 1 indicando qué tan seguro estás
        }

        Si NO detectas intención de navegación, responde con:
        {
            "type": "query",
            "confidence": 0
        }

        SOLO RESPONDE CON JSON.
    `;

    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            { 
                role: "system", 
                content: "Eres un analizador de intención de navegación. SOLO respondes con JSON." 
            },
            { 
                role: "user", 
                content: navigationPrompt 
            }
        ],
        temperature: 0.3
    });

    const response = completion.choices[0].message.content.trim();
    const cleanResponse = response
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();

    const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('No se encontró un JSON válido en la respuesta de navegación');
    }

    return JSON.parse(jsonMatch[0]);
};

// Second prompt for API queries
const checkQueryPrompt = async (question) => {
    const queryPrompt = `
        Analiza la siguiente pregunta para determinar qué información de la API necesita.
        
        Pregunta: "${question}"

        ENDPOINTS disponibles:
        Ventas:
        - /productos_ventas_mas_bajas: Producto con menos ventas
        - /productos_ventas_mas_altas: Producto con más ventas
        - /productos_dias_de_la_semana_mas_ventas: Día con más ventas
        
        Stock:
        - /productos_stock_proximo_a_acabarse: Productos con stock < 5
        - /productos_stock_agotado: Productos con stock = 0
        - /productos_todavia_hay/:nombre: Verifica stock de producto
        - /productos_cuanto_queda/:nombre: Cantidad restante de producto
        
        Precios:
        - /productos_precio_mas_bajo: Producto más barato
        - /productos_precio_mas_alto: Producto más caro
        - /productos_precio_total_inventario: Valor total del inventario
        
        Proveedores:
        - /proveedores_mas_proximo/:fecha_actual: Próximo proveedor
        - /proveedores_sipaso/:nombre: Verificar visita de proveedor
        - /proveedores_productos/:nombre: Productos de proveedor
        - /proveedores_no_pasaron: Proveedores pendientes
        - /proveedores_este_mes: Proveedores del mes
        - /proveedores_esta_semana: Proveedores de la semana
        - /proveedores_este_dia: Proveedores de hoy

        Responde con un JSON:
        {
            "type": "query",
            "endpoint": "endpoint correspondiente",
            "params": {},
            "explanation": "explicación de la consulta"
        }
    `;

    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            { 
                role: "system", 
                content: "Eres un experto en APIs que convierte preguntas en llamadas de API. SOLO respondes con JSON." 
            },
            { 
                role: "user", 
                content: queryPrompt 
            }
        ],
        temperature: 0.3
    });

    const response = completion.choices[0].message.content.trim();
    const cleanResponse = response
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();

    const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('No se encontró un JSON válido en la respuesta de query');
    }

    return JSON.parse(jsonMatch[0]);
};

export const matchQueryToEndpoint = async (question) => {
    try {
        // First, check for basic navigation patterns
        const basicNavigation = checkBasicNavigation(question);
        if (basicNavigation) {
            console.log('Basic navigation pattern detected:', basicNavigation);
            return basicNavigation;
        }

        // Then, try the navigation prompt
        const navigationResult = await checkNavigationPrompt(question);
        console.log('Navigation check result:', navigationResult);

        // If navigation was detected with high confidence, return it
        if (navigationResult.type === 'navigation' && navigationResult.confidence > 0.7) {
            return navigationResult;
        }

        // If no navigation intent or low confidence, try query prompt
        const queryResult = await checkQueryPrompt(question);
        console.log('Query check result:', queryResult);
        return queryResult;

    } catch (error) {
        console.error('Error in matchQueryToEndpoint:', error);
        throw error;
    }
};

// Helper function for basic navigation pattern checking
const checkBasicNavigation = (question) => {
    const normalizedQuestion = question.toLowerCase();
    const actionWords = ['agregar', 'añadir', 'registrar', 'crear', 'nuevo', 'nueva', 'ir', 'ver', 'mostrar', 'enseñar', 'querer'];
    
    if (actionWords.some(word => normalizedQuestion.includes(word))) {
        for (const pattern of NAVIGATION_PATTERNS) {
            if (pattern.keywords.some(keyword => normalizedQuestion.includes(keyword))) {
                return {
                    type: 'navigation',
                    endpoint: pattern.route,
                    navigationMessage: pattern.message,
                    confidence: 1
                };
            }
        }
    }
    return null;
};

export const executeQuery = async (endpoint, params = {}) => {
    try {
        let url = `${API_BASE_URL}${endpoint}`;
        
        Object.entries(params).forEach(([key, value]) => {
            url = url.replace(`:${key}`, encodeURIComponent(value));
        });

        console.log('Executing query at:', url);
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Error en la consulta');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
};