import { NextResponse } from "next/server";
import axios from "axios";

<<<<<<< HEAD
if (!process.env.OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY is not set in environment variables");
}

=======
const API_KEY ='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';
>>>>>>> 95182137fb81b7738aa6faaea5dfe30e95b7ac09
const MODEL_ID = 'mistralai/mixtral-8x7b-instruct';

export async function POST(req: Request) {
  try {
    const { code, language, outputLanguage, tone } = await req.json();

    if (!code || !language) {
      return NextResponse.json(
        { error: "Code and language are required" },
        { status: 400 }
      );
    }

    // Default values if not provided
    const outputLang = outputLanguage || 'english';
    const outputTone = tone || 'professional';

    const prompt = `You are an expert programmer and code tutor. 
Explain the following code written in ${language} in a ${outputTone} tone and provide the explanation in ${outputLang}.

**Instructions:**
- Present the explanation as a hierarchy or flowchart using markdown.
- Use bullet points, indentation, and code blocks to show structure.
- For each function, block, or important line, show its relationship to others (parent/child, sequence, etc.).
- Summarize the overall logic at the top, then break down each part step by step.
- If possible, use mermaid.js diagrams (in markdown) to visualize the flow or structure.
- After the explanation, provide the code's output (if possible) for verification.
- Maintain the specified tone (${outputTone}) throughout the explanation.
- Ensure the explanation is culturally appropriate for ${outputLang} speakers.

**Output Format:**
- Use markdown syntax for the explanation.
- Include mermaid.js diagrams if applicable.
- Show the code's output at the end for verification.
- Use code blocks for every code snippet you provide.
- Format the explanation in ${outputLang}.

**Code:**
${code}
`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: MODEL_ID,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:3000',
          'X-Title': 'DeCodeX - AI Code Explainer',
          'Content-Type': 'application/json',
        },
      }
    );

    const explanation = response.data.choices[0].message.content;

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error('Error explaining code:', error);
    
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.error || error.message;
      
      return NextResponse.json(
        { error: `API Error: ${errorMessage}` },
        { status: statusCode }
      );
    }

    return NextResponse.json(
      { error: 'Failed to explain code' },
      { status: 500 }
    );
  }
}