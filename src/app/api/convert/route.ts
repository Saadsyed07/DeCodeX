import { NextResponse } from "next/server";
import axios from "axios";

if (!process.env.OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY is not set in environment variables");
}

const MODEL_ID = 'mistralai/mixtral-8x7b-instruct';
const MAX_RETRIES = 3;
const TIMEOUT = 30000; // 30 seconds

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, from, to } = body;

    // Enhanced input validation
    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Code is required and must be a non-empty string",
          details: "Please provide valid code to convert"
        },
        { status: 400 }
      );
    }

    if (!from || typeof from !== 'string') {
      return NextResponse.json(
        {
          error: "Source language is required",
          details: "Please specify the source programming language"
        },
        { status: 400 }
      );
    }

    if (!to || typeof to !== 'string') {
      return NextResponse.json(
        {
          error: "Target language is required",
          details: "Please specify the target programming language"
        },
        { status: 400 }
      );
    }

    if (from === to) {
      return NextResponse.json(
        {
          error: "Source and target language must be different",
          details: "Please select a different target language"
        },
        { status: 400 }
      );
    }

    // Validate code length
    if (code.length > 10000) {
      return NextResponse.json(
        {
          error: "Code is too long",
          details: "Please provide code with less than 10,000 characters"
        },
        { status: 400 }
      );
    }

    // Prompt for code conversion
    const prompt = `You are a world-class AI code converter. Convert the following code from ${from} to ${to}. 
- Output only the converted code in ${to}, inside a single markdown code block tagged with the correct language.
- Do NOT explain, just provide the code.
- If the code cannot be converted or is incomplete, return a helpful error message.

SOURCE CODE (${from}):
\`\`\`${from}
${code}
\`\`\``;

    // Make API request with retry logic
    const converted = await makeAPIRequestWithRetry(prompt);

    return NextResponse.json({
      success: true,
      converted,
      metadata: {
        from,
        to,
        codeLength: code.length
      }
    });

  } catch (error) {
    console.error('Error converting code:', error);
    return handleError(error);
  }
}

// Enhanced API request function with retry logic
async function makeAPIRequestWithRetry(prompt: string, retryCount = 0): Promise<string> {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: MODEL_ID,
        messages: [{
          role: 'user',
          content: prompt
        }],
        max_tokens: 4000,
        temperature: 0.4,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:3000',
          'X-Title': 'DeCodeX - AI Code Converter',
          'Content-Type': 'application/json',
        },
        timeout: TIMEOUT
      }
    );

    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from AI service');
    }

    // Extract only the code block from the response if possible
    const content = response.data.choices[0].message.content;
    const codeMatch = content.match(/```[\w]*\n?([\s\S]*?)```/);
    return codeMatch ? codeMatch[1].trim() : content.trim();

  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying API request... Attempt ${retryCount + 1}/${MAX_RETRIES}`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
      return makeAPIRequestWithRetry(prompt, retryCount + 1);
    }
    throw error;
  }
}

// Enhanced error handling
function handleError(error: any): NextResponse {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status || 500;
    const responseData = error.response?.data;

    switch (status) {
      case 400:
        return NextResponse.json({
          error: "Invalid request",
          details: responseData?.error || "The request was malformed. Please check your code and try again.",
          suggestions: [
            "Verify your code is properly formatted",
            "Check if the programming languages are correctly specified",
            "Ensure your code is not too long (max 10,000 characters)"
          ]
        }, { status: 400 });

      case 401:
        return NextResponse.json({
          error: "Authentication failed",
          details: "Invalid API key or authentication issue",
          suggestions: ["Please contact support if this error persists"]
        }, { status: 401 });

      case 429:
        return NextResponse.json({
          error: "Rate limit exceeded",
          details: "Too many requests. Please wait before trying again.",
          suggestions: [
            "Wait a few minutes before making another request",
            "Consider upgrading your plan for higher limits"
          ],
          retryAfter: error.response?.headers?.['retry-after'] || 60
        }, { status: 429 });

      case 500:
      case 502:
      case 503:
        return NextResponse.json({
          error: "Service temporarily unavailable",
          details: "The AI service is currently experiencing issues",
          suggestions: [
            "Please try again in a few minutes",
            "If the problem persists, contact support"
          ]
        }, { status: 503 });

      default:
        return NextResponse.json({
          error: "API request failed",
          details: responseData?.error || error.message || "Unknown API error",
          statusCode: status
        }, { status });
    }
  }

  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return NextResponse.json({
      error: "Request timeout",
      details: "The request took too long to process",
      suggestions: [
        "Try with a shorter code snippet",
        "Check your internet connection",
        "Try again in a few moments"
      ]
    }, { status: 408 });
  }

  if (error instanceof SyntaxError) {
    return NextResponse.json({
      error: "Invalid request format",
      details: "The request body contains invalid JSON",
      suggestions: ["Please check your request format and try again"]
    }, { status: 400 });
  }

  return NextResponse.json({
    error: "Internal server error",
    details: error.message || "An unexpected error occurred",
    suggestions: [
      "Please try again",
      "If the problem persists, contact support"
    ]
  }, { status: 500 });
}