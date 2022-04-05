import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

import styles from '../styles/Home.module.css'
import Navbar from '../components/Navbar'
import Login from '../components/Login'


const AboutPage: NextPage = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>Login</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Navbar />
            <div>
                <h1>Login</h1>
                <Login />
            </div>

        </div>
    )
}

export default AboutPage