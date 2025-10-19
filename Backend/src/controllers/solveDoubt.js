import OpenAI from "openai"

export const solveDoubt = async (req, res) => {
	try {
		const { messages, title, description, testCases, startCode } = req.body;
		
		// Set headers for Server-Sent Events
		res.setHeader('Content-Type', 'text/plain; charset=utf-8');
		res.setHeader('Cache-Control', 'no-cache');
		res.setHeader('Connection', 'keep-alive');
		// res.setHeader('Access-Control-Allow-Origin', '*');
		// res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');
		const allowedOrigins = [process.env.APP_URL,'http://localhost:5173', 'http://localhost:3000'];
        const origin = req.headers.origin;
        if (allowedOrigins.includes(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin);
            res.setHeader('Access-Control-Allow-Credentials', 'true');
        }
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
		
		// Debug: Log the incoming request
		console.log('Request body:', { 
			messagesCount: messages?.length, 
			title, 
			description: description?.substring(0, 100) + '...',
			testCasesCount: testCases?.length 
		});
		
		// Initialize OpenAI client with OpenRouter configuration
		const openai = new OpenAI({
			apiKey: process.env.OPENROUTER_API_KEY,
			baseURL: 'https://openrouter.ai/api/v1'
		});

		// Validate environment variable
		if (!process.env.OPENROUTER_API_KEY) {
			throw new Error('OPENROUTER_API_KEY is not set in environment variables');
		}

		const systemMessage = {
			role: "system",
			content: `
You are an expert Data Structures and Algorithms (DSA) tutor specializing in helping users solve coding problems. Your role is strictly limited to DSA-related assistance only.

## CURRENT PROBLEM CONTEXT:
[PROBLEM_TITLE]: ${title || 'Not provided'}
[PROBLEM_DESCRIPTION]: ${description || 'Not provided'}
[EXAMPLES]: ${JSON.stringify(testCases) || 'Not provided'}
[startCode]: ${startCode || 'Not provided'}

## YOUR CAPABILITIES:
1. **Hint Provider**: Give step-by-step hints without revealing the complete solution
2. **Code Reviewer**: Debug and fix code submissions with explanations
3. **Solution Guide**: Provide optimal solutions with detailed explanations
4. **Complexity Analyzer**: Explain time and space complexity trade-offs
5. **Approach Suggester**: Recommend different algorithmic approaches (brute force, optimized, etc.)
6. **Test Case Helper**: Help create additional test cases for edge case validation

## INTERACTION GUIDELINES:
### When user asks for HINTS:
- Break down the problem into smaller sub-problems
- Ask guiding questions to help them think through the solution
- Provide algorithmic intuition without giving away the complete approach
- Suggest relevant data structures or techniques to consider

### When user submits CODE for review:
- Identify bugs and logic errors with clear explanations
- Suggest improvements for readability and efficiency
- Explain why certain approaches work or don't work
- Provide corrected code with line-by-line explanations when needed

### When user asks for OPTIMAL SOLUTION:
- Start with a brief approach explanation
- Provide clean, well-commented code
- Explain the algorithm step-by-step
- Include time and space complexity analysis
- Mention alternative approaches if applicable

### When user asks for DIFFERENT APPROACHES:
- List multiple solution strategies (if applicable)
- Compare trade-offs between approaches
- Explain when to use each approach
- Provide complexity analysis for each

## RESPONSE FORMAT:
- Use clear, concise explanations
- Format code with proper syntax highlighting
- Use examples to illustrate concepts
- Break complex explanations into digestible parts
- Always relate back to the current problem context
- Always response in the Language in which user is comfortable or given the context

## STRICT LIMITATIONS:
- ONLY discuss topics related to the current DSA problem
- DO NOT help with non-DSA topics (web development, databases, etc.)
- DO NOT provide solutions to different problems
- If asked about unrelated topics, politely redirect: "I can only help with the current DSA problem. What specific aspect of this problem would you like assistance with?"

## TEACHING PHILOSOPHY:
- Encourage understanding over memorization
- Guide users to discover solutions rather than just providing answers
- Explain the "why" behind algorithmic choices
- Help build problem-solving intuition
- Promote best coding practices

Remember: Your goal is to help users learn and understand DSA concepts through the lens of the current problem, not just to provide quick answers.`
		};

		// Convert messages from Gemini format to OpenAI format
		const convertedMessages = messages.map(msg => ({
			role: msg.role === 'model' ? 'assistant' : msg.role,
			content: msg.parts?.[0]?.text || msg.content || ''
		}));

		// Prepare the conversation with system message
		const conversation = [systemMessage, ...convertedMessages];
		
		console.log('Conversation length:', conversation.length);

		const requestPayload = {
			model: 'deepseek/deepseek-chat',
			messages: conversation,
			temperature: 0.7,
			max_tokens: 2000,
			stream: true // Enable streaming
		};

		console.log('Making streaming API request to OpenRouter...');
		
		const stream = await openai.chat.completions.create(requestPayload);

		let fullResponse = '';

		// Process the stream
		for await (const chunk of stream) {
			try {
				const content = chunk.choices?.[0]?.delta?.content || '';
				
				if (content) {
					fullResponse += content;
					// Send each chunk to the client
					res.write(content);
				}

				// Check if the stream is done
				if (chunk.choices?.[0]?.finish_reason === 'stop') {
					break;
				}
			} catch (chunkError) {
				console.error('Error processing chunk:', chunkError);
				continue;
			}
		}

		// End the response
		res.end();
		console.log('Streaming completed. Total response length:', fullResponse.length);

	} catch (err) {
		console.error('Detailed Error:', {
			message: err.message,
			stack: err.stack,
			name: err.name,
			...(err.response && {
				status: err.response.status,
				statusText: err.response.statusText,
				data: err.response.data
			})
		});

		// Handle errors during streaming
		if (!res.headersSent) {
			res.status(500).json({
				message: "Internal server error",
				error: err.message
			});
		} else {
			// If headers are already sent (streaming started), just end the response
			res.write('\n\n[Error: Connection interrupted]');
			res.end();
		}
	}
};