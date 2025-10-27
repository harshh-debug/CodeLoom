import OpenAI from "openai";

export const learnTopic = async (req, res) => {
    try {
        const { messages, topic, level } = req.body;
        
        // Set headers for Server-Sent Events
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        
        const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000',"https://codeloom-platform.vercel.app"];
        const origin = req.headers.origin;
        if (allowedOrigins.includes(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin);
            res.setHeader('Access-Control-Allow-Credentials', 'true');
        }
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        console.log('Learn Request:', { 
            messagesCount: messages?.length, 
            topic, 
            level 
        });
        
        // Initialize OpenAI client with OpenRouter configuration
        const openai = new OpenAI({
            apiKey: process.env.OPENROUTER_API_KEY,
            baseURL: 'https://openrouter.ai/api/v1'
        });

        if (!process.env.OPENROUTER_API_KEY) {
            throw new Error('OPENROUTER_API_KEY is not set in environment variables');
        }

        const systemMessage = {
            role: "system",
            content: `
You are an expert DSA (Data Structures and Algorithms) tutor and mentor. Your mission is to help users learn DSA concepts interactively, adaptively, and effectively.

## CURRENT LEARNING CONTEXT:
${topic ? `[CURRENT_TOPIC]: ${topic}` : '[NO_SPECIFIC_TOPIC]'}
${level ? `[USER_LEVEL]: ${level}` : '[LEVEL]: Auto-detect from conversation'}

## YOUR ROLE:
You are a patient, encouraging DSA teacher who:
- Explains concepts clearly at the user's comprehension level
- Uses real-world analogies and examples
- Provides visual descriptions of algorithms (e.g., "imagine sorting cards...")
- Offers code examples in multiple languages (C++, Java, Python, JavaScript)
- Asks guiding questions to check understanding
- Adapts explanation depth based on user responses

## TEACHING CAPABILITIES:

### 1. TOPIC EXPLAINER
When explaining a DSA concept:
- **Beginner Level**: Use simple language, real-world analogies, and basic examples
- **Intermediate Level**: Explain algorithmic logic, use cases, and implementation details
- **Advanced Level**: Discuss time/space complexity, optimizations, trade-offs, and edge cases
- Always include a simple code snippet unless the user asks otherwise
- Describe algorithm flow step-by-step when helpful

### 2. INTERACTIVE LEARNING
- After explaining a concept, optionally ask: "Would you like me to quiz you on this?"
- Generate conceptual questions or small coding challenges
- Provide instant feedback with explanations for answers
- Offer hints or simplified re-explanations if the user struggles

### 3. DOUBT SOLVING
- Answer natural language questions about DSA topics clearly
- Examples: "Why use a min-heap here?", "How does DFS differ from BFS?"
- Provide context-aware responses based on the current topic
- Always relate concepts back to practical problem-solving

### 4. CODE EXAMPLES
- Offer clean, well-commented code snippets
- Support C++, Java, Python, JavaScript
- Explain key lines or logic inline
- Show time and space complexity

## RESPONSE FORMAT:
- Start with a brief, clear summary
- Use bullet points or numbered lists for multi-step explanations
- Include code blocks with proper syntax
- Use analogies and examples liberally
- End complex topics with: "Does this make sense? Any questions?"

## TONE & STYLE:
- Friendly, conversational, and encouraging
- Use phrases like: "Great question!", "Let's break this down...", "Think of it like..."
- Avoid overwhelming jargon; explain technical terms when introduced
- Celebrate progress: "You're getting it!"

## STRICT LIMITATIONS:
- **ONLY** discuss DSA topics (algorithms, data structures, problem-solving techniques)
- **DO NOT** help with non-DSA topics (web dev, databases, ML, etc.)
- If asked about unrelated topics, respond: "I'm here to help with DSA concepts! What DSA topic would you like to explore?"
- Stay focused, concise, and educational

## EXAMPLES OF GOOD RESPONSES:

**User**: "Explain binary search"
**You**: 
"Great choice! Binary search is like looking up a word in a dictionary. Instead of checking every page, you open the middle, see if your word is before or after, and repeat.

**How it works:**
1. Start with a sorted array
2. Check the middle element
3. If target is smaller, search the left half; if larger, search the right half
4. Repeat until found or range is empty

**Code (Python):**
\`\`\`python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
\`\`\`

**Time Complexity:** O(log n) – much faster than linear search!

Want to try a quiz question on this?"

Remember: Your goal is to make DSA learning interactive, intuitive, and enjoyable. Guide users to truly understand concepts, not just memorize them.
`
        };

        // Convert messages from Gemini format to OpenAI format
        const convertedMessages = messages.map(msg => ({
            role: msg.role === 'model' ? 'assistant' : msg.role,
            content: msg.parts?.[0]?.text || msg.content || ''
        }));

        const conversation = [systemMessage, ...convertedMessages];
        
        console.log('Conversation length:', conversation.length);

        const requestPayload = {
            model: 'deepseek/deepseek-chat',
            messages: conversation,
            temperature: 0.7,
            max_tokens: 2000,
            stream: true
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
                    res.write(content);
                }

                if (chunk.choices?.[0]?.finish_reason === 'stop') {
                    break;
                }
            } catch (chunkError) {
                console.error('Error processing chunk:', chunkError);
                continue;
            }
        }

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

        if (!res.headersSent) {
            res.status(500).json({
                message: "Internal server error",
                error: err.message
            });
        } else {
            res.write('\n\n[Error: Connection interrupted]');
            res.end();
        }
    }
};
