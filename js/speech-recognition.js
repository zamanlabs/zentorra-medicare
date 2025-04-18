// Speech Recognition Module for Zentorra Medicare Chatbot
const SpeechRecognitionHandler = (function() {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const supported = !!SpeechRecognition;

    let recognition = null;
    let isListening = false;
    let finalTranscript = '';
    let interimTranscript = '';
    let timeoutId = null;
    let audioContext = null;
    let analyser = null;
    let dataArray = null;
    let animationFrameId = null;

    const visualizer = document.getElementById('speech-visualizer');
    const visualizerSpans = visualizer ? visualizer.querySelectorAll('span') : [];
    const statusElement = document.getElementById('speech-status');
    const micButton = document.getElementById('mic-button');

    function initializeRecognition(onResult, onEnd, onError) {
        if (!supported) return;
        
        recognition = new SpeechRecognition();
        recognition.continuous = true; // Keep listening even after pauses
        recognition.interimResults = true; // Get results while speaking
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            isListening = true;
            finalTranscript = '';
            interimTranscript = '';
            micButton.classList.add('active');
            visualizer.classList.add('active');
            visualizer.style.opacity = '1';
            statusElement.style.opacity = '1';
            startVisualization();
            console.log('Speech recognition started.');
        };

        recognition.onresult = (event) => {
            clearTimeout(timeoutId);
            interimTranscript = '';
            let currentFinalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    currentFinalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            finalTranscript += currentFinalTranscript;
            onResult(finalTranscript, interimTranscript);
            
            // Set a timeout to stop listening after a period of silence
            timeoutId = setTimeout(() => {
                if (isListening) {
                    stopListening();
                }
            }, 2000); // Stop after 2 seconds of silence
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            onError(event.error);
            stopListening();
        };

        recognition.onend = () => {
            if (isListening) { // Check if stop was intentional or unexpected
                console.log('Speech recognition ended unexpectedly. Restarting...');
                // Optionally restart listening here if needed, but be mindful of infinite loops
                // For now, we just ensure state is cleaned up
                stopListeningInternal();
            }
            onEnd(finalTranscript);
        };
    }

    function startListening(onResult, onEnd, onError) {
        if (!supported) {
            alert("Your browser doesn't support speech recognition.");
            return;
        }
        if (isListening) return;
        
        initializeRecognition(onResult, onEnd, onError);
        try {
            recognition.start();
        } catch (e) {
            console.error("Error starting recognition:", e);
            onError("Could not start microphone. Please check permissions.");
            stopListeningInternal(); // Ensure cleanup if start fails
        }
    }
    
    function stopListeningInternal() {
        isListening = false;
        if (recognition) {
            recognition.onstart = null;
            recognition.onresult = null;
            recognition.onerror = null;
            recognition.onend = null;
            recognition = null;
        }
        micButton.classList.remove('active');
        visualizer.style.opacity = '0';
        statusElement.style.opacity = '0';
        visualizer.classList.remove('active');
        stopVisualization();
        clearTimeout(timeoutId);
        console.log('Speech recognition stopped.');
    }

    function stopListening() {
        if (!isListening || !recognition) return;
        recognition.stop(); 
        stopListeningInternal();
    }

    function setupAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 32;
            const bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);

            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    const source = audioContext.createMediaStreamSource(stream);
                    source.connect(analyser);
                })
                .catch(err => {
                    console.error('Error accessing microphone for visualization:', err);
                    // Optionally provide feedback to the user
                });
        }
    }

    function startVisualization() {
        if (!visualizer || visualizerSpans.length === 0 || !supported) return;
        setupAudioContext();
        if (!analyser) return; // Don't visualize if mic access failed

        const draw = () => {
            animationFrameId = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);
            
            const barHeightScale = 15; // Max height for bars
            
            visualizerSpans.forEach((span, i) => {
                // Use a subset of frequency data for visualization
                const dataIndex = Math.floor((i / visualizerSpans.length) * dataArray.length);
                const barHeight = Math.max(1, (dataArray[dataIndex] / 255) * barHeightScale);
                span.style.height = `${barHeight}px`;
            });
        };
        draw();
    }

    function stopVisualization() {
        cancelAnimationFrame(animationFrameId);
        visualizerSpans.forEach(span => {
            span.style.height = '2px'; // Reset to base height
        });
    }

    // Public methods
    return {
        isSupported: () => supported,
        start: startListening,
        stop: stopListening,
        isListening: () => isListening
    };
})();

// Export the module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpeechRecognitionHandler;
} 