export function useMDXComponents() {
    return {
        h1: ({ children }) => (
            <h1 className="text-4xl font-bold mb-4">{children}</h1>
        ),
        h2: ({ children }) => (
            <h2 className="text-3xl font-bold mb-3">{children}</h2>
        ),
        p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 my-4 italic">
                {children}
            </blockquote>
        ),
        ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4">{children}</ul>
        ),
        li: ({ children }) => <li className="mb-2">{children}</li>,
        strong: ({ children }) => (
            <strong className="font-bold">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        hr: () => <hr className="my-8 border-t border-gray-300" />,
    };
}
