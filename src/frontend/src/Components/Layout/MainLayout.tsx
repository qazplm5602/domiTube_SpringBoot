import style from './mainLayout.module.css';

import Aside from "../Aside/Aside";
import Header from "../Header/Header";
import { useState } from 'react';

export default function MainLayout({children, className, sideDisable}: {children: React.ReactNode, className?: string, sideDisable?: boolean}) {
    const sideState = useState(true);

    return <>
        <Header sideState={sideState} />
        <section className={style.content}>
            <Aside sideState={sideState} forceHide={sideDisable} />
            <main className={className}>
                {children}
            </main>
        </section>
    </>;
}