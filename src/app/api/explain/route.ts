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
    const { code, language, outputLanguage, tone } = body;

    // Enhanced input validation
    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      return NextResponse.json(
        { 
          error: "Code is required and must be a non-empty string",
          details: "Please provide valid code to explain"
        },
        { status: 400 }
      );
    }

    if (!language || typeof language !== 'string') {
      return NextResponse.json(
        { 
          error: "Programming language is required",
          details: "Please specify the programming language of your code"
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

    // Default values with validation
    const outputLang = outputLanguage && typeof outputLanguage === 'string' 
      ? outputLanguage.toLowerCase() : 'english';
    const outputTone = tone && typeof tone === 'string' 
      ? tone.toLowerCase() : 'professional';
    
    // Validate tone options
    const validTones = ['professional', 'casual', 'technical', 'beginner-friendly', 'detailed'];
    const selectedTone = validTones.includes(outputTone) ? outputTone : 'professional';
    
    // Check if code might be in the wrong language
    const detectionResult = detectWrongLanguage(code, language.toLowerCase());
    let correctionPrompt = '';
    
    if (detectionResult.possibleLanguage) {
      correctionPrompt = `

⚠️ **IMPORTANT NOTICE**: The submitted code appears to be written in **${detectionResult.possibleLanguage}** rather than **${language}**. 
Please address this discrepancy in your explanation and provide the equivalent code in **${language}** if possible.
Confidence level: ${detectionResult.confidence}%`;
    }

    // Enhanced prompt for better responses
    const prompt = `You are an expert programming tutor and code analyst. Your task is to provide a comprehensive, well-structured explanation of the given code.

**Context:**
- Programming Language: ${language}
- Explanation Language: ${outputLang}
- Tone: ${selectedTone}
- Code Length: ${code.length} characters${correctionPrompt}

**Your Response Must Follow This EXACT Structure:**

## 📋 Code Overview
[Provide a 2-3 sentence summary of what this code does]

## 🏗️ Code Structure
[Use a mermaid flowchart or sequence diagram to visualize the code flow]

## 🔍 Detailed Breakdown

### Main Components:
[List and explain each major component, function, or class]

### Step-by-Step Execution:
[Explain the code execution flow with numbered steps]

## 💻 Code Analysis

\`\`\`${language}
${code}
\`\`\`

### Line-by-Line Explanation:
[Provide detailed explanation of complex lines]


## 🚀 Expected Output
[If possible, show what the code would output when executed]

## 💡 Best Practices & Suggestions
[Mention any improvements or best practices]

${detectionResult.possibleLanguage ? `
## 🔧 Language Correction
[Since you detected the wrong language, provide the corrected version in ${language}]

\`\`\`${language}
[Corrected code here]
\`\`\`
` : ''}

**CRITICAL FORMATTING REQUIREMENTS:**
// - Use proper markdown formatting
- Wrap ALL code snippets in triple backticks with language specification
- Use clear headings and subheadings
- Include emojis in headings for better readability
- Provide code in copyable format
- Use bullet points and numbered lists where appropriate
- Include mermaid diagrams for complex logic flows
- Maintain ${selectedTone} tone throughout
- Write in ${outputLang} language

**Code to Explain:**
\`\`\`${language}
${code}
\`\`\``;

    // Make API request with retry logic
    const explanation = await makeAPIRequestWithRetry(prompt);

    return NextResponse.json({ 
      success: true,
      explanation,
      metadata: {
        detectedLanguage: detectionResult.possibleLanguage,
        confidence: detectionResult.confidence,
        codeLength: code.length,
        language: language,
        tone: selectedTone,
        outputLanguage: outputLang
      }
    });

  } catch (error) {
    console.error('Error explaining code:', error);
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
        temperature: 0.7,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:3000',
          'X-Title': 'DeCodeX - AI Code Explainer',
          'Content-Type': 'application/json',
        },
        timeout: TIMEOUT
      }
    );

    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from AI service');
    }

    return response.data.choices[0].message.content;

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
  // Rate limiting error
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
            "Check if the programming language is correctly specified",
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

  // Timeout error
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

  // JSON parsing error
  if (error instanceof SyntaxError) {
    return NextResponse.json({
      error: "Invalid request format",
      details: "The request body contains invalid JSON",
      suggestions: ["Please check your request format and try again"]
    }, { status: 400 });
  }

  // Generic error
  return NextResponse.json({
    error: "Internal server error",
    details: error.message || "An unexpected error occurred",
    suggestions: [
      "Please try again",
      "If the problem persists, contact support"
    ]
  }, { status: 500 });
}

