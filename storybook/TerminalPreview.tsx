import frames from "./generated/frames.json";
import type { TerminalFrame } from "./frame";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/700.css";
import "./preview.css";

export interface TerminalPreviewProps { frameId: keyof typeof frames }

export function TerminalPreview({ frameId }: TerminalPreviewProps) {
  const frame: TerminalFrame = frames[frameId];
  if (!frame) throw new Error(`Missing native frame: ${frameId}. Run bun run storybook:frames.`);
  return <div data-visual-snapshot-root data-frame-id={frameId} role="img"
    aria-label={`Native terminal preview: ${frameId}, ${frame.cols} columns by ${frame.rows} rows`}
    className="terminal-frame" style={{ width: frame.cols * 9, height: frame.rows * 20 }}>
    {frame.lines.map((line, row) => <div className="terminal-line" key={row}>
      {line.spans.map((span, index) => <span key={index} style={{
        width: span.width * 9, color: span.fg, background: span.bg,
        fontWeight: span.bold ? 700 : 400, fontStyle: span.italic ? "italic" : "normal",
        textDecoration: span.underline ? "underline" : "none",
      }}>{span.text}</span>)}
    </div>)}
  </div>;
}
