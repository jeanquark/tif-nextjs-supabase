import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

import Counter from '../features/counter/Counter'
import Navbar from '../components/Navbar'
import styles from '../styles/Home.module.css'

const CounterPage: NextPage = () => {
    return (
        <>
            <Head>
                <title>Redux Toolkit</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={styles.container}>
                <header>
                    <Navbar />
                    <Counter />
                </header>
            </div>
        </>
    )
}

export default CounterPage