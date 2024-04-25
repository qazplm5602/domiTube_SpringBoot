import style from './mainLayout.module.css';

import Aside from "../Aside/Aside";
import Header from "../Header/Header";
import { useState } from 'react';

export default function MainLayout({children, className, sideDisable, mainRef}: {children: React.ReactNode, className?: string, sideDisable?: boolean, mainRef?: React.LegacyRef<HTMLElement>}) {
    const sideState = useState(true);

    return <>
        <Header sideState={sideState} />
        <section className={style.content}>
            <Aside sideState={sideState} forceHide={sideDisable} />
            <main ref={mainRef} className={className}>
                {children}
            </main>
        </section>
    </>;
}