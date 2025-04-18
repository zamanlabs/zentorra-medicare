// Gemini API Client for Zentorra Medicare
const GeminiAPI = (function() {
    // Gemini API configuration
    const API_KEY = "AIzaSyDjdKUFnKqzj88ncXot_JZBMhMykcQDMt8";
    const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    
    // Function to send messages to the Gemini API
    async function generateContent(prompt, systemContext) {
        // Safety check for empty/invalid inputs
        if (!prompt || typeof prompt !== 'string') {
            console.error("Invalid prompt provided to Gemini API:", prompt);
            return "I couldn't process that request. Please try again with a valid question.";
        }
        
        const payload = {
            contents: [{
                parts: [
                    { text: systemContext || "" },
                    { text: prompt }
                ]
            }],
            // Set safety settings to be appropriate for healthcare
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };

        try {
            console.log("Sending request to Gemini API...");
            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                let errorMessage = `API Error: ${response.status}`;
                try {
                    const errorData = await response.json();
                    console.error("API Error response:", errorData);
                    errorMessage += ` - ${errorData.error?.message || 'Unknown error'}`;
                } catch (parseError) {
                    console.error("Error parsing API error response:", parseError);
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log("Received response from Gemini API");
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            } else {
                console.error("Unexpected API response format:", data);
                // Check for specific error patterns
                if (data.promptFeedback && data.promptFeedback.blockReason) {
                    return `I'm unable to provide a response to that specific query due to content safety policies. Can you rephrase your question?`;
                }
                return "I apologize, but I'm having trouble processing your request right now. Could you try rephrasing your question?";
            }
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            // Check for network errors vs API errors
            if (error.message.includes("Failed to fetch") || error.name === "TypeError") {
                return "I'm having trouble connecting to my knowledge database. Please check your internet connection and try again.";
            }
            throw error;
        }
    }

    // Function to retry API call with backoff
    async function generateWithRetry(prompt, systemContext, maxRetries = 2) {
        let retries = 0;
        while (retries <= maxRetries) {
            try {
                return await generateContent(prompt, systemContext);
            } catch (error) {
                retries++;
                if (retries > maxRetries) {
                    throw error;
                }
                console.log(`Retrying API call (${retries}/${maxRetries})...`);
                // Exponential backoff
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries - 1)));
            }
        }
    }

    // Public methods
    return {
        generateResponse: async function(prompt, systemContext) {
            try {
                return await generateWithRetry(prompt, systemContext);
            } catch (error) {
                console.error("Error in generateResponse:", error);
                return "I'm sorry, I'm unable to connect to my medical database at the moment. Please try again later.";
            }
        }
    };
})();

// Export the module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeminiAPI;
} 