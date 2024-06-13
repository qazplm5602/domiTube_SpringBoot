export default function Input({title, className, type, placeholder, onChange, onFocus, onBlur, value, ...props}: {title?: string, placeholder?: string, className?: string, type: React.HTMLInputTypeAttribute, value: string | number | readonly string[], onChange?: React.ChangeEventHandler<HTMLInputElement>, onFocus?: React.FocusEventHandler<HTMLInputElement>, onBlur?: React.FocusEventHandler<HTMLInputElement>}) {
    return <section className={className}>
        {title && <h2>{title}</h2>}
        <input type={type} onChange={onChange} placeholder={placeholder} value={value} onFocus={onFocus} onBlur={onBlur} {...props} />
    </section>;
}