import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import mermaid from "mermaid";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Copy, Check } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface MarkdownRendererProps {
  content: string;
  theme?: 'light' | 'dark';
}

// Custom MermaidChart component
const MermaidChart: React.FC<{ chart: string }> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      try {
        mermaid.initialize({ 
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose'
        });
        mermaid.parse(chart);
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        mermaid.render(id, chart, (svgCode) => {
          if (ref.current) ref.current.innerHTML = svgCode;
        });
      } catch (e) {
        console.error('Mermaid rendering error:', e);
        if (ref.current) {
          ref.current.innerHTML = `
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
              <p class="text-red-600 font-medium">Invalid Mermaid Diagram</p>
              <pre class="text-red-500 text-sm mt-2 whitespace-pre-wrap">${chart}</pre>
            </div>
          `;
        }
      }
    }
  }, [chart]);

  return <div ref={ref} className="my-6 flex justify-center" />;
};

// Copy to clipboard hook
const useCopyToClipboard = () => {
  const [copied, setCopied] = React.useState(false);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return { copied, copy };
};

// Copy button component
const CopyButton: React.FC<{ code: string }> = ({ code }) => {
  const { copied, copy } = useCopyToClipboard();

  return (
    <button
      onClick={() => copy(code)}
      className="absolute top-2 right-2 p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      title={copied ? "Copied!" : "Copy code"}
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
};

// Enhanced code block component with syntax highlighting
function CodeBlock({ node, inline, className, children, ...props }: any) {
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : '';
  const code = String(children).replace(/\n$/, '');

  // Handle mermaid diagrams
  if (!inline && language === "mermaid") {
    return <MermaidChart chart={code} />;
  }

  // Handle inline code
  if (inline) {
    return (
      <code className="bg-gray-100 dark:bg-gray-800 text-red-500 dark:text-red-400 px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    );
  }

  // Handle code blocks with syntax highlighting
  return (
    <div className="group relative my-6">
      <div className="flex items-center justify-between bg-gray-800 text-gray-200 px-4 py-2 rounded-t-lg">
        <span className="text-sm font-medium">
          {language ? language.toUpperCase() : 'CODE'}
        </span>
        <CopyButton code={code} />
      </div>
      <div className="relative">
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language || 'text'}
          PreTag="div"
          className="!mt-0 !rounded-t-none !rounded-b-lg"
          showLineNumbers={code.split('\n').length > 5}
          wrapLines={true}
          wrapLongLines={true}
          customStyle={{
            margin: 0,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            fontSize: '14px',
            lineHeight: '1.5'
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

// Custom components for better markdown rendering
const MarkdownComponents = {
  code: CodeBlock,
  
  // Enhanced headings with better styling
  h1: ({ children, ...props }: any) => (
    <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white border-b-2 border-blue-500 pb-2" {...props}>
      {children}
    </h1>
  ),
  
  h2: ({ children, ...props }: any) => (
    <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-100 flex items-center" {...props}>
      {children}
    </h2>
  ),
  
  h3: ({ children, ...props }: any) => (
    <h3 className="text-xl font-semibold mt-5 mb-2 text-gray-700 dark:text-gray-200" {...props}>
      {children}
    </h3>
  ),
  
  // Enhanced blockquotes
  blockquote: ({ children, ...props }: any) => (
    <blockquote 
      className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 dark:bg-blue-900/20 italic text-gray-700 dark:text-gray-300"
      {...props}
    >
      {children}
    </blockquote>
  ),
  
  // Enhanced lists
  ul: ({ children, ...props }: any) => (
    <ul className="list-disc list-inside space-y-2 my-4 ml-4" {...props}>
      {children}
    </ul>
  ),
  
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal list-inside space-y-2 my-4 ml-4" {...props}>
      {children}
    </ol>
  ),
  
  li: ({ children, ...props }: any) => (
    <li className="text-gray-700 dark:text-gray-300 leading-relaxed" {...props}>
      {children}
    </li>
  ),
  
  // Enhanced tables
  table: ({ children, ...props }: any) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg" {...props}>
        {children}
      </table>
    </div>
  ),
  
  thead: ({ children, ...props }: any) => (
    <thead className="bg-gray-50 dark:bg-gray-800" {...props}>
      {children}
    </thead>
  ),
  
  tbody: ({ children, ...props }: any) => (
    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700" {...props}>
      {children}
    </tbody>
  ),
  
  th: ({ children, ...props }: any) => (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" {...props}>
      {children}
    </th>
  ),
  
  td: ({ children, ...props }: any) => (
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100" {...props}>
      {children}
    </td>
  ),
  
  // Enhanced paragraphs
  p: ({ children, ...props }: any) => (
    <p className="text-gray-700 dark:text-gray-300 leading-relaxed my-4" {...props}>
      {children}
    </p>
  ),
  
  // Enhanced links
  a: ({ children, href, ...props }: any) => (
    <a 
      href={href}
      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline font-medium"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  ),
  
  // Enhanced strong/bold text
  strong: ({ children, ...props }: any) => (
    <strong className="font-semibold text-gray-900 dark:text-white" {...props}>
      {children}
    </strong>
  ),
  
  // Enhanced emphasis/italic text
  em: ({ children, ...props }: any) => (
    <em className="italic text-gray-800 dark:text-gray-200" {...props}>
      {children}
    </em>
  )
};

function extractJsonBlock(content: string): any | null {
  const match = content.match(/```json([\s\S]*?)```/);
  if (match) {
    try {
      return JSON.parse(match[1]);
    } catch {
      return null;
    }
  }
  return null;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  theme = 'dark' 
}) => {
  const json = extractJsonBlock(content);

  // Remove the JSON block from the markdown for prose rendering
  const markdown = content.replace(/```json([\s\S]*?)```/, "");

  // Chart type mapping
  const chartMap: Record<string, any> = {
    bar: Bar,
    pie: Pie,
    line: Line,
    doughnut: Doughnut,
  };

  // Render charts if JSON data is present
  const renderChart = () => {
    if (!json || !json.type || !chartMap[json.type]) return null;
    
    const ChartComponent = chartMap[json.type];
    
    return (
      <div className="my-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          {json.title || 'Chart'}
        </h3>
        <div className="h-96">
          <ChartComponent
            data={json.data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
                title: {
                  display: !!json.title,
                  text: json.title,
                },
              },
              ...json.options,
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Render chart if JSON data exists */}
      {renderChart()}

      {/* Render markdown content with enhanced styling */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown components={MarkdownComponents}>
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
};