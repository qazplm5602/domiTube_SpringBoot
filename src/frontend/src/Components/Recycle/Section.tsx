export default function Section({ title, titleClass, children, refValue, ...props }: {title?: string, titleClass?: string, children: React.ReactNode, refValue?: any, [key: string]: any}) {
    return <>
        {title && <h1 className={titleClass || ""}>{title}</h1>}
        <section ref={refValue} {...props}>
            {children}
        </section>
    </>;
}