// Zentorra Medicare Medical Chatbot Module
const MedicalChatbot = (function() {
    // Emergency keyword detection
    const emergencyKeywords = [
        "stroke", "heart attack", "cardiac arrest", "severe bleeding", "unconscious", 
        "not breathing", "difficulty breathing", "choking", "drowning", "severe burn", 
        "poisoning", "overdose", "seizure", "anaphylaxis", "allergic reaction",
        "suicide", "chest pain", "severe pain", "cannot move", "paralysis", "emergency",
        "dying", "life threatening", "911", "ambulance"
    ];
    
    // Medical topics and categories
    const medicalTopics = [
        // Symptoms
        "headache", "pain", "fever", "cough", "nausea", "vomiting", "diarrhea", "rash",
        "dizzy", "dizziness", "tired", "fatigue", "swelling", "shortness of breath",
        "blood pressure", "heart rate", "pulse", "temperature", "weight", "height", "bmi",
        
        // Medical conditions
        "diabetes", "hypertension", "asthma", "arthritis", "cancer", "cold", "flu", 
        "covid", "infection", "allergy", "disease", "condition", "disorder", "syndrome",
        
        // Body parts
        "head", "chest", "stomach", "back", "leg", "arm", "foot", "hand", "eye", "ear",
        "nose", "throat", "skin", "heart", "lung", "liver", "kidney", "bone", "joint",
        "muscle", "blood", "brain", "nerve",
        
        // Medical procedures
        "surgery", "operation", "procedure", "test", "scan", "x-ray", "mri", "ct scan",
        "ultrasound", "biopsy", "vaccine", "vaccination", "immunization", "shot",
        
        // Medications and treatments
        "medicine", "medication", "drug", "pill", "tablet", "capsule", "injection",
        "antibiotic", "painkiller", "pain reliever", "vitamin", "supplement", "therapy",
        "treatment", "prescription", "dose", "dosage",
        
        // Healthcare providers and settings
        "doctor", "physician", "nurse", "specialist", "hospital", "clinic", "emergency room",
        "pharmacy", "medical", "healthcare", "health", "appointment",
        
        // General medical terms
        "symptom", "diagnosis", "prognosis", "chronic", "acute", "prevention", "risk factor",
        "side effect", "contraindication", "recovery"
    ];

    // Prompt enhancement system
    function enhancePrompt(userMessage) {
        // Automatically add context if the message is too short
        if (userMessage.split(" ").length < 5) {
            return `I'm experiencing the following medical issue: ${userMessage}. Can you provide some information about it?`;
        }
        
        // If message doesn't end with question mark but seems like a question, format it better
        if (!userMessage.endsWith("?") && 
            (userMessage.toLowerCase().startsWith("what") || 
             userMessage.toLowerCase().startsWith("how") || 
             userMessage.toLowerCase().startsWith("why") || 
             userMessage.toLowerCase().startsWith("can") || 
             userMessage.toLowerCase().startsWith("is") || 
             userMessage.toLowerCase().startsWith("are") ||
             userMessage.toLowerCase().startsWith("should"))) {
            return `${userMessage}?`;
        }
        
        return userMessage;
    }

    // Check if a message contains emergency keywords
    function detectEmergency(message) {
        const messageLower = message.toLowerCase();
        return emergencyKeywords.some(keyword => messageLower.includes(keyword));
    }

    // Check if a message is related to medical topics
    function isMedicalQuery(message) {
        const messageLower = message.toLowerCase();
        return medicalTopics.some(topic => messageLower.includes(topic)) || 
               messageLower.includes("health") ||
               messageLower.includes("medical") ||
               messageLower.includes("sick") ||
               messageLower.includes("hurt");
    }

    // Get the medical context for the AI
    function getMedicalSystemContext() {
        return `
            You are a medical assistant AI for Zentorra Medicare. You provide helpful medical information but always remind users that you are not a substitute for professional medical advice. Be concise but thorough. Only answer medical/health-related questions. If the question is not related to medical topics, politely state that you only handle medical questions. If the user appears to be experiencing a medical emergency, advise them to call 911 or emergency services immediately. Never provide specific dosage recommendations or suggest off-label uses of medications. Always encourage users to consult healthcare professionals for personalized advice. Your responses should be factual, evidence-based, and avoid exaggeration.
        `;
    }

    // Public methods
    return {
        // Process a user message
        async processMessage(userMessage) {
            // Detect emergency conditions
            const isEmergency = detectEmergency(userMessage);
            
            // Check if query is medical in nature
            const isMedical = isMedicalQuery(userMessage);
            
            // Enhance prompt for better responses
            const enhancedPrompt = enhancePrompt(userMessage);
            
            let response;
            
            if (!isMedical) {
                response = "I'm a medical assistant designed to help with health-related questions only. Could you please ask me something about health or medical conditions?";
            } else {
                // If it's a medical query, send to Gemini API
                try {
                    response = await GeminiAPI.generateResponse(enhancedPrompt, getMedicalSystemContext());
                } catch (error) {
                    console.error("Error using Gemini API:", error);
                    response = "I'm sorry, I'm unable to process your medical question at the moment. Please try again later.";
                }
            }
            
            // Return the result with emergency status
            return {
                response: response,
                isEmergency: isEmergency
            };
        },
        
        // Check if a message contains emergency indicators
        checkEmergency(message) {
            return detectEmergency(message);
        }
    };
})();

// Export the module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MedicalChatbot;
} 