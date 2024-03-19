import style from './mainLayout.module.css';

import Aside from "../Aside/Aside";
import Header from "../Header/Header";
import { useState } from 'react';

export default function MainLayout({children}: {children: React.ReactNode}) {
    const sideState = useState(true);

    return <>
        <Header sideState={sideState} />
        <section className={style.content}>
            <Aside sideState={sideState} />
            <main>
                {children}
            </main>
        </section>
    </>;
}