import OpenAI from "openai";

// Create a single OpenAI instance
const openai = new OpenAI({
    apiKey: '',
    dangerouslyAllowBrowser: true
});

class DataProcessor {
    constructor(apiBaseUrl) {
        this.apiBaseUrl = apiBaseUrl;
    }

    async parseDataWithAI(extractedData) {
        try {
            console.log('Sending data to OpenAI for parsing:', extractedData);

            const prompt = `
                You are a data parsing assistant. Analyze the following extracted data and format it as a JSON object with a 'data' array.
                The data should match one of these formats:

                you should use ventas template when receiving data looks like this 
                [
                    {
                      "1": "platanos",
                      "2": "3"
                    },
                    {
                      "1": "manzanas",
                      "2": "6"
                    }
                  ]

                use productos or others when not

                1. For productos:
                {
                    "data": [
                        {
                            "nombre_producto": "product name",
                            "precio": numeric_price,              this should be between ''
                            "unidad": "unidad_nombre",    
                            "proveedor_nombre": "provider"
                        }
                    ]
                }

                2. For ventas:
                {
                    "data": [
                        {
                            "nombre_producto": "product_id",
                            "cantidad": numeric_quantity,
                        }
                    ]
                }

                3. For proveedores:
                {
                    "data": [
                        {
                            "nombre": "provider_name",
                            "periodo": "periodo",
                            "telefono": "phone",
                            "email": "email",
                            "categoria": "category"
                        }
                    ]
                }


                you should use ventas template when receiving data looks like this 
                [
                    {
                      "1": "platanos",
                      "2": "3"
                    },
                    {
                      "1": "manzanas",
                      "2": "6"
                    }
                  ]

                use productos or others when not

                
                Analyze this data and return it in the appropriate format:
                ${JSON.stringify(extractedData, null, 2)}

                Return ONLY the JSON object, no additional text or explanations.
            `;

            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a data parsing assistant. Return only valid JSON data in the specified format."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.1 // Low temperature for more consistent formatting
            });

            const responseText = completion.choices[0].message.content.trim();
            console.log('Raw AI response:', responseText);

            try {
                // Try to parse the complete response
                const parsedData = JSON.parse(responseText);
                console.log('Successfully parsed AI response:', parsedData);
                return parsedData;
            } catch (parseError) {
                console.error('Initial parse failed, trying to extract JSON:', parseError);
                // Try to extract JSON from the response if there's additional text
                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const extractedJson = JSON.parse(jsonMatch[0]);
                    console.log('Successfully extracted and parsed JSON:', extractedJson);
                    return extractedJson;
                }
                throw new Error('Could not parse AI response as JSON');
            }

        } catch (error) {
            console.error('Error parsing data with AI:', error);
            throw error;
        }
    }

    async postData(extractedData) {
        try {
            console.log('Starting data processing with:', extractedData);
            
            if (!extractedData || (Array.isArray(extractedData) && extractedData.length === 0)) {
                throw new Error('No data to process');
            }

            // Use AI to parse and format the data
            const parsedData = await this.parseDataWithAI(extractedData);
            
            if (!parsedData || !parsedData.data || !Array.isArray(parsedData.data) || parsedData.data.length === 0) {
                throw new Error('AI did not return data in the expected format');
            }

            // Determine which endpoint to use based on the data structure
            const firstItem = parsedData.data[0];
            let endpoint = 'productos'; // default

            if (firstItem.nombre_producto&& firstItem.cantidad) {
                endpoint = 'ventas';
            } else if (firstItem.contacto && firstItem.telefono) {
                endpoint = 'proveedores';
            }

            console.log(`Posting to ${endpoint}:`, parsedData.data);

            // Post each item
            const responses = await Promise.all(
                parsedData.data.map(async (item) => {
                    const response = await fetch(`${this.apiBaseUrl}/${endpoint}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(item),
                    });

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                        throw new Error(`Failed to post data: ${errorData.message || response.statusText}`);
                    }

                    return await response.json();
                })
            );

            return {
                success: true,
                table: endpoint,
                results: responses
            };

        } catch (error) {
            console.error('Error posting data:', error);
            throw error;
        }
    }
}

export default DataProcessor;