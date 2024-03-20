import style from './mainLayout.module.css';

import Aside from "../Aside/Aside";
import Header from "../Header/Header";
import { useState } from 'react';

export default function MainLayout({children, className}: {children: React.ReactNode, className?: string}) {
    const sideState = useState(true);

    return <>
        <Header sideState={sideState} />
        <section className={style.content}>
            <Aside sideState={sideState} />
            <main className={className}>
                {children}
            </main>
        </section>
    </>;
}