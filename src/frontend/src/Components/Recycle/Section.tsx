export default function Section({ title, titleClass, children, ...props }: {title?: string, titleClass?: string, children: React.ReactNode, [key: string]: any}) {
    return <>
        {title && <h1 className={titleClass || ""}>{title}</h1>}
        <section {...props}>
            {children}
        </section>
    </>;
}