import { ReactElement } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

import Layout from '../components/Layout'
import NestedLayout from '../components/LayoutFrontend'
import Navbar from '../components/Navbar'
import styles from '../styles/Home.module.css'

export default function AboutPage () {
    return (
        <div className={styles.container}>
            <Head>
                <title>About</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* <Navbar /> */}
            <div>
                <h1>About</h1>
            </div>

        </div>
    )
}

// export default AboutPage

AboutPage.getLayout = function getLayout(page: ReactElement) {
	return (
		<Layout>
			<NestedLayout>{page}</NestedLayout>
		</Layout>
	)
}