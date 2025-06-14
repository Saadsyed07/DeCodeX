import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
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
}

// Custom MermaidChart component
const MermaidChart: React.FC<{ chart: string }> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      try {
        mermaid.initialize({ startOnLoad: false });
        mermaid.parse(chart); // Throws if invalid
        mermaid.render(`mermaid-${Math.random()}`, chart, (svgCode) => {
          if (ref.current) ref.current.innerHTML = svgCode;
        });
      } catch (e) {
        if (ref.current) ref.current.innerHTML = `<pre style='color:red'>Invalid mermaid diagram</pre>`;
      }
    }
  }, [chart]);

  return <div ref={ref} className="my-4" />;
};

// Custom renderer for code blocks
function CodeBlock({node, inline, className, children, ...props}: any) {
  const match = /language-(\w+)/.exec(className || "");
  const code = String(children).trim();

  // Mermaid block (block code only)
  if (!inline && match && match[1] === "mermaid") {
    return <MermaidChart chart={code} />;
  }

  // Block code (not inline)
  if (!inline) {
    return (
      <div className="not-prose my-4">
        <pre className={className} {...props}>
          <code>{children}</code>
        </pre>
      </div>
    );
  }

  // Inline code
  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
}

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

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
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

  return (
    <div className="space-y-6">
       

      {/* Fallback: Render the rest as markdown */}
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown
          components={{
            code: CodeBlock,
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}; 