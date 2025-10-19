import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Square, Bot, User as UserIcon } from 'lucide-react';
import axiosClient from "../utils/axiosClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function ChatAi({ problem }) {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentStreamingMessage, setCurrentStreamingMessage] = useState('');
    const [abortController, setAbortController] = useState(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
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

    const onSubmit = async (data) => {
        const userMessage = { role: 'user', parts: [{ text: data.message }] };
        const updatedMessages = [...messages, userMessage];
        
        setMessages(updatedMessages);
        setIsLoading(true);
        setCurrentStreamingMessage('');
        reset();

        const controller = new AbortController();
        setAbortController(controller);

        try {
            const baseURL = axiosClient.defaults.baseURL || '';
            const url = `${baseURL}/ai/chat`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
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
                if (accumulatedResponse.trim()) {
                    setMessages(prev => [...prev, { 
                        role: 'model', 
                        parts: [{ text: accumulatedResponse }] 
                    }]);
                }
                
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
            
            let errorMessage = "Sorry, I encountered an error. Please try again.";
            if (error.message.includes('Authentication failed')) {
                errorMessage = "Authentication failed. Please log in again.";
            }
            
            setMessages(prev => [...prev, { 
                role: 'model', 
                parts: [{ text: errorMessage }]
            }]);
        } finally {
            setIsLoading(false);
            setCurrentStreamingMessage('');
            setAbortController(null);
        }
    };

    return (
        <div className="flex flex-col h-full max-h-[600px]">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                <AnimatePresence>
                    {messages.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center h-full text-center p-8"
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/25">
                                <Bot className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                AI DSA Tutor
                            </h3>
                            <p className="text-zinc-400 max-w-md text-sm leading-relaxed">
                                Ask me anything about this problem! I can help you understand the approach, 
                                explain concepts, provide hints, or guide you through the solution.
                            </p>
                        </motion.div>
                    ) : (
                        <>
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                                >
                                    {/* Avatar */}
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                        msg.role === "user" 
                                            ? "bg-gradient-to-br from-indigo-500 to-blue-600" 
                                            : "bg-zinc-700"
                                    }`}>
                                        {msg.role === "user" ? (
                                            <UserIcon className="w-4 h-4 text-white" />
                                        ) : (
                                            <Bot className="w-4 h-4 text-white" />
                                        )}
                                    </div>

                                    {/* Message Bubble */}
                                    <div className={`flex-1 max-w-[85%] ${
                                        msg.role === "user" ? "text-right" : "text-left"
                                    }`}>
                                        <div className={`inline-block px-4 py-3 rounded-2xl ${
                                            msg.role === "user"
                                                ? "bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-tr-sm"
                                                : "bg-zinc-800/50 text-zinc-200 border border-zinc-700/50 rounded-tl-sm"
                                        }`}>
                                            <div className="whitespace-pre-wrap text-sm leading-relaxed break-words">
                                                {msg.parts[0].text}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Streaming Message */}
                            {isLoading && currentStreamingMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-3"
                                >
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-zinc-700">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex-1 max-w-[85%]">
                                        <div className="inline-block px-4 py-3 rounded-2xl rounded-tl-sm bg-zinc-800/50 text-zinc-200 border border-zinc-700/50">
                                            <div className="whitespace-pre-wrap text-sm leading-relaxed break-words">
                                                {currentStreamingMessage}
                                                <span className="inline-block w-1 h-4 bg-indigo-400 ml-1 animate-pulse"></span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Loading Indicator */}
                            {isLoading && !currentStreamingMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-3"
                                >
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-zinc-700">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="inline-block px-4 py-3 rounded-2xl rounded-tl-sm bg-zinc-800/50 border border-zinc-700/50">
                                            <div className="flex items-center gap-2 text-zinc-400 text-sm">
                                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-2 pt-4 border-t border-zinc-700/50">
                <div className="flex items-end gap-2">
                    <div className="flex-1">
                        <Input
                            placeholder="Ask about the problem approach, hints, or concepts..."
                            {...register("message", { 
                                required: "Message is required", 
                                minLength: { value: 2, message: "Message must be at least 2 characters" }
                            })}
                            disabled={isLoading}
                            className="bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-indigo-400 focus:ring-indigo-400/20"
                        />
                    </div>
                    
                    {isLoading ? (
                        <Button
                            type="button"
                            onClick={stopStreaming}
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 text-white flex-shrink-0"
                        >
                            <Square className="w-4 h-4" />
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            size="sm"
                            disabled={!!errors.message}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white flex-shrink-0"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    )}
                </div>
                {errors.message && (
                    <p className="text-red-400 text-xs">{errors.message.message}</p>
                )}
            </form>
        </div>
    );
}

export default ChatAi;