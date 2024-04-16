export default function Input({title, className, type, onChange, value, ...props}: {title?: string, className?: string, type: React.HTMLInputTypeAttribute, value: string | number | readonly string[], onChange?: React.ChangeEventHandler<HTMLInputElement>}) {
    return <section className={className}>
        {title && <h2>{title}</h2>}
        <input type={type} onChange={onChange} value={value} {...props} />
    </section>;
}