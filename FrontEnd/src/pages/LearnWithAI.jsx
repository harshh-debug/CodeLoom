import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send, Square, BookOpen, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Navbar from "@/components/Navbar";

function LearnWithAI() {
	const [messages, setMessages] = useState([]);
	const [isStreaming, setIsStreaming] = useState(false);
	const [currentLevel, setCurrentLevel] = useState("beginner");
	const messagesEndRef = useRef(null);
	const abortControllerRef = useRef(null);

	const { register, handleSubmit, reset } = useForm();

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const stopGeneration = () => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
			setIsStreaming(false);
			abortControllerRef.current = null;
		}
	};

	
	const handlePresetPrompt = async (prompt) => {
		if (isStreaming) {
			stopGeneration(); // abort any ongoing streaming requests
			// Wait a bit for the state to update before proceeding
			await new Promise((resolve) => setTimeout(resolve, 100));
		}

		
		const userMessage = prompt.trim();
		if (!userMessage) return;

		const userMsgObj = {
			role: "user",
			parts: [{ text: userMessage }],
		};

		setMessages((prev) => [...prev, userMsgObj]);
		setIsStreaming(true);

		setMessages((prev) => [...prev, { role: "model", parts: [{ text: "" }] }]);

		try {
			abortControllerRef.current = new AbortController();
			const baseURL = axiosClient.defaults.baseURL || "";
			const response = await fetch(`${baseURL}/ai/learn`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				signal: abortControllerRef.current.signal,
				body: JSON.stringify({
					messages: [...messages, userMsgObj],
					level: currentLevel,
				}),
			});

			if (!response.ok) throw new Error("Failed to get AI response");

			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let accumulatedResponse = "";

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				const chunk = decoder.decode(value, { stream: true });
				accumulatedResponse += chunk;
				setMessages((prev) => {
					const updated = [...prev];
					const lastMsg = updated[updated.length - 1];
					if (lastMsg?.role === "model") {
						lastMsg.parts[0].text = accumulatedResponse;
					}
					return updated;
				});
			}
		} catch (error) {
			if (error.name === "AbortError") {
				// User cancelled
			} else {
				setMessages((prev) => {
					const updated = [...prev];
					updated[updated.length - 1].parts[0].text =
						"Sorry, I encountered an error. Please try again.";
					return updated;
				});
			}
		} finally {
			setIsStreaming(false);
			abortControllerRef.current = null;
		}
	};

	const onSubmit = async (data) => {
		const userMessage = data.message.trim();
		if (!userMessage || isStreaming) return;

		const userMsgObj = {
			role: "user",
			parts: [{ text: userMessage }],
		};

		setMessages((prev) => [...prev, userMsgObj]);
		reset();
		setIsStreaming(true);

		setMessages((prev) => [...prev, { role: "model", parts: [{ text: "" }] }]);

		try {
			abortControllerRef.current = new AbortController();
			const baseURL = axiosClient.defaults.baseURL || "";
			const response = await fetch(`${baseURL}/ai/learn`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				signal: abortControllerRef.current.signal,
				body: JSON.stringify({
					messages: [...messages, userMsgObj],
					level: currentLevel,
				}),
			});

			if (!response.ok) throw new Error("Failed to get AI response");

			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let accumulatedResponse = "";

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				const chunk = decoder.decode(value, { stream: true });
				accumulatedResponse += chunk;
				setMessages((prev) => {
					const updated = [...prev];
					const lastMsg = updated[updated.length - 1];
					if (lastMsg?.role === "model") {
						lastMsg.parts[0].text = accumulatedResponse;
					}
					return updated;
				});
			}
		} catch (error) {
			if (error.name === "AbortError") {
				// User cancelled
			} else {
				setMessages((prev) => {
					const updated = [...prev];
					updated[updated.length - 1].parts[0].text =
						"Sorry, I encountered an error. Please try again.";
					return updated;
				});
			}
		} finally {
			setIsStreaming(false);
			abortControllerRef.current = null;
		}
	};

	return (
		<div className="min-h-screen flex flex-col bg-zinc-900">
			<Navbar />
			<main className="flex-1 flex flex-col">
				{/* Compact Header Area */}
				<div className="border-zinc-800/50 flex items-center bg-zinc-900/85 px-4 sm:px-6 h-16 z-20">
					<div className="max-w-5xl w-full mx-auto flex items-center justify-between">
						<div className="flex items-center gap-2">
							<span className="inline-flex w-7 h-7 items-center justify-center rounded-md bg-indigo-700/80 mr-2 shadow">
								<Sparkles className="w-5 h-5 text-indigo-200" />
							</span>
							<span className="font-semibold text-lg text-white tracking-tight">
								Learn with AI
							</span>
							<span className="text-sm text-zinc-400 ml-3 hidden sm:inline">
								DSA Mentor
							</span>
						</div>
						{/* Level Selector Compact & Larger*/}
						<div className="flex gap-2">
							{["beginner", "intermediate", "advanced"].map((level) => (
								<button
									key={level}
									onClick={() => setCurrentLevel(level)}
									className={`px-3 py-1.5 rounded-md text-sm font-semibold transition border border-transparent ${
										currentLevel === level
											? "bg-indigo-600 text-white"
											: "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
									}`}
								>
									{level.charAt(0).toUpperCase() + level.slice(1)}
								</button>
							))}
						</div>
					</div>
				</div>

				{/* Message Section */}
				<div className="flex-1 overflow-y-auto p-2 sm:p-6 bg-zinc-900">
					<div className="max-w-4xl mx-auto space-y-6 pb-16">
						{messages.length === 0 && (
							<div className="text-center py-16">
								<span className="inline-flex w-16 h-16 items-center justify-center rounded-xl bg-indigo-900/60 mb-4 shadow-lg">
									<Sparkles className="w-8 h-8 text-indigo-400" />
								</span>
								<h2 className="text-xl font-semibold text-white mb-2">
									Start Learning Instantly
								</h2>
								<p className="text-zinc-400">
									Get answers, step-by-step explanations, and ask topic-specific
									DSA questions.
								</p>
								<div className="mt-5 flex flex-wrap justify-center gap-2">
									{[
										"Explain Binary Search",
										"What is Dynamic Programming?",
										"How does a HashSet work?",
									].map((prompt) => (
										<button
											key={prompt}
											onClick={() => handlePresetPrompt(prompt)}
											className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition text-sm"
										>
											{prompt}
										</button>
									))}
								</div>
							</div>
						)}

						{messages.map((msg, idx) => (
							<div
								key={idx}
								className={`flex ${
									msg.role === "user" ? "justify-end" : "justify-start"
								}`}
							>
								<div
									className={`max-w-[80%] rounded-lg px-4 py-3 ${
										msg.role === "user"
											? "bg-indigo-600 text-white"
											: "bg-zinc-800/50 border border-zinc-700/50 text-zinc-300"
									}`}
								>
									{msg.role === "model" ? (
										<ReactMarkdown
											components={{
												p: ({ node, ...props }) => (
													<p className="mb-2" {...props} />
												),
												pre: ({ node, ...props }) => (
													<pre
														className="bg-black/80 rounded-lg p-3 my-2 overflow-x-auto text-sm"
														{...props}
													/>
												),
												code: ({ node, ...props }) => (
													<code
														className="bg-zinc-900 rounded px-1 py-0.5 text-indigo-300"
														{...props}
													/>
												),
												ul: ({ node, ...props }) => (
													<ul className="list-disc pl-5 mb-2" {...props} />
												),
												ol: ({ node, ...props }) => (
													<ol className="list-decimal pl-5 mb-2" {...props} />
												),
												li: ({ node, ...props }) => (
													<li className="mb-1" {...props} />
												),
												h2: ({ node, ...props }) => (
													<h2
														className="text-lg font-bold mt-4 mb-2 text-indigo-300"
														{...props}
													/>
												),
												h3: ({ node, ...props }) => (
													<h3
														className="text-base font-bold mt-3 mb-2 text-indigo-300"
														{...props}
													/>
												),
											}}
										>
											{msg.parts[0].text}
										</ReactMarkdown>
									) : (
										<p>{msg.parts[0].text}</p>
									)}
								</div>
							</div>
						))}
						<div ref={messagesEndRef} />
					</div>
				</div>

				{/* Input */}
				<div className="bg-zinc-800/70 border-t border-zinc-700/50 px-2 sm:px-0 py-3 fixed bottom-0 left-0 right-0 z-30">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="max-w-4xl mx-auto flex gap-2"
					>
						<input
							{...register("message")}
							placeholder="Ask about any DSA topic..."
							className="flex-1 bg-zinc-900 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
							disabled={isStreaming}
							autoComplete="off"
						/>
						{isStreaming ? (
							<button
								type="button"
								onClick={stopStreaming}
								className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg transition flex items-center gap-2"
							>
								<Square className="w-5 h-5" />
								Stop
							</button>
						) : (
							<button
								type="submit"
								className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition flex items-center gap-2"
							>
								<Send className="w-5 h-5" />
								Send
							</button>
						)}
					</form>
				</div>
			</main>
		</div>
	);

	function stopStreaming() {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
			setIsStreaming(false);
			abortControllerRef.current = null;
		}
	}
}

export default LearnWithAI;
