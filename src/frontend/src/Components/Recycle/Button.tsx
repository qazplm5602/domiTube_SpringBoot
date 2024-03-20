export default function Button({children, icon, ...props}: {children?: React.ReactNode, icon?: string, [key: string]: any}) {
    return <button {...props}>
        {icon && <img src={icon} />}
        {children}
    </button>;
}