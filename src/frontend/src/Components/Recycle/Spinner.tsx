import style from './spinner.module.css';

export default function Spinner({className}: {className?: string}) {
    const classList = [style.loader];
    if (className !== undefined)
        classList.push(className);

    return <div className={classList.join(" ")}></div>;
}