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
    };
}
