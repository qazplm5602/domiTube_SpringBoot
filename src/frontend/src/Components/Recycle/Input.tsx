export default function Input({title, className, type, ...props}: {title?: string, className?: string, type: React.HTMLInputTypeAttribute}) {
    return <section className={className}>
        {title && <h2>{title}</h2>}
        <input type={type} {...props} />
    </section>;
}