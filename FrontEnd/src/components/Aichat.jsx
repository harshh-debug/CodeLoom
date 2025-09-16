import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send, Square } from 'lucide-react';

function ChatAi({problem}) {
    const [messages, setMessages] = useState([
        { role: 'model', parts:[{text: "Hi, How are you?"}]},
        { role: 'user', parts:[{text: "I am Good"}]}
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentStreamingMessage, setCurrentStreamingMessage] = useState('');
    const [abortController, setAbortController] = useState(null);

    const { register, handleSubmit, reset, formState: {errors} } = useForm();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, currentStreamingMessage]);

    const stopStreaming = () => {
        if (abortController) {
            abortController.abort();
            setAbortController(null);
            setIsLoading(false);
            setCurrentStreamingMessage('');
        }
    };

    // Function to get headers from axiosClient
    const getAuthHeaders = () => {
        const headers = {
            'Content-Type': 'application/json',
        };

        // Get authorization header from axiosClient
        if (axiosClient.defaults.headers.common['Authorization']) {
            headers['Authorization'] = axiosClient.defaults.headers.common['Authorization'];
        }

        // Alternative: if token is stored differently in your axiosClient setup
        if (axiosClient.defaults.headers.common['x-auth-token']) {
            headers['x-auth-token'] = axiosClient.defaults.headers.common['x-auth-token'];
        }

        // If you have other custom headers
        Object.keys(axiosClient.defaults.headers.common || {}).forEach(key => {
            if (key !== 'Accept') { // Skip Accept header to avoid conflicts
                headers[key] = axiosClient.defaults.headers.common[key];
            }
        });

        return headers;
    };

    const onSubmit = async (data) => {
        const userMessage = { role: 'user', parts:[{text: data.message}] };
        const updatedMessages = [...messages, userMessage];
        
        setMessages(updatedMessages);
        setIsLoading(true);
        setCurrentStreamingMessage('');
        reset();

        // Create abort controller for this request
        const controller = new AbortController();
        setAbortController(controller);

        try {
            // Build the full URL
            const baseURL = axiosClient.defaults.baseURL || '';
            const url = `${baseURL}/ai/chat`;

            const response = await fetch(url, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    messages: updatedMessages,
                    title: problem.title,
                    description: problem.description,
                    testCases: problem.visibleTestCases,
                    startCode: problem.startCode
                }),
                signal: controller.signal
            });

            if (!response.ok) {
                // Handle specific error cases
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please log in again.');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedResponse = '';

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    
                    if (done) break;
                    
                    const chunk = decoder.decode(value, { stream: true });
                    accumulatedResponse += chunk;
                    setCurrentStreamingMessage(accumulatedResponse);
                }

                // Add the complete response to messages
                setMessages(prev => [...prev, { 
                    role: 'model', 
                    parts:[{text: accumulatedResponse}] 
                }]);
                
            } catch (readError) {
                if (readError.name !== 'AbortError') {
                    console.error("Stream reading error:", readError);
                    throw readError;
                }
            } finally {
                reader.releaseLock();
            }

        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Request was aborted');
                return;
            }
            
            console.error("API Error:", error);
            
            let errorMessage = "Error from AI Chatbot. Please try again.";
            if (error.message.includes('Authentication failed')) {
                errorMessage = "Authentication failed. Please log in again.";
            }
            
            setMessages(prev => [...prev, { 
                role: 'model', 
                parts:[{text: errorMessage}]
            }]);
        } finally {
            setIsLoading(false);
            setCurrentStreamingMessage('');
            setAbortController(null);
        }
    };

    return (
        <div className="flex flex-col h-screen max-h-[80vh] min-h-[500px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
                    >
                        <div className={`chat-bubble ${
                            msg.role === "user" 
                                ? "bg-primary text-primary-content" 
                                : "bg-base-200 text-base-content"
                        }`}>
                            <div className="whitespace-pre-wrap">
                                {msg.parts[0].text}
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* Show streaming message */}
                {isLoading && currentStreamingMessage && (
                    <div className="chat chat-start">
                        <div className="chat-bubble bg-base-200 text-base-content">
                            <div className="whitespace-pre-wrap">
                                {currentStreamingMessage}
                                <span className="animate-pulse">▌</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Show loading indicator */}
                {isLoading && !currentStreamingMessage && (
                    <div className="chat chat-start">
                        <div className="chat-bubble bg-base-200 text-base-content">
                            <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                <span>AI is thinking...</span>
                            </div>
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>
            
            <form 
                onSubmit={handleSubmit(onSubmit)} 
                className="sticky bottom-0 p-4 bg-base-100 border-t"
            >
                <div className="flex items-center">
                    <input 
                        placeholder="Ask me anything about this DSA problem..." 
                        className="input input-bordered flex-1" 
                        {...register("message", { 
                            required: "Message is required", 
                            minLength: { value: 2, message: "Message must be at least 2 characters" }
                        })}
                        disabled={isLoading}
                    />
                    
                    {isLoading ? (
                        <button 
                            type="button" 
                            className="btn btn-error ml-2"
                            onClick={stopStreaming}
                        >
                            <Square size={20} />
                        </button>
                    ) : (
                        <button 
                            type="submit" 
                            className="btn btn-primary ml-2"
                            disabled={!!errors.message}
                        >
                            <Send size={20} />
                        </button>
                    )}
                </div>
                {errors.message && (
                    <p className="text-error text-sm mt-1">{errors.message.message}</p>
                )}
            </form>
        </div>
    );
}

export default ChatAi;