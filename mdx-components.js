export function useMDXComponents() {
    return {
        h1: ({ children }) => (
            <h1 className="mb-4 text-4xl font-bold">{children}</h1>
        ),
        h2: ({ children }) => (
            <h2 className="mb-3 text-3xl font-bold">{children}</h2>
        ),
        h3: ({ children }) => (
            <h3 className="mb-2 text-2xl font-semibold">{children}</h3>
        ),
        h4: ({ children }) => (
            <h4 className="mb-2 text-xl font-semibold">{children}</h4>
        ),
        p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
        blockquote: ({ children }) => (
            <blockquote className="pl-4 my-4 italic border-l-4 border-gray-300">
                {children}
            </blockquote>
        ),
        ul: ({ children }) => (
            <ul className="mb-4 list-disc list-inside">{children}</ul>
        ),
        li: ({ children }) => <li className="mb-2">{children}</li>,
        strong: ({ children }) => (
            <strong className="font-bold">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        hr: () => <hr className="my-8 border-t border-gray-300" />,
        table: ({ children }) => (
            <table className="w-full my-4 border-collapse border border-gray-300">
                {children}
            </table>
        ),
        thead: ({ children }) => (
            <thead className="bg-gray-800">{children}</thead>
        ),
        tr: ({ children }) => (
            <tr className="border-b border-gray-300 last:border-b-0">
                {children}
            </tr>
        ),
        th: ({ children }) => (
            <th className="px-4 py-2 text-left font-semibold">{children}</th>
        ),
        td: ({ children }) => <td className="px-4 py-2">{children}</td>,

        // Preformatted block component for fenced code blocks
        pre: ({ children }) => {
            // children will be a <code> element when MDX processes a fenced block
            const codeChild = children && children.props ? children.props : {};
            const { className = '', children: codeText } = codeChild;
            const codeString =
                typeof codeText === 'string' ? codeText.trim() : '';
            return (
                <pre className="my-4 overflow-x-auto rounded-lg p-4 bg-gray-900 text-indigo-100 font-mono text-sm">
                    <code className={className}>{codeString}</code>
                </pre>
            );
        },

        // Inline code styling for single-line snippets
        code: ({ children, className }) => {
            const codeString =
                typeof children === 'string'
                    ? children
                    : String(children).trim();
            if (codeString.includes('\n')) {
                // Multi-line code will be handled by the <pre> wrapper
                return <code className={className}>{codeString}</code>;
            }
            return (
                <code className="whitespace-pre-wrap rounded px-1.5 py-0.5 bg-gray-800 text-indigo-200 font-mono text-sm">
                    {codeString}
                </code>
            );
        },
    };
}
