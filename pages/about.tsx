import { ReactElement } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import Layout from '../components/Layout'
import NestedLayout from '../components/LayoutFrontend'
import Navbar from '../components/Navbar'
import styles from '../styles/Home.module.css'

export async function getServerSideProps({ locale }) {
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common', 'home'])),
        // Will be passed to the page component as props
      },
    };
  }

export default function AboutPage () {
    const { t } = useTranslation(['common', 'home']);

    return (
        <div className={styles.container}>
            <Head>
                <title>{t('about')}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* <Navbar /> */}
            <div>
                <h1>{t('home:about')}</h1>
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