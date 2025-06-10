import { NextResponse } from "next/server";
import axios from "axios";

const API_KEY ='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';
const MODEL_ID = 'mistralai/mixtral-8x7b-instruct';

export async function POST(req: Request) {
  try {
    const { code, language } = await req.json();

    if (!code || !language) {
      return NextResponse.json(
        { error: "Code and language are required" },
        { status: 400 }
      );
    }

    const prompt = `You are an expert programmer and code tutor. 
Explain the following code written in ${language} in a highly visual, structured, and easy-to-understand way.

**Instructions:**
- Present the explanation as a hierarchy or flowchart using markdown.
- Use bullet points, indentation, and code blocks to show structure.
- For each function, block, or important line, show its relationship to others (parent/child, sequence, etc.).
- Summarize the overall logic at the top, then break down each part step by step.
- If possible, use mermaid.js diagrams (in markdown) to visualize the flow or structure.
- After the explanation, provide the code's output (if possible) and a summary table of key variables/functions.

**Additionally, return a JSON object at the end of your response (in a markdown code block labeled 'json') with the following fields:**
- summary: string
- lineByLine: array of { line: string, explanation: string }
- technicalInsights: array of string
- bestPractices: array of string
- flowchart: string (mermaid code)
- tables: array of { title: string, headers: string[], rows: string[][] }
- charts: array of { type: string, data: object, options: object }

**Code:**
${code}
`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: MODEL_ID,
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost', // required
          'X-Title': 'terminal-chat-app',
        },
      }
    );

    const explanation = response.data.choices[0]?.message?.content;

    if (!explanation) {
      throw new Error("No explanation generated");
    }

    return NextResponse.json({ explanation });
  } catch (error: any) {
    const err = error.response?.data || error.message;
    console.error("Error explaining code:", err);
    return NextResponse.json(
      { error: "Failed to explain code" },
      { status: 500 }
    );
  }
} 