export default function Input({title, className, type, placeholder, onChange, value, ...props}: {title?: string, placeholder?: string, className?: string, type: React.HTMLInputTypeAttribute, value: string | number | readonly string[], onChange?: React.ChangeEventHandler<HTMLInputElement>}) {
    return <section className={className}>
        {title && <h2>{title}</h2>}
        <input type={type} onChange={onChange} placeholder={placeholder} value={value} {...props} />
    </section>;
}