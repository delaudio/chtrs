export interface TerminalFrame {
  cols: number;
  rows: number;
  lines: { spans: {
    text: string;
    width: number;
    fg: string;
    bg: string;
    bold: boolean;
    italic: boolean;
    underline: boolean;
  }[] }[];
}
