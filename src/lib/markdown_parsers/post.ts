import DOMPurity from 'isomorphic-dompurify';
import { marked } from 'marked';
import markedKatex from 'marked-katex-extension';

marked.use(markedKatex({ throwOnError: false }));

async function parseMarkdown(markdown: string): Promise<string> {
    const sanitizedHtml = DOMPurity.sanitize(markdown);
    return await marked.parse(sanitizedHtml);
}

export default parseMarkdown;
