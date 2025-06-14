import { NextResponse } from "next/server";
import axios from "axios";

if (!process.env.OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY is not set in environment variables");
}

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
    
    // Check if code might be in the wrong language
    const possibleWrongLanguage = detectWrongLanguage(code, language);
    let correctionPrompt = '';
    
    if (possibleWrongLanguage) {
      correctionPrompt = `
NOTE: The submitted code appears to be written in ${possibleWrongLanguage} rather than ${language}. 
Please correct this in your explanation and provide the equivalent code in ${language} if possible.`;
    }

    const prompt = `You are an expert programmer and code tutor. 
Explain the following code written in ${language} in a ${outputTone} tone and provide the explanation in ${outputLang}.${correctionPrompt}

**Instructions:**
- Present the explanation as a hierarchy or flowchart using markdown.
- Use bullet points, indentation, and code blocks to show structure.
- For each function, block, or important line, show its relationship to others (parent/child, sequence, etc.).
- Summarize the overall logic at the top, then break down each part step by step.
- If possible, use mermaid.js diagrams (in markdown) to visualize the flow or structure.
- After the explanation, provide the code's output (if possible) for verification.
- Maintain the specified tone (${outputTone}) throughout the explanation.
- Ensure the explanation is culturally appropriate for ${outputLang} speakers.
${possibleWrongLanguage ? '- Provide the corrected code in the requested language.' : ''}

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

    return NextResponse.json({ 
      explanation,
      possibleWrongLanguage: possibleWrongLanguage || null 
    });
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

// Helper function to detect if code might be in a different language than specified
function detectWrongLanguage(code: string, specifiedLanguage: string): string | null {
  // Python indicators
  const pythonIndicators = [
    'def ', 'import ', 'from ', ' as ', ':\n', 'print(', 'if __name__ == "__main__":', 
    'class ', '#!', 'elif ', 'else:', 'try:', 'except:', 'finally:'
  ];
  
  // JavaScript indicators
  const jsIndicators = [
    'function ', 'const ', 'let ', 'var ', '=>', 'console.log(', 'document.', 'window.', 
    'export ', 'import ', 'class ', 'extends ', 'return ', 'new ', 'this.'
  ];
  
  // TypeScript indicators (in addition to JS)
  const tsIndicators = [
    ': string', ': number', ': boolean', ': any', ': void', 'interface ', 'type ', '<T>', 
    'implements ', 'private ', 'public ', 'protected ', 'readonly ', 'namespace '
  ];
  
  // Java indicators
  const javaIndicators = [
    'public class ', 'private ', 'protected ', 'void ', 'static ', 'extends ', 'implements ', 
    'System.out.println(', 'import java.', 'public static void main(String[] args)', 'new '
  ];
  
  // C++ indicators
  const cppIndicators = [
    '#include', 'using namespace', 'std::', 'cout <<', 'cin >>', 'int main()', 'void ', 
    'class ', 'public:', 'private:', 'protected:', 'template<', '->'
  ];
  
  // C indicators
  const cIndicators = [
    '#include', 'printf(', 'scanf(', 'int main()', 'void ', 'struct ', 'typedef ', 'malloc(', 'free('
  ];
  
  // Count indicators for each language
  let pythonCount = 0;
  let jsCount = 0;
  let tsCount = 0;
  let javaCount = 0;
  let cppCount = 0;
  let cCount = 0;
  
  pythonIndicators.forEach(indicator => {
    if (code.includes(indicator)) pythonCount++;
  });
  
  jsIndicators.forEach(indicator => {
    if (code.includes(indicator)) jsCount++;
  });
  
  tsIndicators.forEach(indicator => {
    if (code.includes(indicator)) tsCount++;
  });
  
  javaIndicators.forEach(indicator => {
    if (code.includes(indicator)) javaCount++;
  });
  
  cppIndicators.forEach(indicator => {
    if (code.includes(indicator)) cppCount++;
  });
  
  cIndicators.forEach(indicator => {
    if (code.includes(indicator)) cCount++;
  });
  
  // Add JS count to TS since TS is a superset
  tsCount += jsCount;
  
  // Determine the most likely language
  const counts = [
    { lang: 'python', count: pythonCount },
    { lang: 'javascript', count: jsCount },
    { lang: 'typescript', count: tsCount },
    { lang: 'java', count: javaCount },
    { lang: 'cpp', count: cppCount },
    { lang: 'c', count: cCount }
  ];
  
  counts.sort((a, b) => b.count - a.count);
  
  // If the most likely language has indicators and is different from specified
  if (counts[0].count > 0 && counts[0].lang !== specifiedLanguage) {
    return counts[0].lang;
  }
  
  return null;
}