// Enhanced language detection function
function detectWrongLanguage(code: string, specifiedLanguage: string): { 
  possibleLanguage: string | null, 
  confidence: number 
} {
  const codeUpper = code.toUpperCase();
  const codeLower = code.toLowerCase();
  
  // Language patterns with weights
  const languagePatterns = {
    python: {
      patterns: [
        { pattern: /def\s+\w+\s*\(/, weight: 10 },
        { pattern: /import\s+\w+/, weight: 8 },
        { pattern: /from\s+\w+\s+import/, weight: 9 },
        { pattern: /if\s+__name__\s*==\s*['""]__main__['""]/, weight: 15 },
        { pattern: /print\s*\(/, weight: 7 },
        { pattern: /:\s*\n/, weight: 5 },
        { pattern: /elif\s+/, weight: 8 },
        { pattern: /except\s+/, weight: 10 },
        { pattern: /class\s+\w+.*:/, weight: 9 }
      ]
    },
    javascript: {
      patterns: [
        { pattern: /function\s+\w+\s*\(/, weight: 10 },
        { pattern: /(const|let|var)\s+\w+/, weight: 8 },
        { pattern: /=>\s*{/, weight: 9 },
        { pattern: /console\.log\s*\(/, weight: 10 },
        { pattern: /document\.\w+/, weight: 12 },
        { pattern: /window\.\w+/, weight: 12 },
        { pattern: /\.addEventListener\s*\(/, weight: 11 },
        { pattern: /JSON\.(parse|stringify)/, weight: 10 }
      ]
    },
    typescript: {
      patterns: [
        { pattern: /:\s*(string|number|boolean|any|void)/, weight: 12 },
        { pattern: /interface\s+\w+/, weight: 15 },
        { pattern: /type\s+\w+\s*=/, weight: 12 },
        { pattern: /<T>|<T,/, weight: 10 },
        { pattern: /(private|public|protected)\s+/, weight: 11 },
        { pattern: /implements\s+\w+/, weight: 10 },
        { pattern: /namespace\s+\w+/, weight: 12 }
      ]
    },
    java: {
      patterns: [
        { pattern: /public\s+class\s+\w+/, weight: 15 },
        { pattern: /public\s+static\s+void\s+main/, weight: 20 },
        { pattern: /System\.out\.print/, weight: 12 },
        { pattern: /import\s+java\./, weight: 10 },
        { pattern: /(private|public|protected)\s+\w+/, weight: 8 },
        { pattern: /extends\s+\w+/, weight: 10 },
        { pattern: /new\s+\w+\s*\(/, weight: 7 }
      ]
    },
    cpp: {
      patterns: [
        { pattern: /#include\s*<\w+>/, weight: 12 },
        { pattern: /using\s+namespace\s+std/, weight: 15 },
        { pattern: /std::\w+/, weight: 10 },
        { pattern: /cout\s*<</, weight: 12 },
        { pattern: /cin\s*>>/, weight: 12 },
        { pattern: /int\s+main\s*\(/, weight: 15 },
        { pattern: /template\s*</, weight: 12 },
        { pattern: /->\w+/, weight: 8 }
      ]
    },
    c: {
      patterns: [
        { pattern: /#include\s*<\w+\.h>/, weight: 12 },
        { pattern: /printf\s*\(/, weight: 10 },
        { pattern: /scanf\s*\(/, weight: 10 },
        { pattern: /malloc\s*\(/, weight: 12 },
        { pattern: /free\s*\(/, weight: 10 },
        { pattern: /struct\s+\w+/, weight: 10 },
        { pattern: /typedef\s+/, weight: 8 }
      ]
    }
  };

  // Calculate scores for each language
  const scores: { [key: string]: number } = {};
  
  Object.entries(languagePatterns).forEach(([lang, { patterns }]) => {
    scores[lang] = 0;
    patterns.forEach(({ pattern, weight }) => {
      const matches = code.match(pattern);
      if (matches) {
        scores[lang] += weight * matches.length;
      }
    });
  });

  // Find the language with the highest score
  const sortedLanguages = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .filter(([, score]) => score > 0);

  if (sortedLanguages.length === 0) {
    return { possibleLanguage: null, confidence: 0 };
  }

  const [detectedLang, score] = sortedLanguages[0];
  const totalPossibleScore = Math.max(...Object.values(languagePatterns).map(p => 
    p.patterns.reduce((sum, pattern) => sum + pattern.weight, 0)
  ));
  
  const confidence = Math.min(Math.round((score / totalPossibleScore) * 100), 100);
  
  // Only return if confidence is reasonable and language is different
  if (confidence >= 30 && detectedLang !== specifiedLanguage.toLowerCase()) {
    return { 
      possibleLanguage: detectedLang, 
      confidence 
    };
  }

  return { possibleLanguage: null, confidence: 0 };
}