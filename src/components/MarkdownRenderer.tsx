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
      {/* Summary */}
      <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-200 dark:border-blue-800 shadow">
        <h3 className="font-bold text-lg mb-2">Summary</h3>
        <p>{json?.summary || <span className="text-gray-400">No summary provided.</span>}</p>
      </div>

      {/* Flowchart */}
      <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 border border-green-200 dark:border-green-800 shadow">
        <h3 className="font-bold text-lg mb-2">Flowchart</h3>
        {json?.flowchart ? <MermaidChart chart={json.flowchart} /> : <span className="text-gray-400">No flowchart provided.</span>}
      </div>

      {/* Line-by-Line */}
      <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-4 border border-yellow-200 dark:border-yellow-800 shadow">
        <h3 className="font-bold text-lg mb-2">Line-by-Line Explanation</h3>
        {json?.lineByLine?.length ? (
          <ul className="list-disc ml-6">
            {json.lineByLine.map((item: any, idx: number) => (
              <li key={idx}><code>{item.line}</code>: {item.explanation}</li>
            ))}
          </ul>
        ) : <span className="text-gray-400">No line-by-line explanation.</span>}
      </div>

      {/* Technical Insights */}
      <div className="rounded-lg bg-purple-50 dark:bg-purple-900/20 p-4 border border-purple-200 dark:border-purple-800 shadow">
        <h3 className="font-bold text-lg mb-2">Technical Insights</h3>
        {json?.technicalInsights?.length ? (
          <ul className="list-disc ml-6">
            {json.technicalInsights.map((insight: string, idx: number) => <li key={idx}>{insight}</li>)}
          </ul>
        ) : <span className="text-gray-400">No technical insights.</span>}
      </div>

      {/* Best Practices */}
      <div className="rounded-lg bg-pink-50 dark:bg-pink-900/20 p-4 border border-pink-200 dark:border-pink-800 shadow">
        <h3 className="font-bold text-lg mb-2">Best Practices</h3>
        {json?.bestPractices?.length ? (
          <ul className="list-disc ml-6">
            {json.bestPractices.map((bp: string, idx: number) => <li key={idx}>{bp}</li>)}
          </ul>
        ) : <span className="text-gray-400">No best practices.</span>}
      </div>

      {/* Tables */}
      <div className="rounded-lg bg-orange-50 dark:bg-orange-900/20 p-4 border border-orange-200 dark:border-orange-800 shadow">
        <h3 className="font-bold text-lg mb-2">Tables</h3>
        {json?.tables?.length ? json.tables.map((table: any, idx: number) => (
          <div key={idx} className="mb-4 overflow-x-auto">
            <strong>{table.title}</strong>
            <table className="min-w-full border mt-2">
              <thead>
                <tr>
                  {table.headers.map((header: string, i: number) => (
                    <th key={i} className="border px-2 py-1 bg-gray-100 dark:bg-gray-700">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row: string[], i: number) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} className="border px-2 py-1">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )) : <span className="text-gray-400">No tables provided.</span>}
      </div>

      {/* Charts */}
      <div className="rounded-lg bg-cyan-50 dark:bg-cyan-900/20 p-4 border border-cyan-200 dark:border-cyan-800 shadow">
        <h3 className="font-bold text-lg mb-2">Charts</h3>
        {json?.charts?.length ? json.charts.map((chart: any, idx: number) => {
          const ChartComponent = chartMap[chart.type?.toLowerCase?.()];
          if (!ChartComponent || !chart.data || !Array.isArray(chart.data.datasets)) {
            return (
              <div key={idx} className="mb-4 text-red-500">
                <strong>Chart:</strong> Invalid or missing chart data.
              </div>
            );
          }
          return (
            <div key={idx} className="mb-4">
              <ChartComponent data={chart.data} options={chart.options} />
            </div>
          );
        }) : <span className="text-gray-400">No charts provided.</span>}
      </div>

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