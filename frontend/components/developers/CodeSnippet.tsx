"use client";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeSnippet({ code, language }: { code: string; language: string }) {
  return (
    <div className="my-4 rounded-lg overflow-hidden">
      <SyntaxHighlighter language={language} style={vscDarkPlus} customStyle={{ margin: 0 }}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
