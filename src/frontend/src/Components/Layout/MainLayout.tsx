import style from './mainLayout.module.css';

import Aside from "../Aside/Aside";
import Header from "../Header/Header";

export default function MainLayout({children}: {children: React.ReactNode}) {
    return <>
        <Header />
        <section className={style.content}>
            <Aside />
            <main>
                {children}
            </main>
        </section>
    </>;
}